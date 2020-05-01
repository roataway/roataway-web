import React from 'react'
import { Map, TileLayer, Viewport, ZoomControl } from 'react-leaflet'
import { Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { UserLocation } from './components/user-location.component'
import { useSettingsState } from './settings.context'
import { getLocation } from './shared/geo-position'
import { RoutesSegments } from './components/routes-segments.component'
import { RoutesStations } from './components/routes-stations.component'
import { RoutesPositions } from './components/routes-positions.component'

type Props = {
  selectedRoutes: Set<string>
  showUserLocation?: number
  className: string
}

const viewport: Viewport = {
  center: [47.0229, 28.8353],
  zoom: 13,
}

export function TheMap(props: Props) {
  const { selectedRoutes, showUserLocation, className } = props
  const { leftHanded } = useSettingsState()
  const mapRef = React.useRef<any>()

  React.useEffect(
    function() {
      if (showUserLocation) {
        getLocation().then(pos => {
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
      className={className}
      zoomControl={false}
      viewport={viewport}>
      <TileLayer
        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>'
        url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=kkvVQYrpRAgd0J55hJz5"
        // url="https://api.maptiler.com/maps/1d3d9f6d-c412-4e3b-9060-d3bb1733b3a6/{z}/{x}/{y}.png?key=kkvVQYrpRAgd0J55hJz5"
      />

      {showUserLocation && <UserLocation />}

      <ZoomControl position={leftHanded ? 'bottomleft' : 'bottomright'} />

      <RoutesSegments selectedRoutes={selectedRoutes} />
      <RoutesStations selectedRoutes={selectedRoutes} />
      <RoutesPositions selectedRoutes={selectedRoutes} />
    </Map>
  )
}
