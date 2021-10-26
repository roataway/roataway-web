import { Component } from 'react'
import { withScope, captureException } from '@sentry/browser'

export class ErrorBoundary extends Component {
  state = {
    hasError: false,
    eventId: undefined,
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    if (process.env.NODE_ENV === 'production') {
      withScope((scope) => {
        scope.setExtras(errorInfo)
        const eventId = captureException(error)
        this.setState({ eventId })
      })
    } else {
      console.log(error)
    }
  }

  render() {
    if (this.state.hasError) {
      return null
    }

    return this.props.children
  }
}
