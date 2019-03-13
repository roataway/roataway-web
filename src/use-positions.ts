import { useState } from 'react'
import { LatLngLiteral } from 'leaflet'
import { useClient } from './client'

type Position = LatLngLiteral & { board: string }

export function usePositions(): { [key: string]: Position } {
  const [positions, setPositions] = useState<{ [key: string]: Position }>({})

  function callback(pos) {
    setPositions({
      ...positions,
      [pos.board]: pos,
    })
  }

  useClient(callback)
  return positions
}
