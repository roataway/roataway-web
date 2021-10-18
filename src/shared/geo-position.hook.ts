import { useState, useEffect } from 'react'

export function useGeoPosition(
  positionOptions?: PositionOptions,
): [GeolocationPosition | undefined, GeolocationPositionError | undefined] {
  const [position, setPosition] = useState<GeolocationPosition | undefined>(undefined)
  const [error, setError] = useState<GeolocationPositionError | undefined>(undefined)

  useEffect(() => {
    const listener = navigator.geolocation.watchPosition(setPosition, setError, positionOptions)

    return () => navigator.geolocation.clearWatch(listener)
  }, [positionOptions])

  return [position, error]
}
