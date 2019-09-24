import React from 'react'
import { Map, TileLayer, Viewport, Marker } from 'react-leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './style.css'
import { Positions } from './use-positions'

const state: Viewport = {
  center: [47.0229, 28.8353],
  zoom: 13,
}

export function BasicMap() {
  return (
    <Map
      id={'map'}
      style={{ height: '100vh' }}
      zoomControl={false}
      viewport={state}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Positions>
        {positions =>
          Object.values(positions).map((p: any) => (
            <Marker
              key={p.board}
              title={p.board}
              position={p}
              rotationAngle={p.direction}
              rotationOrigin={'center center'}
              icon={divIcon({
                className: 'bus-location',
              })}
            />
          ))
        }
      </Positions>
    </Map>
  )
}
