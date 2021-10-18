import { useEffect, useRef, useState } from 'react'
import { FeatureCollection, LineString } from 'geojson'
import { GeoJSON } from 'react-leaflet'
import { ErrorBoundary } from '../shared/error-boundary'
import { uniqBy } from 'lodash'
import { useRouteColors } from '../route-colors.context'

export function RoutesSegments({ selectedRoutes }: any) {
  const { segments, segmentsUpdatedCount } = useSegmentsFeatureCollection(selectedRoutes)
  const { colors } = useRouteColors()

  const getSegmentStyle = (feature: any) => {
    if (feature && colors[feature.routeId]) {
      return {
        color: colors[feature.routeId].segment,
      }
    }

    return {}
  }

  return (
    <ErrorBoundary>
      <GeoJSON style={getSegmentStyle} key={segmentsUpdatedCount} data={segments} opacity={0.8} weight={6} />
    </ErrorBoundary>
  )
}

type SegmentProperties = {
  id: number
  '@id'?: string
  routeId?: string
}

type SegmentsFeatureCollection = FeatureCollection<LineString, SegmentProperties> & { routeId?: string }
const emptyFeatureCollection: SegmentsFeatureCollection = {
  type: 'FeatureCollection',
  features: [],
}

function useSegmentsFeatureCollection(selectedRoutes: Set<string>) {
  const [segments, setSegments] = useState(emptyFeatureCollection)
  const segmentsUpdatedCount = useRef(0)

  useEffect(
    function () {
      // collect all segments Promise<SegmentsFeatureCollection>
      const collectionsPromises = Array.from(selectedRoutes).map(importSegment)
      // resolve when all are fetched
      Promise.all(collectionsPromises).then((featureCollections) => {
        // collect all features from all segment JSONs
        const duplicatedFeatures = featureCollections.flatMap((fc) => fc.features)
        // get unique features
        const features = uniqBy(duplicatedFeatures, (f) => f.properties.id || f.properties['@id'])
        // this is used as a react `key` for rerender
        segmentsUpdatedCount.current++
        setSegments({ type: 'FeatureCollection', features })
      })
    },
    [selectedRoutes, selectedRoutes.size],
  )

  return { segments, segmentsUpdatedCount: segmentsUpdatedCount.current }
}

async function importSegment(routeId: string): Promise<SegmentsFeatureCollection> {
  let resp = await import(`@roataway/infrastructure-data/data/route_${routeId}_segments.json`)
  resp = resp.default
  // FIXME: 'strange' hack to add routeId to a segment
  // FIXME: maybe add these route ides to *_segments.json
  resp.features = resp.features.map((feature: any) => ({ ...feature, routeId }))

  return resp
}
