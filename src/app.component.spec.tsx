import ReactDOM from 'react-dom'
// import { AppComponent } from './app.component'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<div />, div)
  ReactDOM.unmountComponentAtNode(div)
})
