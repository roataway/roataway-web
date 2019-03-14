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
  return { board, lat, lng }
}
