import { over, Subscription } from 'webstomp-client'
import Sock from 'sockjs-client'

const data = {
  login: 'public_rtec',
  passcode: 'iWillHackItInVisualBasic',
  host: 'nazar',
  stomp: 'https://rtec.dekart.com/webstomp',
  transport: '/exchange/e_public_rtec_Sho0ohCiephoh2waeM9t/state.transport.*',
  // There are 2 sources of data, the "Extended" one has more trackers and will
  // keep growing, while the classic one has ~10 and will most likely stay that way
  transportEx:
    '/exchange/e_public_rtec_Sho0ohCiephoh2waeM9t/telemetry.transport.*',
  station: '/exchange/e_public_rtec_Sho0ohCiephoh2waeM9t/state.station.*',
}

export class RtecClient {
  client = over(new Sock(data.stomp), { debug: false, heartbeat: false })
  subscription?: Subscription = undefined
  subscriptionEx?: Subscription = undefined

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
    this.subscriptionEx = this.client.subscribe(data.transportEx, callback)
  }

  unsubscribe() {
    this.subscription!.unsubscribe()
    this.subscriptionEx!.unsubscribe()
  }

  disconnect() {
    this.client.disconnect()
  }
}
