import * as React from 'react'
import ReactDOM from 'react-dom'
import { I18nextProvider } from 'react-i18next'
import { AppComponent } from './app.component'
import * as serviceWorker from './serviceWorker'
import { i18n } from './i18n'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { SettingsProvider } from './settings.context'

const theme = createMuiTheme()

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={null}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <SettingsProvider>
            <AppComponent />
          </SettingsProvider>
        </ThemeProvider>
      </I18nextProvider>
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister() // eslint-disable-line
