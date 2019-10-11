import React from 'react'
import { Marker } from 'react-leaflet'
import { Icon } from 'leaflet'
import { useGeoPosition } from '../shared/geo-position.hook'
import personIcon from '../icons/neutral-human.svg'

const userIcon = new Icon({
  iconUrl: personIcon,
  iconSize: [40, 40],
})

export function UserLocation() {
  const [position, error] = useGeoPosition()

  /**
   * Future improvements, Handle error case
   * ex: when user denies location, maybe ask to hide the button
   */
  if (!position || error) {
    return null
  }

  const { coords } = position

  return (
    <Marker position={[coords.latitude, coords.longitude]} icon={userIcon} />
  )
}
