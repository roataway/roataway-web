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

  // NOTE: contrary to what we know so far, that the
  // direction is a bearing (i.e., North is up at 0,
  // South is down at 270, etc.), it seems to already
  // be an angle in a cartesian plane, so the conversion
  // below is not necessary.
  // direction = (-direction + 90) % 360

  const speed = data.speed
  return { board, lat, lng, direction, speed }
}
