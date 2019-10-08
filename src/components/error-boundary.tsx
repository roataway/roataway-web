import { default as React } from 'react'

export class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.log(error)
  }

  render() {
    if (this.state.hasError) {
      return null
    }

    return this.props.children
  }
}
