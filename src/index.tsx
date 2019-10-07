import * as React from 'react'
import ReactDOM from 'react-dom'
import { I18nextProvider } from 'react-i18next'
import { AppComponent } from './app.component'
import * as serviceWorker from './serviceWorker'
import { i18n } from './i18n'

import './shared/fixes'

console.log('Starting v0.0.2')
ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <AppComponent />
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister() // eslint-disable-line
