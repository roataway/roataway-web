import { default as React } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { TheMap } from './the-map'
import { NavigationBarComponent } from './components/navigation-bar.component'
import { useTranslation } from 'react-i18next'
import { PickRouteButton } from './components/pick-route.button'
import { RouteSelectDialog } from './components/route-select.dialog'
import { useDocumentTitle } from './shared/use-document-title.hook'

export function AppComponent() {
  const { t } = useTranslation()
  const [isOpenRouteSelect, setIsOpenRouteSelect] = React.useState(false)
  const [selectedRoutes, setSelectedRoutes] = React.useState<Set<string>>(
    new Set(),
  )
  useDocumentTitle(t('label.title'))

  return (
    <React.Fragment>
      <CssBaseline />
      <NavigationBarComponent />

      <PickRouteButton
        isOpenRouteSelect={isOpenRouteSelect}
        setIsOpenRouteSelect={setIsOpenRouteSelect}
      />

      <RouteSelectDialog
        isOpen={isOpenRouteSelect}
        setOpen={setIsOpenRouteSelect}
        selectedRoutes={selectedRoutes}
        setSelectedRoutes={setSelectedRoutes}
      />

      <TheMap selectedRoutes={selectedRoutes} />
    </React.Fragment>
  )
}
