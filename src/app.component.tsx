import { Fragment, useCallback, useState } from 'react'
import { Alert, Box, CssBaseline, Snackbar } from '@mui/material'
import { TheMap } from './components/the-map.component'
import { NavigationBarComponent } from './components/navigation-bar.component'
import { HudButtons } from './components/hud-buttons.component'
import { RouteSelectDialog } from './components/route-select.dialog'
import { ProvideFeedbackDialog } from './components/provide-feedback.dialog'
import { OpenLayersMap } from './components/open-layers-map.component'

export function AppComponent() {
  const [isOpenRouteSelect, setIsOpenRouteSelect] = useState<boolean>(false)
  const [isOpenProvideFeedback, seIsOpenProvideFeedback] = useState<boolean>(false)
  const [showUserLocation, setShowUserLocation] = useState<number>()
  const [showMessage, setShowMessage] = useState(false)

  const toggleRouteSelect = useCallback(() => setIsOpenRouteSelect((prev) => !prev), [])
  // New Date each time triggers geolocation effect
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
          {false && <TheMap showUserLocation={showUserLocation} />}
          <OpenLayersMap />
        </Box>
      </Box>

      <Snackbar
        open={showMessage}
        onClose={() => setShowMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="warning" onClose={() => setShowMessage(false)}>
          Nu am vești bune: trackerele sunt offline de câteva zile. RTEC nu plătește, operatorul mobil a deconectat
          cartelele. Aplicația se va dezvolta în continuare. S-a hotărât că vom merge într-o direcție diferită, unde
          poziția live va fi un funcțional auxiliar.
        </Alert>
      </Snackbar>

      {false && (
        <HudButtons
          setCurrentUserLocation={setCurrentUserLocation}
          toggleRouteSelect={toggleRouteSelect}
          isOpenRouteSelect={isOpenRouteSelect}
        />
      )}

      <RouteSelectDialog isOpen={isOpenRouteSelect} setOpen={setIsOpenRouteSelect} />
      <ProvideFeedbackDialog isOpen={isOpenProvideFeedback} setOpen={seIsOpenProvideFeedback} />
    </Fragment>
  )
}
