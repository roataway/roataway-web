import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import {
  makeStyles,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Radio,
  Divider,
  Switch,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import Drawer from '@material-ui/core/Drawer'
import { useSettings, setLeftHanded } from '../settings.context'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  formControl: {
    margin: theme.spacing(3),
  },
  switch: {
    marginLeft: '-10px',
  },
}))

export function NavigationBarComponent() {
  const { t, i18n } = useTranslation()
  const classes = useStyles()

  const [settings, settingsDispatch] = useSettings()
  const [shown, setShown] = React.useState(false)

  function changeLanguage(event) {
    setShown(false)
    i18n.changeLanguage(event.target.value)
  }

  function toggleLeftHanded(event) {
    setShown(false)
    settingsDispatch(setLeftHanded(event.target.checked))
  }

  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => setShown(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {t('label.title')}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer open={shown} onClose={() => setShown(false)}>
        <div className={classes.list}>
          <FormControl component="fieldset" className={classes.formControl}>
            <RadioGroup
              aria-label="language"
              name="language"
              value={i18n.language}
              onChange={changeLanguage}>
              <FormControlLabel
                value="en"
                control={<Radio color="primary" />}
                label="English"
              />
              <FormControlLabel
                value="ro"
                control={<Radio color="primary" />}
                label="Romanian"
              />
              <FormControlLabel
                value="ru"
                control={<Radio color="primary" />}
                label="Russian"
              />
            </RadioGroup>
          </FormControl>
          <Divider />
          <FormControlLabel
            className={classes.formControl}
            control={
              <Switch
                className={classes.switch}
                checked={settings.leftHanded}
                onChange={event => toggleLeftHanded(event)}
                value="checkedB"
                color="primary"
              />
            }
            label="Left-Handed"
          />
        </div>
      </Drawer>
    </React.Fragment>
  )
}
