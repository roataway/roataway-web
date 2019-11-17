import { default as React } from 'react'
import * as Sentry from '@sentry/browser'

export class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    eventId: undefined,
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    if (process.env.NODE_ENV === 'production') {
      Sentry.withScope(scope => {
        scope.setExtras(errorInfo)
        const eventId = Sentry.captureException(error)
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
