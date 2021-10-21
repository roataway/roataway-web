import { useRef, useEffect } from 'react'
import { Map, TileLayer, Viewport, ZoomControl } from 'react-leaflet'
import { Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { UserLocation } from './components/user-location.component'
import { useSettingsState } from './settings.context'
import { getLocation } from './shared/geo-position'
import { RoutesSegments } from './components/routes-segments.component'
import { RoutesStations } from './components/routes-stations.component'
import { RoutesPositions } from './components/routes-positions.component'
import ColorsLegend from './components/colors-legend.components'
import { useSelectedRoutes } from './selected-routes.context'

type Props = {
  showUserLocation?: number
}

const viewport: Viewport = {
  center: [47.0229, 28.8353],
  zoom: 13,
}

export function TheMap(props: Props) {
  const { showUserLocation } = props
  const { leftHanded } = useSettingsState()
  const { routes } = useSelectedRoutes()
  const mapRef = useRef<any>()

  useEffect(
    function () {
      if (showUserLocation) {
        getLocation().then((pos) => {
          const map = mapRef.current!.contextValue!.map! as LeafletMap
          const center: [number, number] = [pos.coords.latitude, pos.coords.longitude]
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
      // Almost all country is visible
      minZoom={8}
      // no tiles available for bigger zoom
      maxZoom={19}
      zoomControl={false}
      viewport={viewport}
      style={{ height: '100%' }}
    >
      <TileLayer
        attribution='&amp;copy <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url={process.env.REACT_APP_TILE_LAYER_URL}
      />

      {showUserLocation && <UserLocation />}

      <ZoomControl position={leftHanded ? 'bottomleft' : 'bottomright'} />

      <ColorsLegend position="topright" />

      <RoutesSegments selectedRoutes={routes} />
      <RoutesStations selectedRoutes={routes} />
      <RoutesPositions selectedRoutes={routes} />
    </Map>
  )
}
