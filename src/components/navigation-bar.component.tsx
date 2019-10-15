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

  const [shown, setShown] = React.useState(false)
  const [language, setLanguage] = React.useState(i18n.language)
  const [leftHanded, setLeftHanded] = React.useState(false)

  const changeLanguage = event => {
    setLanguage(event.target.value)
    localStorage.setItem('language', event.target.value)
    i18n.changeLanguage(event.target.value)
    setShown(false)
  }
  const toggleLeftHanded = event => {
    setShown(false)
    setLeftHanded(event.target.checked)
    localStorage.setItem('left-handed', event.target.checked)
    let zoomControl = document.querySelectorAll(
      '.leaflet-top .leaflet-control-zoom',
    )[0]
    if (event.target.checked) {
      zoomControl.setAttribute('id', 'left-handed-control-zoom')
    } else {
      zoomControl.removeAttribute('id')
    }
  }

  return (
    <React.Fragment>
      <AppBar position="fixed">
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
              value={language}
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
                checked={leftHanded}
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
