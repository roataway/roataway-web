import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Fab from '@mui/material/Fab'
import DirectionsBus from '@mui/icons-material/DirectionsBus'
import LocationCity from '@mui/icons-material/MyLocation'
import { Tooltip } from '@mui/material'
import { Box } from '@mui/material'
import { keyframes } from '@emotion/react'

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
          sx={{ animation: firstVisit ? `${bounce} 2s infinite` : undefined }}
          aria-label={t('label.pickRoute')}
          onClick={toggleRouteSelect}
        >
          <DirectionsBus />
        </Fab>
      </Tooltip>
    </Box>
  )
}

const bounce = keyframes({
  '0%, 25%, 50%, 75%, 100%': {
    transform: 'translateY(0)',
  },
  '40%': {
    transform: 'translateY(-20px)',
  },
  '60%': {
    transform: 'translateY(-12px)',
  },
})
