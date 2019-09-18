import { client, Subscription } from 'webstomp-client'

const data = {
  login: 'public_rtec',
  passcode: 'iWillHackItInVisualBasic',
  host: 'nazar',
  /**
   * In production this WebSocket URL is not working
   * Because we use `https` in production we can't connect to a non secure endpoint
   * Where needs to be a `wss` protocol to work
   */
  ws: 'ws://rtec.dekart.com:15674/ws',
  // this also does not allow a secure connection
  stomp: 'http://rtec.dekart.com/webstomp',
  transport: '/exchange/e_public_rtec_Sho0ohCiephoh2waeM9t/state.transport.*',
  station: '/exchange/e_public_rtec_Sho0ohCiephoh2waeM9t/state.station.*',
}

export class Client {
  client = client(data.ws, { debug: false, heartbeat: false })
  subscription?: Subscription = undefined

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
    this.subscription = this.client.subscribe(data.transport, callback)
  }

  unsubscribe() {
    this.subscription!.unsubscribe()
  }

  disconnect() {
    this.client.disconnect()
  }
}
