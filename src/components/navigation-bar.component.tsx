import { ChangeEvent, useState, Fragment } from 'react'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import FeedbackIcon from '@mui/icons-material/Feedback'

import {
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
  Box,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import Drawer from '@mui/material/Drawer'
import { useSettings, setLeftHanded } from '../settings.context'

type Props = {
  onOpenFeedback: () => void
}

export function NavigationBarComponent(props: Props) {
  const { t, i18n } = useTranslation()
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
            sx={{ marginRight: (t) => t.spacing(2) }}
            color="inherit"
            aria-label="menu"
            onClick={() => setShown(true)}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t('label.title')}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer open={shown} onClose={() => setShown(false)}>
        <Box sx={{ width: 250 }}>
          <FormControl component="fieldset" sx={{ margin: (t) => t.spacing(3) }}>
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
            sx={{ margin: (t) => t.spacing(3) }}
            control={
              <Switch
                sx={{ marginLeft: '-10px' }}
                checked={settings.leftHanded}
                onChange={toggleLeftHanded}
                value="checkedB"
                color="primary"
              />
            }
            label="Left-Handed"
          />
        </Box>
      </Drawer>
    </Fragment>
  )
}
