import React, { createContext, FC, useCallback, useContext, useState } from 'react'

const RouteColorContext = createContext({ colors: {}, setColors: prev => prev })

export const RouteColorsProvider: FC = ({ children }) => {
  const [colors, setColors] = useState({})

  return <RouteColorContext.Provider value={{ colors, setColors }}>{children}</RouteColorContext.Provider>
}

export const useRouteColors = () => {
  const { colors, setColors } = useContext(RouteColorContext)

  const addRoutes = useCallback(
    routes => {
      if (Array.isArray(routes)) {
        const newColors = routes
          .filter(routeId => !colors.hasOwnProperty(routeId))
          .reduce((accum, route) => {
            const { primary, secondary } = randomColor(10)
            return {
              ...accum,
              [route]: {
                marker: primary,
                segments: secondary,
              },
            }
          }, {})

        setColors(prev => ({ ...prev, ...newColors }))
      } else if (typeof routes === 'string') {
        const { primary, secondary } = randomColor(10)
        setColors(prev => ({ ...prev, [routes]: { marker: primary, segments: secondary } }))
      }
    },
    [colors, setColors],
  )

  return { colors, addRoutes }
}

function randomColor(brightness) {
  function randomChannel(brightness) {
    const r = 255 - brightness
    const n = 0 | (Math.random() * r + brightness)
    const s = n.toString(16)
    return s.length === 1 ? '0' + s : s
  }

  const primary = randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness)

  return {
    primary: '#' + primary,
    secondary: '#' + (parseInt(primary, 16) + 0xf00).toString(16),
  }
}
