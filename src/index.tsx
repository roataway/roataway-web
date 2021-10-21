import { StrictMode, Suspense } from 'react'
import { render } from 'react-dom'
import { I18nextProvider } from 'react-i18next'
import { init as sentryInit } from '@sentry/browser'
import { AppComponent } from './app.component'
import reportWebVitals from './reportWebVitals'
import { i18n } from './i18n'
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material'
import { SettingsProvider } from './settings.context'
import { ErrorBoundary } from './shared/error-boundary'
import { RouteColorsProvider } from './route-colors.context'
import { SelectedRoutesProvider } from './selected-routes.context'
import { AnalyticsProvider } from './analytics.context'
import { Inflate } from './components/inflate.component'

if (process.env.NODE_ENV === 'production') {
  sentryInit({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: process.env.COMMIT_REF,
  })
}

render(
  <Inflate
    elements={[
      <StrictMode />,
      <Suspense fallback={null} />,
      <ErrorBoundary />,
      <I18nextProvider i18n={i18n} />,
      <StyledEngineProvider injectFirst />,
      <ThemeProvider theme={createTheme()} />,
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
