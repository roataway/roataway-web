import React from 'react'
import { icon } from 'leaflet'
import { useTranslation } from 'react-i18next'
import { Marker, Popup } from 'react-leaflet'
import { svgDataUri } from '../shared/svg'
import { Positions } from '../use-positions'
import { vehicles, trackers } from '../data/vehicles'
import classes from './routes-positions.module.scss'

const navigationSvgPath = 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z'

export function RoutesPositions() {
  const { t } = useTranslation()
  return (
    <Positions>
      {positions =>
        Object.values(positions).map((p: any) => (
          <Marker
            key={p.board}
            title={p.board}
            position={p}
            // To show an oriented marker, we have to work around a limitation
            // of `react-leaflet`. There is no straightforward way of rotating
            // the marker, so we overcome this by wrapping it in an invisible
            // container, and then adding another HTML element inside, which
            // will use the `arrow` class with a `transform: rotate`.
            icon={icon({
              className: classes.markerImg,
              iconSize: [25, 25],
              iconUrl: svgDataUri(
                navigationSvgPath,
                `fill:blue;transform: rotate(${p.direction}deg)`,
              ),
            })}>
            <Popup>
              {`${t('label.board')}: ${p.board}`}
              {/**
               * To determine whether to display the accessibility symbol or not, we
               * check if this trackerId is known and is associated with a board number.
               * If so, we check the `accessibility` attribute of that board
               */}
              {trackers.has(p.trackerId) &&
                (vehicles.has(trackers.get(p.trackerId)) &&
                  (vehicles.get(trackers.get(p.trackerId)).accessibility &&
                    ' ♿'))}
              {/**
               * TODO - find a way to determine the current route of this vehicle
               * and display it in the popup. This will only be possible after
               * RTEC regularly provides route-vehicle maps
               */}
              <br />
              {`${t('label.route')}: ##`}
            </Popup>
          </Marker>
        ))
      }
    </Positions>
  )
}
