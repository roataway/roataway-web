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

// import geodata from './data/route_2_full.json'
import geodataSegments from './data/route_2_segments.json'
import geodataStations from './data/route_2_stations.json'

const state: Viewport = {
  center: [47.0229, 28.8353],
  zoom: 13,
}

function getStyleEx(feature) {
  // this will return a different color scheme and style, depending
  // on the type of feature
  console.log(feature)
  return {
    color: '#006400',
    weight: 5,
    opacity: 0.65,
  }
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
        key="route-stations"
        data={geodataStations as any}
        style={() => ({
          color: '#FF00FF',
          weight: 9,
          opacity: 0.95,
        })}

        // style={(feature: any) => ({
        //   switch(feature){}
        //   // color: '#006400',
        //   // weight: 5,
        //   // opacity: 0.65
        // })}

        // style= (feature) => (
        //   console.log(feature)
        //   return {{
        //   color: '#4a83ec',
        //   weight: 0.5,
        //   fillColor: '#1a1d62',
        //   fillOpacity: 1,
        // }})
      />

      <GeoJSON key="route-segments" data={geodataSegments as any} />

      <FeatureGroup color="purple">
        <Popup>Popup in FeatureGroup</Popup>
        <Circle center={[47.0229, 28.8353]} radius={200} />
      </FeatureGroup>
    </Map>
  )
}
