import { Fragment, useCallback, useEffect, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { TheMap } from './the-map'
import { NavigationBarComponent } from './components/navigation-bar.component'
import { useTranslation } from 'react-i18next'
import { HudButtons } from './components/hud-buttons.component'
import { RouteSelectDialog } from './components/route-select.dialog'
import { ProvideFeedbackDialog } from './components/provide-feedback.dialog'
import { useDocumentTitle } from './shared/document-title.hook'
import { Box } from '@mui/system'

export function AppComponent() {
  const { t } = useTranslation()
  useDocumentTitle(t('label.title'))
  const [isOpenRouteSelect, setIsOpenRouteSelect] = useState<boolean>(false)
  const [isOpenProvideFeedback, seIsOpenProvideFeedback] = useState<boolean>(false)
  // Maybe keep it in local storage?
  const [showUserLocation, setShowUserLocation] = useState<number | undefined>(undefined)
  const [firstVisit, setFirstVisit] = useState<boolean>(() => !areStoredRoutesEmpty())

  useEffect(() => {
    if (isOpenRouteSelect && firstVisit) {
      setFirstVisit(false)
    }
  }, [isOpenRouteSelect, firstVisit])

  const toggleRouteSelect = useCallback(() => setIsOpenRouteSelect((prev) => !prev), [])

  const setCurrentUserLocation = useCallback(() => setShowUserLocation(new Date().getTime()), [])

  const handleOpenFeedback = () => {
    seIsOpenProvideFeedback(true)
  }

  return (
    <Fragment>
      <CssBaseline />

      <Box height="100%" display="flex" flexDirection="column">
        <Box zIndex={20} position="relative">
          <NavigationBarComponent onOpenFeedback={handleOpenFeedback} />
        </Box>
        <Box zIndex={10} position="relative" flexGrow={1}>
          <TheMap showUserLocation={showUserLocation} />
        </Box>
      </Box>

      <HudButtons
        setCurrentUserLocation={setCurrentUserLocation}
        toggleRouteSelect={toggleRouteSelect}
        firstVisit={firstVisit}
      />

      <RouteSelectDialog isOpen={isOpenRouteSelect} setOpen={setIsOpenRouteSelect} />
      <ProvideFeedbackDialog isOpen={isOpenProvideFeedback} setOpen={seIsOpenProvideFeedback} />
    </Fragment>
  )
}

function areStoredRoutesEmpty(): boolean {
  return !!localStorage.getItem('selected-routes') && JSON.parse(localStorage.getItem('selected-routes')!).length > 0
}
