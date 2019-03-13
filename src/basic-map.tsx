import React from 'react'
import { Map, TileLayer, Viewport, Marker } from 'react-leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './style.css'
import { usePositions } from './use-positions'

const state: Viewport = {
  center: [47.0229, 28.8353],
  zoom: 13,
}

export function BasicMap() {
  const positions = usePositions()
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
      {Object.values(positions).map(p => (
        <Marker
          key={p.board}
          position={p}
          icon={divIcon({
            className: 'bus-location',
          })}
        />
      ))}
    </Map>
  )
}
