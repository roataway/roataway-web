import React, { createContext, FC, useCallback, useContext, useMemo, useState } from 'react'

type SelectedRoutesState = { routes: Set<string>; setRoutes: (routes: Set<string>) => void }

const SelectedRoutesContext = createContext<SelectedRoutesState>({ routes: new Set<string>(), setRoutes: () => {} })

export const SelectedRoutesProvider: FC = ({ children }) => {
  const [routes, setRoutes] = useState<Set<string>>(() => {
    try {
      const fromStorage = localStorage.getItem('selected-routes')

      return fromStorage ? new Set<string>(JSON.parse(fromStorage)) : new Set<string>()
    } catch {
      return new Set<string>()
    }
  })

  const value = useMemo(
    () => ({
      routes,
      setRoutes,
    }),
    [routes],
  )

  return <SelectedRoutesContext.Provider value={value}>{children}</SelectedRoutesContext.Provider>
}

export const useSelectedRoutes: () => SelectedRoutesState = () => {
  const { routes, setRoutes } = useContext(SelectedRoutesContext)

  const set = useCallback(
    (routes: Set<string>) => {
      localStorage.setItem('selected-routes', JSON.stringify([...routes]))
      setRoutes(routes)
    },
    [setRoutes],
  )

  return { routes, setRoutes: set }
}
