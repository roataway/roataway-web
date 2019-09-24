import { over, Subscription } from 'webstomp-client'
import Sock from 'sockjs-client'

const data = {
  login: 'public_rtec',
  passcode: 'iWillHackItInVisualBasic',
  host: 'nazar',
  stomp: 'https://rtec.dekart.com/webstomp',
  transport: '/exchange/e_public_rtec_Sho0ohCiephoh2waeM9t/state.transport.*',
  station: '/exchange/e_public_rtec_Sho0ohCiephoh2waeM9t/state.station.*',
}

export class Client {
  client = over(new Sock(data.stomp), { debug: false, heartbeat: false })
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
