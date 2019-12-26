import React, { useState, useEffect, useRef } from 'react'
import { FeatureCollection, Point, Feature } from 'geojson'
import { Icon, marker, Layer } from 'leaflet'
import { GeoJSON } from 'react-leaflet'
import uniqBy from 'lodash.uniqby'
import { ErrorBoundary } from '../shared/error-boundary'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const icon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  // `markerIcon` size is 25x41
  // https://leafletjs.com/reference-1.5.0.html#icon-iconanchor
  iconAnchor: [12, 41],
})

export function RoutesStations({ selectedRoutes }) {
  const { stations, stationsUpdatedCount } = useStationsFeatureCollection(selectedRoutes)

  return (
    <ErrorBoundary>
      <GeoJSON
        // GeoJSON does not rerender when `data` is changed
        // use react `key` that will trigger a rerender everytime key changes
        key={stationsUpdatedCount}
        data={stations}
        pointToLayer={(_, latlng) => marker(latlng, { icon })}
        onEachFeature={onEachFeature}
      />
    </ErrorBoundary>
  )
}

type StationProperties = {
  id: number
  name?: string
  tags?: {
    name: string
  }
}
type StationsFeatureCollection = FeatureCollection<Point, StationProperties>
const emptyFeatureCollection: StationsFeatureCollection = {
  type: 'FeatureCollection',
  features: [],
}

function useStationsFeatureCollection(selectedRoutes: Set<string>) {
  const [stations, setStations] = useState(emptyFeatureCollection)
  const stationsUpdatedCount = useRef(0)

  useEffect(
    function() {
      // collect all station Promise<StationsFeatureCollection>
      const collectionsPromises = Array.from(selectedRoutes).map(importStation)
      // resolve when all are fetched
      Promise.all(collectionsPromises).then(featureCollections => {
        // collect all features from all station JSONs
        const duplicatedFeatures = featureCollections.flatMap(fc => fc.features)
        // get unique features
        const features = uniqBy(duplicatedFeatures, f => f.properties.id || f.properties['@id'])
        // this is used as a react `key` for rerender
        stationsUpdatedCount.current++
        setStations({ type: 'FeatureCollection', features })
      })
    },
    [selectedRoutes, selectedRoutes.size],
  )

  return { stations, stationsUpdatedCount: stationsUpdatedCount.current }
}

function onEachFeature(feature: Feature<Point, StationProperties>, layer: Layer): void {
  // TODO consider using `name:ru` to load the Russian label,
  // depending on the user-agent's language setting (if the
  // translation string is available in the JSON)
  // some features are directly on properties.*
  // some are put inside a tag object properties.tags.*
  const name = feature.properties.tags ? feature.properties.tags.name : feature.properties.name
  if (name) {
    layer.bindPopup(name)
  }
}

function importStation(routeId: string): Promise<StationsFeatureCollection> {
  return import(`@roataway/infrastructure-data/data/route_${routeId}_stations.json`)
    .then(m => m.default)
    .catch(error => {
      console.error(error)
      return emptyFeatureCollection
    })
}
