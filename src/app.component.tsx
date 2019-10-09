import { default as React, useState } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { TheMap } from './the-map'
import { NavigationBarComponent } from './components/navigation-bar.component'
import { useTranslation } from 'react-i18next'
import { HudButtons } from './components/hud-buttons.component'
import { RouteSelectDialog } from './components/route-select.dialog'
import { useDocumentTitle } from './shared/document-title.hook'

export function AppComponent() {
  const { t } = useTranslation()
  useDocumentTitle(t('label.title'))
  const [isOpenRouteSelect, setIsOpenRouteSelect] = useState(false)
  // Maybe keep it in local storage?
  const [showUserLocation, setShowUserLocation] = useState(false)
  const [selectedRoutes, setSelectedRoutes] = useState<Set<string>>(new Set())

  return (
    <React.Fragment>
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
      />
    </React.Fragment>
  )
}
