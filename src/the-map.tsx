import React from 'react'
import { Map, TileLayer, Viewport, Marker, GeoJSON } from 'react-leaflet'
import { GeoJsonObject } from 'geojson'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ErrorBoundary } from './components/error-boundary'
import './style.css'
import { Positions } from './use-positions'

const state: Viewport = {
  center: [47.0229, 28.8353],
  zoom: 13,
}

type Props = {
  selectedRoutes: Set<string>
}

export function TheMap({ selectedRoutes }: Props) {
  const [isAnimatedMarker, setIsAnimatedMarker] = React.useState(true)
  const { routesSegments, routesStations } = useRoutesData(selectedRoutes)

  return (
    <Map
      id={'map'}
      style={{ height: '100vh' }}
      zoomControl={false}
      onzoomstart={() => setIsAnimatedMarker(false)}
      onzoomend={() => setIsAnimatedMarker(true)}
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
                  isAnimatedMarker ? 'animated-marker' : ''
                }`,
                html: `<div class="arrow" style="transform: rotate(${p.direction}deg)"></div>`,
              })}
            />
          ))
        }
      </Positions>

      {Object.entries(routesSegments).map(([id, rs]) =>
        selectedRoutes.has(id) ? (
          <ErrorBoundary>
            <GeoJSON key={`route-segments-${id}`} data={rs!} />
          </ErrorBoundary>
        ) : (
          undefined
        ),
      )}

      {Object.entries(routesStations).map(([id, rs]) =>
        selectedRoutes.has(id) ? (
          <ErrorBoundary>
            <GeoJSON
              key={`route-stations-${id}`}
              data={rs!}
              style={() => ({
                title: 'uniqueTitleqwe',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                color: '#00FF00',
                weight: 0.9,
                fillColor: '#1a1d62',
                fillOpacity: 1,
              })}
              onEachFeature={(feature, layer) =>
                // TODO consider using `name:ru` to load the Russian label,
                // depending on the user-agent's language setting
                layer.bindPopup(feature.properties.tags.name)
                // console.log(feature)
                // console.log(layer)
              }
            />
          </ErrorBoundary>
        ) : (
          undefined
        ),
      )}
    </Map>
  )
}

type RoutesState = {
  [key: string]: GeoJsonObject
}

function useRoutesData(selectedRoutes) {
  const [routesSegments, setRoutesSegments] = React.useState<RoutesState>({})
  const [routesStations, setRoutesStations] = React.useState<RoutesState>({})

  React.useEffect(
    function() {
      selectedRoutes.forEach((routeId: string) => {
        if (!routesSegments[routeId]) {
          import(
            /* webpackChunkName: "[request]" */
            `./data/route_${routeId}_segments.json`
          )
            .then(routeSegments =>
              setRoutesSegments(rs => ({
                ...rs,
                [routeId]: routeSegments.default,
              })),
            )
            .catch(console.log)
        }

        if (!routesStations[routeId]) {
          import(
            /* webpackChunkName: "[request]" */
            `./data/route_${routeId}_stations.json`
          )
            .then(routeStations =>
              setRoutesStations(rs => ({
                ...rs,
                [routeId]: routeStations.default,
              })),
            )
            .catch(console.log)
        }
      })
    },
    [routesSegments, routesStations, selectedRoutes, selectedRoutes.size],
  )

  return { routesSegments, routesStations }
}
