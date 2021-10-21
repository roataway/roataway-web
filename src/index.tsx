import './hacks'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { I18nextProvider } from 'react-i18next'
import { init as sentryInit } from '@sentry/browser'
import { AppComponent } from './app.component'
import reportWebVitals from './reportWebVitals'
import { i18n } from './i18n'
import { createTheme, Theme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { SettingsProvider } from './settings.context'
import { ErrorBoundary } from './shared/error-boundary'
import { RouteColorsProvider } from './route-colors.context'
import { SelectedRoutesProvider } from './selected-routes.context'
import { AnalyticsProvider } from './analytics.context'
import { Inflate } from './components/inflate.component'

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

if (process.env.NODE_ENV === 'production') {
  sentryInit({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: process.env.COMMIT_REF,
  })
}

const theme = createTheme()

ReactDOM.render(
  <Inflate
    elements={[
      <React.StrictMode />,
      <React.Suspense fallback={null} />,
      <ErrorBoundary />,
      <I18nextProvider i18n={i18n} />,
      <StyledEngineProvider injectFirst />,
      // Added children just to mute TypeScript
      <ThemeProvider theme={theme} children={<div />} />,
      <SettingsProvider />,
      <SelectedRoutesProvider />,
      <RouteColorsProvider />,
      <AnalyticsProvider />,
    ]}
  >
    <AppComponent />
  </Inflate>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
