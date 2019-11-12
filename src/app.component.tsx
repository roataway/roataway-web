import { default as React, useState } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { TheMap } from './the-map'
import { NavigationBarComponent } from './components/navigation-bar.component'
import { useTranslation } from 'react-i18next'
import { HudButtons } from './components/hud-buttons.component'
import { RouteSelectDialog } from './components/route-select.dialog'
import { useDocumentTitle } from './shared/document-title.hook'
import classes from './app.module.scss'

export function AppComponent() {
  const { t } = useTranslation()
  useDocumentTitle(t('label.title'))
  const [isOpenRouteSelect, setIsOpenRouteSelect] = useState(false)
  // Maybe keep it in local storage?
  const [showUserLocation, setShowUserLocation] = useState<number | undefined>(
    undefined,
  )
  const [selectedRoutes, setSelectedRoutes] = useSelectedRoutes()

  return (
    <div className={classes.root}>
      <CssBaseline />

      <NavigationBarComponent />

      <HudButtons
        isOpenRouteSelect={isOpenRouteSelect}
        setIsOpenRouteSelect={setIsOpenRouteSelect}
        setShowUserLocation={setShowUserLocation}
      />

      <RouteSelectDialog
        isOpen={isOpenRouteSelect}
        setOpen={setIsOpenRouteSelect}
        selectedRoutes={selectedRoutes}
        setSelectedRoutes={setSelectedRoutes}
      />

      <TheMap
        selectedRoutes={selectedRoutes}
        showUserLocation={showUserLocation}
        className={classes.map}
      />
    </div>
  )
}

function useSelectedRoutes(): [Set<string>, (routes: Set<string>) => void] {
  const [selectedRoutes, setSelectedRoutes] = useState<Set<string>>(() => {
    try {
      const fromStorage = localStorage.getItem('selected-routes')
      return fromStorage
        ? new Set<string>(JSON.parse(fromStorage))
        : new Set<string>()
    } catch {
      return new Set<string>()
    }
  })

  function selectRoute(routes: Set<string>) {
    localStorage.setItem('selected-routes', JSON.stringify([...routes]))
    return setSelectedRoutes(routes)
  }

  return [selectedRoutes, selectRoute]
}
