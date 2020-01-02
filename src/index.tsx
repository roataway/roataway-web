import './polyfills'
import './hacks'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { I18nextProvider } from 'react-i18next'
import * as Sentry from '@sentry/browser'
import { AppComponent } from './app.component'
import * as serviceWorker from './serviceWorker'
import { i18n } from './i18n'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { SettingsProvider } from './settings.context'
import { ErrorBoundary } from './shared/error-boundary'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: process.env.REACT_APP_DEPLOY_HASH,
  })
}

const theme = createMuiTheme()

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={null}>
      <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={theme}>
            <SettingsProvider>
              <AppComponent />
            </SettingsProvider>
          </ThemeProvider>
        </I18nextProvider>
      </ErrorBoundary>
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister() // eslint-disable-line
