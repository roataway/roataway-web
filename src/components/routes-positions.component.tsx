import React, { useState, useEffect } from 'react'
import { Icon } from 'leaflet'
import { useTranslation } from 'react-i18next'
import { Marker, Popup } from 'react-leaflet'
import { svgDataUri } from '../shared/svg'
import { boardToVehicle, trackerToBoard } from '../shared/vehicles'
import classes from './routes-positions.module.scss'
import { useRtecClient } from '../shared/rtec-client/rtec-client.hook'
import { Message } from 'webstomp-client'
import {
  TelemetryRouteFrameBody,
  telemetryRoute,
} from '../shared/rtec-client/subscriptions/telemetry.route'

const navigationSvgPath = 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z'

type Props = {
  selectedRoutes: Set<string>
}

export function RoutesPositions(props: Props) {
  const routesIDs = Array.from(props.selectedRoutes)
  const client = useRtecClient()
  return (
    <React.Fragment>
      {routesIDs.map(id => (
        <RouteMarkers key={id} routeId={id} client={client} />
      ))}
    </React.Fragment>
  )
}

function RouteMarkers({ routeId, client }) {
  const positions = usePositions(routeId, client)
  return (
    <React.Fragment>
      {Object.values(positions).map(p => (
        <TransportMarker key={p.board} transport={p} />
      ))}
    </React.Fragment>
  )
}

type Positions = {
  [board: string]: TelemetryRouteFrameBody
}

function usePositions(
  routeId: string | number,
  client: ReturnType<typeof useRtecClient>,
) {
  const { connected, subscribe } = client
  const [positions, setPositions] = useState<Positions>({})

  useEffect(
    function() {
      // Client is not connected yet, we can't subscribe
      if (!connected) {
        return
      }

      const subscription = subscribe(telemetryRoute(routeId), function(
        message: Message,
      ) {
        const pos: TelemetryRouteFrameBody = JSON.parse(message.body)
        setPositions(p => {
          const oldPos = p[pos.board]
          return {
            ...p,
            [pos.board]: {
              ...pos,
              direction: oldPos
                ? calculateDirection(pos.direction, pos.speed, oldPos.direction)
                : pos.direction,
            },
          }
        })
      })

      // this will be called whenever routeId will change or component will unmount
      return () => subscription.unsubscribe()
    },
    [connected, subscribe, routeId],
  )

  return positions
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

type TransportMarkerProps = {
  transport: TelemetryRouteFrameBody
}

function TransportMarker(props: TransportMarkerProps) {
  const { transport } = props
  const { t } = useTranslation()

  /**
   * To show an oriented marker, we have to work around a limitation
   * of `react-leaflet`. There is no straightforward way of rotating
   * the marker, so we overcome this by wrapping it in an invisible
   * container, and then adding another HTML element inside, which
   * will use the `arrow` class with a `transform: rotate`.
   * TODO: improve performance
   */
  const icon = new Icon({
    className: classes.markerImg,
    iconSize: [25, 25],
    iconUrl: svgDataUri(
      navigationSvgPath,
      `fill:blue;transform: rotate(${transport.direction}deg)`,
    ),
  })

  /**
   * To determine whether to display the accessibility symbol or not, we
   * check if this trackerId is known and is associated with a board number.
   * If so, we check the `accessibility` attribute of that board
   */
  const board = trackerToBoard.get(transport.rtu_id)
  const vehicle = board ? boardToVehicle.get(board) : undefined
  const accessibility = vehicle && vehicle.accessibility ? ' ♿' : undefined

  return (
    <Marker
      key={transport.board}
      title={transport.board}
      position={[transport.latitude, transport.longitude]}
      icon={icon}>
      <Popup>
        {`${t('label.board')}: ${transport.board}`}
        {accessibility}
      </Popup>
    </Marker>
  )
}
