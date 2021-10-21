import { default as React, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Fab from '@mui/material/Fab'
import DirectionsBus from '@mui/icons-material/DirectionsBus'
import LocationCity from '@mui/icons-material/MyLocation'
import { Tooltip } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import hudClasses from './hud-buttons.module.scss'

const useStyles = makeStyles((theme) => ({
  hudButtons: {
    position: 'absolute',
    zIndex: theme.zIndex.appBar,
    right: theme.spacing(1),
    bottom: theme.spacing(1),
  },
  topIcon: {
    marginBottom: theme.spacing(1),
  },
}))

interface Props {
  setCurrentUserLocation: () => void
  toggleRouteSelect: () => void
  firstVisit: boolean
}

export function HudButtons(props: Props) {
  const { setCurrentUserLocation, toggleRouteSelect, firstVisit } = props
  const { t } = useTranslation()
  const classes = useStyles()
  const [showRouteTooltip, setShowRouteTooltip] = useState<boolean>(firstVisit)

  const openRouteTooltip = useCallback(() => setShowRouteTooltip(true), [])
  const closeRouteTooltip = useCallback(() => setShowRouteTooltip(false), [])

  return (
    <div className={classes.hudButtons}>
      <Tooltip title={t('label.myLocation') as string} placement="left">
        <Fab
          size="small"
          color="secondary"
          aria-label={t('label.myLocation')}
          className={classes.topIcon}
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
    </div>
  )
}
