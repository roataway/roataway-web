import { over } from 'webstomp-client'
import Sock from 'sockjs-client'
import { useEffect, useState, useMemo } from 'react'

export function useRtecClient() {
  const client = useMemo(
    () =>
      over(new Sock('https://rtec.dekart.com/webstomp'), {
        debug: false,
        heartbeat: false,
      }),
    [],
  )

  const subscribe = useMemo(() => client.subscribe.bind(client), [client])
  const [connected, setConnected] = useState(client.connected)

  useEffect(
    function () {
      client.connect(
        'public_rtec',
        'iWillHackItInVisualBasic',
        () => setConnected(client.connected),
        console.error,
        'nazar',
      )
    },
    [client],
  )

  return { connected, subscribe }
}
