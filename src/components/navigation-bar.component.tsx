import { ChangeEvent, useState, Fragment } from 'react'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import FeedbackIcon from '@material-ui/icons/Feedback'

import {
  makeStyles,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Radio,
  Divider,
  Switch,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import Drawer from '@material-ui/core/Drawer'
import { useSettings, setLeftHanded } from '../settings.context'

const useStyles = makeStyles((theme) => ({
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

type Props = {
  onOpenFeedback: () => void
}

export function NavigationBarComponent(props: Props) {
  const { t, i18n } = useTranslation()
  const classes = useStyles()

  const [settings, settingsDispatch] = useSettings()
  const [shown, setShown] = useState(false)

  function changeLanguage(event: ChangeEvent<HTMLInputElement>) {
    setShown(false)
    i18n.changeLanguage(event.target.value)
  }

  function toggleLeftHanded(event: ChangeEvent<HTMLInputElement>) {
    setShown(false)
    settingsDispatch(setLeftHanded(event.target.checked))
  }

  function handleOpenFeedback() {
    setShown(false)
    props.onOpenFeedback()
  }

  return (
    <Fragment>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => setShown(true)}
          >
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
            <RadioGroup aria-label="language" name="language" value={i18n.language} onChange={changeLanguage}>
              <FormControlLabel value="en" control={<Radio color="primary" />} label="English" />
              <FormControlLabel value="ro" control={<Radio color="primary" />} label="Romanian" />
              <FormControlLabel value="ru" control={<Radio color="primary" />} label="Russian" />
            </RadioGroup>
          </FormControl>
          <Divider />

          <List>
            <ListItem button onClick={handleOpenFeedback}>
              <ListItemIcon>
                <FeedbackIcon />
              </ListItemIcon>

              <ListItemText primary={t('label.feedback')} />
            </ListItem>
          </List>

          <Divider />
          <FormControlLabel
            className={classes.formControl}
            control={
              <Switch
                className={classes.switch}
                checked={settings.leftHanded}
                onChange={toggleLeftHanded}
                value="checkedB"
                color="primary"
              />
            }
            label="Left-Handed"
          />
        </div>
      </Drawer>
    </Fragment>
  )
}
