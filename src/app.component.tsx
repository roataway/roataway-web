import { Fragment, useCallback, useEffect, useState } from 'react'
import { CssBaseline, Box } from '@mui/material'
import { TheMap } from './the-map'
import { NavigationBarComponent } from './components/navigation-bar.component'
import { HudButtons } from './components/hud-buttons.component'
import { RouteSelectDialog } from './components/route-select.dialog'
import { ProvideFeedbackDialog } from './components/provide-feedback.dialog'

export function AppComponent() {
  const [isOpenRouteSelect, setIsOpenRouteSelect] = useState<boolean>(false)
  const [isOpenProvideFeedback, seIsOpenProvideFeedback] = useState<boolean>(false)
  const [showUserLocation, setShowUserLocation] = useState<number | undefined>(undefined)
  const firstVisit = useFirstVisit(isOpenRouteSelect)

  const toggleRouteSelect = useCallback(() => setIsOpenRouteSelect((prev) => !prev), [])
  const setCurrentUserLocation = useCallback(() => setShowUserLocation(new Date().getTime()), [])
  const handleOpenFeedback = () => seIsOpenProvideFeedback(true)

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

function useFirstVisit(isOpenRouteSelect: boolean) {
  const [firstVisit, setFirstVisit] = useState(firstVisitInit)

  useEffect(() => {
    if (isOpenRouteSelect && firstVisit) {
      setFirstVisit(false)
    }
  }, [isOpenRouteSelect, firstVisit])

  return firstVisit
}

function firstVisitInit() {
  const selectedRoutes = localStorage.getItem('selected-routes')
  const areStoredRoutesEmpty = !!selectedRoutes && JSON.parse(selectedRoutes!).length > 0
  return !areStoredRoutesEmpty
}
