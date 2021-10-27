import difference from 'lodash.difference'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useSelectedRoutes } from './selected-routes.context'
import { colorPalette } from '../shared/colors'

type ColorState = Record<string, { marker: string; segment: string; text: string }>

const RouteColorContext = createContext<ColorState>({})

export function RouteColorsProvider({ children }: PropsWithChildren<unknown>) {
  const { routes } = useSelectedRoutes()
  const [colors, setColors] = useState<Record<string, any>>({})

  useEffect(() => {
    setColors((colors) => {
      const newColors = [...routes].reduce((accum, route) => {
        if (colors[route]) {
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

      const previous = Object.keys(colors)
      const current = Object.keys(newColors)
      const removed = difference(previous, current)
      const toRestore = removed.map((key) => colors[key].marker)
      colorPalette.restore(...toRestore)

      return newColors
    })
  }, [routes])

  return <RouteColorContext.Provider value={colors}>{children}</RouteColorContext.Provider>
}

export function useRouteColors() {
  const context = useContext(RouteColorContext)
  if (context !== undefined) return context
  throw new Error('useRouteColors must be used within a RouteColorsProvider')
}
