import React, { useState, useEffect, useRef } from 'react'
import { DivIcon } from 'leaflet'
import { useTranslation } from 'react-i18next'
import { Marker, Popup, useLeaflet } from 'react-leaflet'
import { svg } from '../shared/svg'
import { boardToVehicle, trackerToBoard } from '../shared/vehicles'
import classes from './routes-positions.module.scss'
import { useRtecClient } from '../shared/rtec-client/rtec-client.hook'
import { Message } from 'webstomp-client'
import { telemetryRoute, TelemetryRouteFrameBody } from '../shared/rtec-client/subscriptions/telemetry.route'
import { useRouteColors } from '../route-colors.context'
import { generateMailto } from '../shared/report-tools'
import { ADDRESS_FEEDBACK_CC, ADDRESS_FEEDBACK_TO } from '../shared/constants'
import { eventRoute, EventRouteFrameBody } from '../shared/rtec-client/subscriptions/event.route'

const navigationSvgPath = `M 12.037109,3.2597656 C 7.46559,3.2596004 3.7596004,6.96559 3.7597656,11.537109 c -1.655e-4,4.571519 3.7058242,8.277509 8.2773434,8.277344 4.571519,1.66e-4 8.27751,-3.705825 8.277344,-8.277344 1.65e-4,-4.5715192 -3.705825,-8.2775089 -8.277344,-8.2773434 z`

const MARKER_TTL_MILLIS = 5 * 60 * 1000
const TTL_CHECK_INTERVAL_MILLIS = 60 * 1000

// Delay before board will be deleted from positions object after remove event
const REMOVE_EVENT_TTL_MILLIS = 4000
// Step to decrease marker opacity from 1 to 0
const FADE_OUT_STEP = 0.1
const FADE_OUT_DELAY_MILLIS = REMOVE_EVENT_TTL_MILLIS * FADE_OUT_STEP

type Props = {
  selectedRoutes: Set<string>
}

function useTransitionOnZoomEvent(): boolean {
  const leafletContext = useLeaflet()
  const [noTransition, setNoTransition] = useState<boolean>(false)

  useEffect(() => {
    let timerId

    leafletContext.map?.on('zoomstart', () => {
      clearTimeout(timerId)
      setNoTransition(true)
    })
    leafletContext.map?.on('zoomend', () => {
      timerId = setTimeout(() => setNoTransition(false), 1000)
    })

    return () => clearTimeout(timerId)
  }, [leafletContext.map])

  return noTransition
}

export function RoutesPositions(props: Props) {
  const routesIDs = Array.from(props.selectedRoutes)
  const client = useRtecClient()
  const noTransition = useTransitionOnZoomEvent()

  return (
    <React.Fragment>
      {routesIDs.map(id => (
        <RouteMarkers key={id} routeId={id} client={client} noTransition={noTransition} />
      ))}
    </React.Fragment>
  )
}

function RouteMarkers({ routeId, client, noTransition }) {
  const positions = usePositions(routeId, client)
  return (
    <React.Fragment>
      {Object.values(positions).map(p => (
        <TransportMarker key={p.board} transport={p} noTransition={noTransition} />
      ))}
    </React.Fragment>
  )
}

type Positions = {
  [board: string]: TransportType
}

function usePositions(routeId: string | number, client: ReturnType<typeof useRtecClient>) {
  const { connected, subscribe } = client
  const [positions, setPositions] = useState<Positions>({})

  useEffect(() => {
    const interval = setInterval(() => {
      const nowMillis = new Date().getTime()

      const newPositions = Object.keys(positions).reduce(
        (accum, key) => ({
          ...accum,
          [key]: {
            ...positions[key],
            outdated: nowMillis - new Date(positions[key].timestamp).getTime() >= MARKER_TTL_MILLIS,
          },
        }),
        {},
      )

      setPositions(newPositions)
    }, TTL_CHECK_INTERVAL_MILLIS)

    return () => clearInterval(interval)
  }, [positions])

  useEffect(
    function() {
      // Client is not connected yet, we can't subscribe
      if (!connected) {
        return
      }

      const subscription = subscribe(telemetryRoute(routeId), function(message: Message) {
        const pos: TelemetryRouteFrameBody = JSON.parse(message.body)
        setPositions(p => {
          const oldPos = p[pos.board]
          return {
            ...p,
            [pos.board]: {
              ...pos,
              direction: oldPos ? calculateDirection(pos.direction, pos.speed, oldPos.direction) : pos.direction,
              outdated: false,
              routeId,
            },
          }
        })
      })

      // this will be called whenever routeId will change or component will unmount
      return () => subscription.unsubscribe()
    },
    [connected, subscribe, routeId],
  )

  useRemoveEvent(routeId, client, setPositions)

  return positions
}

function useRemoveEvent(
  routeId: string | number,
  client: ReturnType<typeof useRtecClient>,
  setPositions: React.Dispatch<React.SetStateAction<Positions>>,
) {
  const { connected, subscribe } = client
  useEffect(() => {
    // Client is not connected yet, we can't subscribe
    if (!connected) {
      return
    }

    let timerId

    const subscription = subscribe(eventRoute(routeId), (message: Message) => {
      const event: EventRouteFrameBody = JSON.parse(message.body)
      if (event.event === 'remove') {
        setPositions(p => {
          const oldPos = p[event.board]
          return {
            ...p,
            [event.board]: {
              ...oldPos,
              isRemoved: true,
            },
          }
        })

        timerId = setTimeout(() => {
          setPositions(p => {
            delete p[event.board]
            return {
              ...p,
            }
          })
        }, REMOVE_EVENT_TTL_MILLIS)
      }
    })

    // this will be called whenever routeId will change or component will unmount
    return () => {
      subscription.unsubscribe()
      clearTimeout(timerId)
    }
  }, [connected, subscribe, routeId, setPositions])
}

function calculateDirection(newDir: number, newSpeed: number, oldDir: number) {
  const delta = newDir - oldDir

  // Not moving, its direction is often reported as 0, which is probably
  // not right (unless it moves due North); so we'll keep the previous
  // value of `direction` instead. If it does go straight North, then
  // oldDirection will be 0, so we shall render it correctly.
  return newSpeed === 0
    ? oldDir
    : // It is moving, but the delta between the current direction and the
    // old one is above 30 degrees, which is probably too sharp of a turn,
    // so most likely it is a noisy reading from the GPS tracker. Thus,
    // we turn it half-way, to make it look smoother.
    // 30 degrees was chosen empirically.
    newSpeed > 0 && Math.abs(delta) > 30
    ? newDir - delta / 2
    : newSpeed
}

type TransportType = TelemetryRouteFrameBody & { outdated?: boolean; routeId: string | number; isRemoved?: boolean }

type TransportMarkerProps = {
  transport: TransportType
  noTransition: boolean
}

function TransportMarker(props: TransportMarkerProps) {
  const { transport, noTransition } = props
  const { t } = useTranslation()
  const { colors } = useRouteColors()

  const opacityRef = useRef<number>(1)
  useEffect(() => {
    if (!transport.isRemoved) {
      return
    }

    const timerId = setInterval(() => {
      if (opacityRef.current <= 0) {
        clearInterval(timerId)
      }
      opacityRef.current -= FADE_OUT_STEP
    }, FADE_OUT_DELAY_MILLIS)

    return () => clearInterval(timerId)
  }, [transport.isRemoved])

  /**
   * To show an oriented marker, we have to work around a limitation
   * of `react-leaflet`. There is no straightforward way of rotating
   * the marker, so we overcome this by wrapping it in an invisible
   * container, and then adding another HTML element inside, which
   * will use the `arrow` class with a `transform: rotate`.
   * TODO: improve performance
   */

  const icon = new DivIcon({
    className: `${classes.markerImg} ${noTransition ? classes.markerImgNoTransition : ''}`,
    iconSize: [25, 25],
    html: `<div>${svg(
      navigationSvgPath,
      `fill:${
        transport.outdated || isTransportWithinTrolleyPark(transport)
          ? 'grey'
          : colors[transport.routeId]?.marker || 'blue'
      };transform: rotate(${transport.direction}deg)`,
    )}<span style="color:${colors[transport.routeId]?.text || 'lightgrey'};">${transport.route}</span></div>`,
  })

  /**
   * To determine whether to display the accessibility symbol or not, we
   * check if this trackerId is known and is associated with a board number.
   * If so, we check the `accessibility` attribute of that board
   */
  const board = trackerToBoard.get(transport.rtu_id)
  const vehicle = board ? boardToVehicle.get(board) : undefined
  const accessibility = vehicle && vehicle.accessibility ? ' ♿' : undefined

  return opacityRef.current > 0 ? (
    <Marker
      key={transport.board}
      title={transport.board}
      position={[transport.latitude, transport.longitude]}
      opacity={opacityRef.current}
      icon={icon}>
      <Popup>
        {`${t('label.route')}: ${transport.route}`}
        <br />
        {`${t('label.board')}: ${transport.board}`}
        {accessibility}
        {transport.outdated && (
          <>
            <br />
            {t('label.lastSeen', { n: fromNowMinutes(new Date(transport.timestamp)) })}
          </>
        )}
        <br />
        <br />
        <strong>{t('label.reportProblem')}</strong>

        <ul className={classes.problemList}>
          <li>
            <a
              className={classes.problemLink}
              children={t('label.reportProblem.routeMapping')}
              href={generateMailto(
                ADDRESS_FEEDBACK_TO,
                t('feedback.subject.routeMapping', { board: transport.board }),
                [
                  t('feedback.body.header', { board: transport.board, timestamp: new Date().toLocaleString() }),
                  t('feedback.body.routeMapping', { route: transport.route }),
                  t('feedback.body.thanks'),
                ].join('\n\n'),
                ADDRESS_FEEDBACK_CC,
              )}
            />
          </li>
          <li>
            <a
              className={classes.problemLink}
              children={t('label.reportProblem.onboard')}
              href={generateMailto(
                ADDRESS_FEEDBACK_TO,
                t('feedback.subject.onboard', { board: transport.board }),
                [
                  t('feedback.body.header', { board: transport.board, timestamp: new Date().toLocaleString() }),
                  t('feedback.body.onboard'),
                  t('feedback.body.thanks'),
                ].join('\n\n'),
                undefined, // note that this is an RTEC-specific problem, so we're not CCing the supervisor
              )}
            />
          </li>
          <li>
            <a
              className={classes.problemLink}
              children={t('label.reportProblem.corruption')}
              href={generateMailto(
                ADDRESS_FEEDBACK_TO,
                t('feedback.subject.corruption', { board: transport.board }),
                [
                  t('feedback.body.header', { board: transport.board, timestamp: new Date().toLocaleString() }),
                  t('feedback.body.corruption'),
                  t('feedback.body.thanks'),
                ].join('\n\n'),
                undefined, // note that this is an RTEC-specific problem, so we're not CCing the supervisor
              )}
            />
          </li>
        </ul>
      </Popup>
    </Marker>
  ) : null
}

function fromNowMinutes(date: Date): number {
  return Math.floor((new Date().getTime() - date.getTime()) / (60 * 1000))
}

const trolleyParks = [
  {
    name: 'Buiucani',
    polygon: [
      [47.03782046385607, 28.81591558456421],
      [47.035422117402916, 28.82065773010254],
      [47.03597784141986, 28.82155895233154],
      [47.037878958764374, 28.818544149398804],
    ],
  },
  {
    name: 'Botanica',
    polygon: [
      [46.987505737947956, 28.88427972793579],
      [46.98884505415609, 28.885556459426883],
      [46.988479124097836, 28.886511325836178],
      [46.98729349350121, 28.888131380081173],
      [46.98627617221127, 28.886168003082272],
    ],
  },
  {
    name: 'Ciocana',
    polygon: [
      [47.02578377253985, 28.88381838798523],
      [47.025578993676476, 28.887734413146973],
      [47.029286832141274, 28.888195753097534],
      [47.02950622279598, 28.88421535491943],
    ],
  },
]

function isTransportWithinTrolleyPark(transport: TransportType): boolean {
  for (const park of trolleyParks) {
    if (isPointInsidePolygon([transport.latitude, transport.longitude], park.polygon)) {
      return true
    }
  }
  return false
}

function isPointInsidePolygon(point: [number, number], polyPoints: number[][]): boolean {
  const x = point[0]
  const y = point[1]

  let inside = false
  for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
    const xi = polyPoints[i][0]
    const yi = polyPoints[i][1]

    const xj = polyPoints[j][0]
    const yj = polyPoints[j][1]

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }

  return inside
}
