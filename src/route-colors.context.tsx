import React, { createContext, FC, useContext, useEffect, useMemo, useState } from 'react'
import { useSelectedRoutes } from './selected-routes.context'
import { colorPalette } from './shared/colors'

type ColorState = Record<string, { marker: string; segment: string; text: string }>

interface RouteColorState {
  colors: ColorState
}

const RouteColorContext = createContext<RouteColorState>({ colors: {} })

export const RouteColorsProvider: FC = ({ children }) => {
  const { routes } = useSelectedRoutes()
  const [colors, setColors] = useState({})

  useEffect(() => {
    const newColors = Array.from(routes).reduce((accum, route) => {
      if (colors.hasOwnProperty(route)) {
        return {
          ...accum,
          [route]: colors[route],
        }
      }

      const { primary, secondary, contrast } = colorPalette.palette

      return {
        ...accum,
        [route]: {
          marker: primary,
          segment: secondary,
          text: contrast,
        },
      }
    }, {})

    if (Object.keys(newColors).length < Object.keys(colors).length) {
      const removedKeys = diffArray(Object.keys(colors), Object.keys(newColors))
      if (removedKeys.length) colorPalette.restore(...removedKeys.map(key => colors[key].marker))
    }

    setColors({ ...newColors })

    // wants 'colors' in dep array
    // eslint-disable-next-line
  }, [routes, routes.size])

  const value = useMemo(
    () => ({
      colors,
    }),
    [colors],
  )

  return <RouteColorContext.Provider value={value}>{children}</RouteColorContext.Provider>
}

export const useRouteColors = () => {
  const { colors } = useContext(RouteColorContext)

  return { colors }
}

const diffArray = (arr1, arr2) => arr1.concat(arr2).filter(val => !(arr1.includes(val) && arr2.includes(val)))
