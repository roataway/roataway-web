import React from 'react'
import {
  Map,
  TileLayer,
  Viewport,
  Marker,
  FeatureGroup,
  Popup,
  Circle,
  GeoJSON,
} from 'react-leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './style.css'
import { Positions } from './use-positions'

// import geodata from './data/route_2_full.json';

const state: Viewport = {
  center: [47.0229, 28.8353],
  zoom: 13,
}

let geodata = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        style: 'stripe',
        name: 'Loisirs Lavoie et St-Jean-Baptiste',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-71.729270299794578, 48.010418784700107],
            [-71.291070323784993, 48.004374022337799],
            [-71.291070323784993, 47.777183877693901],
            [-71.729270299794578, 47.786290622064854],
            [-71.729270299794578, 48.010418784700107],
          ],
        ],
      },
    },
  ],
}

// import('.data/route_1_segments.json')

export function BasicMap() {
  console.log(geodata)
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
              // To show an oriented marker, we have to work around a limitation
              // of `react-leaflet`. There is no straightforward way of rotating
              // the marker, so we overcome this by wrapping it in an invisible
              // container, and then adding another HTML element inside, which
              // will use the `arrow` class with a `transform: rotate`.
              icon={divIcon({
                className: 'arrow-container',
                html:
                  '<div class="arrow" style="transform: rotate(' +
                  p.direction +
                  'deg)">',
              })}
            />
          ))
        }
      </Positions>
      <GeoJSON
        key="unique"
        data={geodata}
        style={() => ({
          color: '#4a83ec',
          weight: 0.5,
          fillColor: '#1a1d62',
          fillOpacity: 1,
        })}
      />

      <FeatureGroup color="purple">
        <Popup>Popup in FeatureGroup</Popup>
        <Circle center={[47.0229, 28.8353]} radius={200} />
      </FeatureGroup>
    </Map>
  )
}
