import { default as React } from 'react'
import { useTranslation } from 'react-i18next'
import Fab from '@material-ui/core/Fab'
import DirectionsBus from '@material-ui/icons/DirectionsBus'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  fabButton: {
    position: 'absolute',
    zIndex: theme.zIndex.appBar,
    right: theme.spacing(1),
    bottom: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}))

export function PickRouteButton({ isOpenRouteSelect, setIsOpenRouteSelect }) {
  const { t } = useTranslation()
  const classes = useStyles()
  return (
    <Fab
      onClick={() => setIsOpenRouteSelect(!isOpenRouteSelect)}
      variant="extended"
      color="secondary"
      className={classes.fabButton}>
      <DirectionsBus className={classes.extendedIcon} />
      {t('label.pickRoute')}
    </Fab>
  )
}
