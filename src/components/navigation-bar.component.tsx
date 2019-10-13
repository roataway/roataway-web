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
}))

export function NavigationBarComponent() {
  const { t } = useTranslation()
  const classes = useStyles()

  const [state, setState] = React.useState({
    shown: false,
  })
  const [language, setLanguage] = React.useState({
    lang: '',
  })

  const toggleDrawer = open => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    setState({ shown: open })
    setLanguage({ lang: localStorage.getItem('language') || '' })
  }

  const changeLanguage = event => {
    setLanguage({ lang: event.target.value })
    localStorage.setItem('language', event.target.value)
    i18n.changeLanguage(event.target.value)
    setState({ shown: false })
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
            onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {t('label.title')}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer open={state.shown} onClose={toggleDrawer(false)}>
        <div className={classes.list}>
          <FormControl component="fieldset" className={classes.formControl}>
            <RadioGroup
              aria-label="language"
              name="language"
              value={language.lang}
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
        </div>
      </Drawer>
    </React.Fragment>
  )
}
