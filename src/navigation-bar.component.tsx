import React from 'react'
import AppBar from '@material-ui/core/AppBar'
// import IconButton from '@material-ui/core/IconButton'
import Fab from '@material-ui/core/Fab'
// import MenuIcon from '@material-ui/icons/Menu'
// import SearchIcon from '@material-ui/icons/Search'
// import MoreIcon from '@material-ui/icons/MoreVert'
import DirectionsBus from '@material-ui/icons/DirectionsBus'
import Toolbar from '@material-ui/core/Toolbar'
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

const styles: StyleRulesCallback<any, any> = theme => ({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

function NavigationBar(props) {
  const { t } = useTranslation()
  const { classes } = props

  return (
    <AppBar position="fixed" color="primary" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {/* <IconButton color="inherit" aria-label="Open drawer">
          <MenuIcon />
        </IconButton> */}
        <Fab
          color="secondary"
          aria-label="Add"
          className={classes.fabButton}
          title="Alege ruta">
          <DirectionsBus />
        </Fab>
        <div>
          {/* <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit">
            <MoreIcon />
          </IconButton> */}
        </div>
      </Toolbar>
    </AppBar>
  )
}

export const NavigationBarComponent = withStyles(styles)(NavigationBar)
