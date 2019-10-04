import React from 'react'
import { Map, TileLayer, Viewport, Marker, GeoJSON } from 'react-leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './style.css'
import { Positions } from './use-positions'

// import geodata from './data/route_2_full.json'
import geodataSegments from './data/route_2_segments.json'
import geodataStations from './data/route_2_stations.json'

// Applying the workaround, otherwise station markers are not rendered
// https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-264311098
// This seems to be a known issue, and other workarounds failed, e.g.:
// https://github.com/PaulLeCam/react-leaflet/issues/453#issuecomment-410450387
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
})
L.Marker.prototype.options.icon = DefaultIcon
/////////////////////end of workaround

interface CustomViewport extends Viewport {
  isAnimatedMarker?: boolean
}

const state: CustomViewport = {
  center: [47.0229, 28.8353],
  zoom: 13,
  isAnimatedMarker: true,
}

 export function BasicMap() {
   const [isAnimatedMarker, setIsAnimatedMarker] = React.useState(true)
  return (
    <Map
      id={'map'}
      style={{ height: '100vh' }}
      zoomControl={false}
      onzoomstart={() => (state.isAnimatedMarker = false)}
      onzoomend={() => (state.isAnimatedMarker = true)}
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
                className: `arrow-container ${
                  state.isAnimatedMarker ? 'animated-marker' : ''
                }`,
                html: `<div class="arrow" style="transform: rotate(${p.direction}deg)"></div>`,
              })}
            />
          ))
        }
      </Positions>
      <GeoJSON key="route-stations" data={geodataStations as any} />

      <GeoJSON key="route-segments" data={geodataSegments as any} />
    </Map>
  )
}
