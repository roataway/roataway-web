import React from 'react'
import { GeoJsonObject } from 'geojson'
import { Icon, marker } from 'leaflet'
import { GeoJSON } from 'react-leaflet'
import { ErrorBoundary } from './error-boundary'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const icon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

export function RoutesStations({ selectedRoutes }) {
  const [routesStations, setRoutesStations] = React.useState<{
    [key: string]: GeoJsonObject
  }>({})

  React.useEffect(
    function() {
      selectedRoutes.forEach((routeId: string) => {
        if (!routesStations[routeId]) {
          import(
            /* webpackChunkName: "[request]" */
            `../data/route_${routeId}_stations.json`
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
    [routesStations, selectedRoutes, selectedRoutes.size],
  )

  return (
    <React.Fragment>
      {Object.entries(routesStations).map(([id, rs]) =>
        selectedRoutes.has(id) ? (
          <ErrorBoundary key={`route-stations-${id}`}>
            <GeoJSON
              key={`route-stations-${id}`}
              data={rs!}
              pointToLayer={(_, latlng) => marker(latlng, { icon })}
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
    </React.Fragment>
  )
}
