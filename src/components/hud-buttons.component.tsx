import { default as React } from 'react'
import { useTranslation } from 'react-i18next'
import Fab from '@material-ui/core/Fab'
import DirectionsBus from '@material-ui/icons/DirectionsBus'
import LocationCity from '@material-ui/icons/MyLocation'
import { makeStyles, Tooltip } from '@material-ui/core'
import { useGeoPosition } from '../shared/geo-position.hook'

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
  const {
    isOpenRouteSelect,
    setIsOpenRouteSelect,
    setShowUserLocation,
    setCenterCoordinates
  } = props
  const { t } = useTranslation()
  const classes = useStyles()

  const [userPosition, userPositionError] = useGeoPosition()


  if (userPositionError) {
    console.error('Error getting user position', userPositionError)
  }

  const showUserLocation = () => {
    if (userPosition) {
      setCenterCoordinates(userPosition.coords)
  
      setShowUserLocation(true)
    }
  }

  return (
    <div className={classes.hudButtons}>
      {'geolocation' in navigator && (
        <Tooltip title={t('label.myLocation')} placement="left">
          <Fab
            color="secondary"
            aria-label={t('label.myLocation')}
            className={classes.topIcon}
            onClick={showUserLocation}>
            <LocationCity />
          </Fab>
        </Tooltip>
      )}
      <br />
      <Tooltip title={t('label.pickRoute')} placement="left">
        <Fab
          color="secondary"
          aria-label={t('label.pickRoute')}
          onClick={() => setIsOpenRouteSelect(!isOpenRouteSelect)}>
          <DirectionsBus />
        </Fab>
      </Tooltip>
    </div>
  )
}
