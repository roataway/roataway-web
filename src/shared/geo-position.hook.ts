import { useState, useEffect } from 'react'

export function useGeoPosition(
  positionOptions?: PositionOptions,
): [Position | undefined, PositionError | undefined] {
  const [position, setPosition] = useState<Position | undefined>(undefined)
  const [error, setError] = useState<PositionError | undefined>(undefined)

  useEffect(() => {
    const listener = navigator.geolocation.watchPosition(
      setPosition,
      setError,
      positionOptions,
    )

    return () => navigator.geolocation.clearWatch(listener)
  }, [positionOptions])

  return [position, error]
}
