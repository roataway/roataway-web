import {
  over,
  client,
  Client as StompClient,
  Subscription,
} from 'webstomp-client'
import Sock from 'sockjs-client'
import { useEffect } from 'react'

const data = {
  login: 'public_rtec',
  passcode: 'iWillHackItInVisualBasic',
  host: 'nazar',
  ws: 'wss://rtec.dekart.com:15674/ws',
  stomp: 'https://rtec.dekart.com/webstomp',
  transport: '/exchange/e_public_rtec_Sho0ohCiephoh2waeM9t/state.transport.*',
  station: '/exchange/e_public_rtec_Sho0ohCiephoh2waeM9t/state.station.*',
}

class Client {
  client?: StompClient = undefined
  subscription?: Subscription = undefined

  constructor() {
    // this.client = client(data.ws, { debug: false, heartbeat: false })
    this.client = over(new Sock(data.stomp), { debug: false, heartbeat: false })
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client!.connect(
        data.login,
        data.passcode,
        resolve,
        reject,
        data.host,
      )
    })
  }

  subscribe(callback) {
    this.subscription = this.client!.subscribe(data.transport, callback)
  }

  unsubscribe() {
    this.subscription!.unsubscribe()
  }

  disconnect() {
    this.client!.disconnect()
  }
}

function getPositionFromFrame(frame) {
  const data = JSON.parse(frame.body)
  const board = data.board
  const lat = parseFloat(data.lat)
  const lng = parseFloat(data.lon)
  return { board, lat, lng }
}

export function useClient(callback) {
  useEffect(() => {
    const client = new Client()
    client.connect().then(() => {
      client.subscribe(frame => callback(getPositionFromFrame(frame)))
    })
    return () => {
      client.unsubscribe()
      client.disconnect()
    }
  }, [])
}
