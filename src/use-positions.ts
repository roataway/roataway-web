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
  const data = JSON.parse(frame.body)
  const board = data.board
  const lat = parseFloat(data.lat)
  const lng = parseFloat(data.lon)
  let direction: number = 0

  // Sometimes it comes in a key called "direction",
  // other times the key is called "dir". Since it is
  // not clear what it should be called, we try both.
  if (data.hasOwnProperty('direction')) {
    direction = parseFloat(data.direction)
  } else {
    direction = parseFloat(data.dir)
  }

  // note that at this stage `direction` is a
  // bearing (North is up at 0, South is down at 270),
  // we have to transform it into degrees on a
  // cartesian plane, as explained:
  // https://sciencing.com/calculate-angle-bearing-8655354.html
  direction = 90 - direction
  if (direction < 0) {
    direction += 360
  } else {
    if (direction > 360) {
      direction -= 360
    }
  }

  const speed = data.speed
  return { board, lat, lng, direction, speed }
}
