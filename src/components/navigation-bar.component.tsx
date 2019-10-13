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
import { i18n } from '../i18n'

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
  const { t } = useTranslation()
  const classes = useStyles()
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
    langauge: '',
    leftHanded: false,
  })
  const toggleDrawer = (side, open) => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setState({
      ...state,
      [side]: open,
      langauge: localStorage.getItem('language') || '',
      leftHanded: localStorage.getItem('left-handed') === 'true' || false,
    })
  }
  const changeLanguage = event => {
    setState({ ...state, langauge: event.target.value })
    localStorage.setItem('language', event.target.value)
    i18n.changeLanguage(event.target.value)
    setState({ ...state, left: false })
  }
  const leftHanded = event => {
    setState({ ...state, left: false, leftHanded: event.target.checked })
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
            onClick={toggleDrawer('left', true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {t('label.title')}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
        <div className={classes.list}>
          <FormControl component="fieldset" className={classes.formControl}>
            <RadioGroup
              aria-label="language"
              name="language"
              value={state.langauge}
              onChange={event => changeLanguage(event)}>
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
                checked={state.leftHanded}
                onChange={event => leftHanded(event)}
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
