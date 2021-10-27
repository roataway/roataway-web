import { useEffect, useRef } from 'react'
import { Box } from '@mui/material'

import 'ol/ol.css'
import { Map, View } from 'ol'
import { fromLonLat } from 'ol/proj'
import { MapboxVector as MapboxVectorLayer } from 'ol/layer'
// @ts-ignore
// import olms from 'ol-mapbox-style'

export function OpenLayersMap() {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Never executes
    if (!elementRef.current) return

    // olms(elementRef.current, 'https://api.maptiler.com/maps/bright/style.json?key=lirfd6Fegsjkvs0lshxe')

    const map = new Map({
      target: elementRef.current,
      view: new View({
        center: fromLonLat([28.8353, 47.0229]),
        zoom: 13,
      }),
    })

    const layer = new MapboxVectorLayer({
      styleUrl: 'https://maptiles.railean.net/styles/klokantech-basic/style.json',
      maxZoom: 14,
      minZoom: 8,
    })
    map.addLayer(layer)
  })

  return <Box ref={elementRef} sx={{ height: '100%' }} />
}
