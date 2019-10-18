import React from 'react'
import {
  Map,
  TileLayer,
  Viewport,
  Marker,
  GeoJSON,
  Popup,
  ZoomControl,
} from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import { GeoJsonObject } from 'geojson'
import { Map as LeafletMap, icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ErrorBoundary } from './components/error-boundary'
import { Positions } from './use-positions'
import { UserLocation } from './components/user-location.component'
import { useSettingsState } from './settings.context'
import { getLocation } from './shared/geo-position'
import { svgDataUri } from './shared/svg'
import { vehicles, trackers } from './data/vehicles'

type Props = {
  selectedRoutes: Set<string>
  showUserLocation?: number
}

const viewport: Viewport = {
  center: [47.0229, 28.8353],
  zoom: 13,
}

const navigationSvgPath = 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z'

export function TheMap(props: Props) {
  const { t } = useTranslation()
  const { selectedRoutes, showUserLocation } = props
  const { routesSegments, routesStations } = useRoutesData(selectedRoutes)
  const { leftHanded } = useSettingsState()
  const mapRef = React.useRef<any>()

  React.useEffect(
    function () {
      if (showUserLocation) {
        getLocation().then(pos => {
          const map = mapRef.current!.contextValue!.map! as LeafletMap
          const center: [number, number] = [
            pos.coords.latitude,
            pos.coords.longitude,
          ]
          map.flyTo(center)
        })
      }
    },
    [showUserLocation],
  )

  return (
    <Map
      ref={mapRef}
      id={'roata-way-hai-hai'}
      style={{ height: '100vh' }}
      maxZoom={19}
      zoomControl={false}
      viewport={viewport}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {showUserLocation && <UserLocation />}

      <ZoomControl position={leftHanded ? 'bottomleft' : 'bottomright'} />

      <Positions>
        {positions =>
          Object.values(positions).map((p: any) => (
            <Marker
              onClick={event => {
                let boardName = event.sourceTarget.options.position.board
                console.log('Clicked on vehicle ' + boardName)
              }}
              key={p.board}
              title={p.board}
              position={p}
              // To show an oriented marker, we have to work around a limitation
              // of `react-leaflet`. There is no straightforward way of rotating
              // the marker, so we overcome this by wrapping it in an invisible
              // container, and then adding another HTML element inside, which
              // will use the `arrow` class with a `transform: rotate`.
              icon={icon({
                iconSize: [25, 25],
                iconUrl: svgDataUri(
                  navigationSvgPath,
                  `fill:blue;transform: rotate(${p.direction}deg)`,
                ),
              })}>
              <Popup>
                {t('label.board')}: {p.board}
                {/* To determine whether to display the accessibility symbol or not, we
                    check if this trackerId is known and is associated with a board number.
                    If so, we check the `accessibility` attribute of that board*/}
                {trackers.has(p.trackerId) &&
                  vehicles.has(trackers.get(p.trackerId)) &&
                  vehicles.get(trackers.get(p.trackerId)).accessibility &&
                  '♿'}
                {/*  TODO - find a way to determine the current route of this vehicle
                        and display it in the popup. This will only be possible after
                        RTEC regularly provides route-vehicle maps
                <br />
                {t('label.route')}: xx */}
              </Popup>
            </Marker>
          ))
        }
      </Positions>

      {Object.entries(routesSegments).map(([id, rs]) =>
        selectedRoutes.has(id) ? (
          <ErrorBoundary key={`route-segments-${id}`}>
            <GeoJSON data={rs!} />
          </ErrorBoundary>
        ) : (
            undefined
          ),
      )}

      {Object.entries(routesStations).map(([id, rs]) =>
        selectedRoutes.has(id) ? (
          <ErrorBoundary key={`route-stations-${id}`}>
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
              onEachFeature={(feature, layer) => {
                // TODO consider using `name:ru` to load the Russian label,
                // depending on the user-agent's language setting (if the
                // translation string is available in the JSON)
                layer.bindPopup(feature.properties.tags.name)
              }}
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
    function () {
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
