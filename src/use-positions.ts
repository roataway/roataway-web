import { default as React } from 'react'
import { Client } from './client'

export class Positions extends React.Component<any> {
  state = {
    positions: {},
  }

  client?: Client = undefined

  componentDidMount() {
    this.client = new Client()
    this.client.connect().then(() => {
      this.client!.subscribe(this.callback)
    })
  }

  componentWillUnmount() {
    this.client!.unsubscribe()
    this.client!.disconnect()
  }

  callback = frame => {
    const pos = getPositionFromFrame(frame)
    this.setState({
      positions: {
        ...this.state.positions,
        [pos.board]: pos,
      },
    })
  }

  render() {
    const children: any = this.props.children
    return children(this.state.positions)
  }
}

function getPositionFromFrame(frame) {
  // Messages are coming from 2 different systems (see note in clients.ts about
  // routing keys), each system sends a slightly different JSON, the keys are,
  // old one: dir, lat, lon, board
  // new one: direction, latitude, longitude ('board' is absent)
  // To homogenize them, we try both keys, and we extract the ID of the tracker
  // itself from the routing key header, as a substitude for `board`

  // The routing key looks like `/exchange/e_rtec_mqtt_bridge/telemetry.transport.000001`
  // or `/exchange/e_rtec_mqtt_bridge/state.transport.013`
  // The last piece is the ID of the tracker that sent the telemetry
  let routingKeyPieces = frame.headers.destination.split('.')
  const trackerId: string = routingKeyPieces[routingKeyPieces.length - 1]

  const data = JSON.parse(frame.body)
  const board = data.board || trackerId
  const lat = parseFloat(data.lat || data.latitude)
  const lng = parseFloat(data.lon || data.longitude)
  const direction = parseFloat(data.direction || data.dir)

  // NOTE: contrary to what we know so far, that the
  // direction is a bearing (i.e., North is up at 0,
  // South is down at 270, etc.), it seems to already
  // be an angle in a cartesian plane, so the conversion
  // below is not necessary.
  // direction = (-direction + 90) % 360

  const speed = data.speed
  return { board, lat, lng, direction, speed }
}
