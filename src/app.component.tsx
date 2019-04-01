import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BasicMap } from './basic-map'
import { NavigationBarComponent } from './navigation-bar.component'

export function AppComponent() {
  return (
    <React.Fragment>
      <CssBaseline />
      <NavigationBarComponent />
      <BasicMap />
    </React.Fragment>
  )
}
