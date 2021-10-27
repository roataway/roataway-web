import { createContext, PropsWithChildren, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../shared/use-local-storage'

type SelectedRoutesState = {
  routes: string[]
  setRoutes: (routes: string[]) => void
  addRoute: (route: string) => void
  removeRoute: (route: string) => void
  toggleRoute: (route: string) => void
  hasRoute: (route: string) => boolean
}

const SelectedRoutesContext = createContext<SelectedRoutesState | undefined>(undefined)

export function SelectedRoutesProvider({ children }: PropsWithChildren<unknown>) {
  const [routes, _setRoutes] = useLocalStorage<string[]>('selected-routes', [])

  const setRoutes = useCallback<typeof _setRoutes>(
    (value) =>
      _setRoutes((prevState) => {
        const nextState = value instanceof Function ? value(prevState) : value
        return [...new Set(nextState)]
      }),
    [_setRoutes],
  )

  const addRoute = useCallback((route: string) => setRoutes((prev) => [...prev, route]), [setRoutes])
  const removeRoute = useCallback((route: string) => setRoutes((prev) => prev.filter((r) => r !== route)), [setRoutes])
  const hasRoute = useCallback((route) => routes.includes(route), [routes])
  const toggleRoute = useCallback(
    (route: string) => (hasRoute(route) ? removeRoute(route) : addRoute(route)),
    [addRoute, hasRoute, removeRoute],
  )

  const value = useMemo(
    () => ({
      routes,
      setRoutes,
      addRoute,
      removeRoute,
      toggleRoute,
      hasRoute,
    }),
    [routes, setRoutes, addRoute, removeRoute, toggleRoute, hasRoute],
  )

  return <SelectedRoutesContext.Provider value={value}>{children}</SelectedRoutesContext.Provider>
}

export function useSelectedRoutes() {
  const context = useContext(SelectedRoutesContext)
  if (context) return context
  throw new Error('useSelectedRoutes must be used within SelectedRoutesProvider')
}
