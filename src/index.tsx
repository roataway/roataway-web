import './hacks'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { I18nextProvider } from 'react-i18next'
import * as Sentry from '@sentry/browser'
import { AppComponent } from './app.component'
import reportWebVitals from './reportWebVitals'
import { i18n } from './i18n'
import { createTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { SettingsProvider } from './settings.context'
import { ErrorBoundary } from './shared/error-boundary'
import { RouteColorsProvider } from './route-colors.context'
import { SelectedRoutesProvider } from './selected-routes.context'
import splitbee from '@splitbee/web'

if (process.env.NODE_ENV === 'production') {
  splitbee.init()
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: process.env.COMMIT_REF,
  })
}

const theme = createTheme()

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={null}>
      <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={theme}>
            <SettingsProvider>
              <SelectedRoutesProvider>
                <RouteColorsProvider>
                  <AppComponent />
                </RouteColorsProvider>
              </SelectedRoutesProvider>
            </SettingsProvider>
          </ThemeProvider>
        </I18nextProvider>
      </ErrorBoundary>
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
