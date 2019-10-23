import { default as React } from 'react'
import { useTranslation } from 'react-i18next'
import Fab from '@material-ui/core/Fab'
import DirectionsBus from '@material-ui/icons/DirectionsBus'
import LocationCity from '@material-ui/icons/MyLocation'
import { makeStyles, Tooltip } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
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

export function HudButtons(props) {
  const { isOpenRouteSelect, setIsOpenRouteSelect, setShowUserLocation } = props
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <div className={classes.hudButtons}>
      {'geolocation' in navigator && (
        <Tooltip title={t('label.myLocation')} placement="left">
          <Fab
            size="small"
            color="secondary"
            aria-label={t('label.myLocation')}
            className={classes.topIcon}
            onClick={() => setShowUserLocation(true)}>
            <LocationCity />
          </Fab>
        </Tooltip>
      )}
      <br />
      <Tooltip title={t('label.pickRoute')} placement="left">
        <Fab
          size="small"
          color="secondary"
          aria-label={t('label.pickRoute')}
          onClick={() => setIsOpenRouteSelect(!isOpenRouteSelect)}>
          <DirectionsBus />
        </Fab>
      </Tooltip>
    </div>
  )
}
