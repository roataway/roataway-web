import analyticsImpl from '@splitbee/web'
import { Splitbee as Analytics } from '@splitbee/web/dist/types'
import { createContext, PropsWithChildren, useContext } from 'react'

const analytics: Analytics = process.env.NODE_ENV === 'production' ? analyticsImpl : getAnalyticsMock()
analytics.init()

const AnalyticsContext = createContext(analytics)

export function AnalyticsProvider(props: PropsWithChildren<unknown>) {
  return <AnalyticsContext.Provider value={analytics}>{props.children}</AnalyticsContext.Provider>
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context !== undefined) return context
  throw new Error('useAnalytics must be used within a AnalyticsProvider')
}

function getAnalyticsMock(): Analytics {
  const log =
    (message: string) =>
    async (...args: unknown[]) =>
      console.log(message, ...args)

  return {
    init: log('[analytics.init]'),
    enableCookie: log('[analytics.enableCookie]'),
    reset: log('[analytics.reset]'),
    track: log('[analytics.track]'),
    user: {
      set: log('[analytics.user.log]'),
    },
  }
}
