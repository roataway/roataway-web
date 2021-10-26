import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Fab from '@mui/material/Fab'
import DirectionsBus from '@mui/icons-material/DirectionsBus'
import LocationCity from '@mui/icons-material/MyLocation'
import { Tooltip } from '@mui/material'
import { Box } from '@mui/material'
import hudClasses from './hud-buttons.module.scss'

interface Props {
  setCurrentUserLocation: () => void
  toggleRouteSelect: () => void
  firstVisit: boolean
}

export function HudButtons(props: Props) {
  const { setCurrentUserLocation, toggleRouteSelect, firstVisit } = props
  const { t } = useTranslation()
  const [showRouteTooltip, setShowRouteTooltip] = useState<boolean>(firstVisit)

  const openRouteTooltip = useCallback(() => setShowRouteTooltip(true), [])
  const closeRouteTooltip = useCallback(() => setShowRouteTooltip(false), [])

  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: (t) => t.zIndex.appBar,
        right: (t) => t.spacing(1),
        bottom: (t) => t.spacing(1),
      }}
    >
      <Tooltip title={t('label.myLocation') as string} placement="left">
        <Fab
          size="small"
          color="secondary"
          aria-label={t('label.myLocation')}
          sx={{ marginBottom: (t) => t.spacing(1) }}
          onClick={setCurrentUserLocation}
        >
          <LocationCity />
        </Fab>
      </Tooltip>
      <br />
      <Tooltip
        title={t('label.pickRoute') as string}
        placement="left"
        onClose={closeRouteTooltip}
        onOpen={openRouteTooltip}
        open={firstVisit || showRouteTooltip}
      >
        <Fab
          size="small"
          color="secondary"
          className={firstVisit ? hudClasses.bounce : ''}
          aria-label={t('label.pickRoute')}
          onClick={toggleRouteSelect}
        >
          <DirectionsBus />
        </Fab>
      </Tooltip>
    </Box>
  )
}
