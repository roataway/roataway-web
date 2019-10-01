import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BasicMap } from './basic-map'
import { NavigationBarComponent } from './navigation-bar.component'
// import { withStyles, StyleRulesCallback } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { csvLoader } from './shared/csv.macro'

// console.log(csvLoader('./data/routes.csv')) // this will be an array of CSV entries

// const styles: StyleRulesCallback<any, any> = theme => ({
//   routeTitle: {
//     top: 'auto',
//     bottom: 0,
//     backgroundColor: 'purple',
//     opacity: 0.8
//   },
// })

export function AppComponent() {
  const { t } = useTranslation()
  document.title = t('label.title')

  // let currentRoute = t('label.pickRoute')
  let currentRoute = '32: Stăuceni 🡘 Chișinău'

  return (
    <React.Fragment>
      <CssBaseline />
      <h1 id="routeSelectLabel" className="route-title">
        {currentRoute}
      </h1>
      <NavigationBarComponent />
      <BasicMap />
    </React.Fragment>
  )
}
