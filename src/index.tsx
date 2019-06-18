import { default as React, StrictMode, ConcurrentMode } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { AppComponent } from './app.component'
// eslint-disable-next-line
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <ConcurrentMode>
    <StrictMode>
      <AppComponent />
    </StrictMode>
  </ConcurrentMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister() // eslint-disable-line
