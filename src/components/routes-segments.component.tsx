import React, { useState, useRef, useEffect } from 'react'
import { FeatureCollection, LineString } from 'geojson'
import { GeoJSON } from 'react-leaflet'
import { ErrorBoundary } from '../shared/error-boundary'
import { uniqBy } from 'lodash'
import { useRouteColors } from '../route-colors.context'

export function RoutesSegments({ selectedRoutes }) {
  const { segments, segmentsUpdatedCount } = useSegmentsFeatureCollection(selectedRoutes)
  const { colors } = useRouteColors()

  return (
    <ErrorBoundary>
      <GeoJSON
        style={(feature: any) => {
          if (feature && colors[feature.routeId]) {
            return {
              color: colors[feature.routeId].segments,
            }
          }

          return {}
        }}
        key={segmentsUpdatedCount}
        data={segments}
      />
    </ErrorBoundary>
  )
}

type SegmentProperties = {
  id: number
  routeId?: string
}

interface LineStringWithRoute extends LineString {
  routeId?: string
}

type SegmentsFeatureCollection = FeatureCollection<LineStringWithRoute, SegmentProperties> & { routeId?: string }
const emptyFeatureCollection: SegmentsFeatureCollection = {
  type: 'FeatureCollection',
  features: [],
}

function useSegmentsFeatureCollection(selectedRoutes: Set<string>) {
  const [segments, setSegments] = useState(emptyFeatureCollection)
  const segmentsUpdatedCount = useRef(0)

  useEffect(
    function() {
      // collect all segments Promise<SegmentsFeatureCollection>
      const collectionsPromises = Array.from(selectedRoutes).map(importSegment)
      // resolve when all are fetched
      Promise.all(collectionsPromises).then(featureCollections => {
        // collect all features from all segment JSONs
        const duplicatedFeatures = featureCollections.flatMap(fc =>
          fc.features.map(feature => ({
            ...feature,
            routeId: fc.routeId,
          })),
        )
        // get unique features
        const features = uniqBy(duplicatedFeatures, f => f.properties.id || f.properties['@id'])
        // console.log("features", features)
        // this is used as a react `key` for rerender
        segmentsUpdatedCount.current++
        setSegments({ type: 'FeatureCollection', features })
      })
    },
    [selectedRoutes, selectedRoutes.size],
  )

  return { segments, segmentsUpdatedCount: segmentsUpdatedCount.current }
}

function importSegment(routeId: string): Promise<SegmentsFeatureCollection> {
  return import(`@roataway/infrastructure-data/data/route_${routeId}_segments.json`)
    .then(m => ({ ...m.default, routeId }))
    .catch(error => {
      console.error(error)
      return emptyFeatureCollection
    })
}
