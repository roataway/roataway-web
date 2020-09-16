import React, { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useSelectedRoutes } from './selected-routes.context'

type ColorState = Record<string, { marker: string; segment: string; text: string }>

interface RouteColorState {
  colors: ColorState
  addRoutes: (prev: ColorState) => void
}

const RouteColorContext = createContext<RouteColorState>({ colors: {}, addRoutes: () => {} })

export const RouteColorsProvider: FC = ({ children }) => {
  const { routes } = useSelectedRoutes()
  const [colors, setColors] = useState({})

  useEffect(() => addRoutes([...routes]), [routes, routes.size])

  const addRoutes = useCallback(
    routes => {
      const newColors = routes.reduce((accum, route) => {
        if (colors.hasOwnProperty(route)) {
          return {
            ...accum,
            [route]: colors[route],
          }
        }

        const { primary, secondary, contrast } = randomColorPairs(5)
        return {
          ...accum,
          [route]: {
            marker: primary,
            segment: secondary,
            text: contrast,
          },
        }
      }, {})

      setColors({ ...newColors })
    },
    [colors, setColors],
  )

  const value = useMemo(
    () => ({
      colors,
      addRoutes,
    }),
    [colors, addRoutes],
  )

  return <RouteColorContext.Provider value={value}>{children}</RouteColorContext.Provider>
}

export const useRouteColors = () => {
  const { colors, addRoutes } = useContext(RouteColorContext)

  return { colors, addRoutes }
}

function randomColorPairs(brightness: number): { primary: string; secondary: string; contrast: string } {
  if (brightness >= 255) brightness = 254
  const r = randomChannel(brightness)
  const g = randomChannel(brightness)
  const b = randomChannel(brightness)

  const primary = r + g + b

  // calculate luma coefficient https://en.wikipedia.org/wiki/Rec._709#Luma_coefficients
  const luma = 0.2126 * parseInt(r, 16) + 0.7152 * parseInt(g, 16) + 0.0722 * parseInt(b, 16)

  return {
    primary: '#' + primary,
    // make it a little bit lighter
    secondary: '#' + (parseInt(primary, 16) + 0x010101).toString(16),
    // consider luma > 150 as bright primary color
    contrast: luma > 150 ? '#696969' : '#d3d3d3',
  }
}

function randomChannel(brightness): string {
  const r = 255 - brightness
  const n = 0 | (Math.random() * r + brightness)
  const s = n.toString(16)
  return s.length === 1 ? '0' + s : s
}
