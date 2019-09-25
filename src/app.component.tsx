import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BasicMap } from './basic-map'
import { NavigationBarComponent } from './navigation-bar.component'
import { useTranslation } from 'react-i18next'

export function AppComponent() {
  const { t } = useTranslation()
  document.title = t('label.title')
  return (
    <React.Fragment>
      <CssBaseline />
      <NavigationBarComponent />
      <BasicMap />
    </React.Fragment>
  )
}
