import React, { Component } from 'react'
import { Map, TileLayer, Viewport } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

export class BasicMap extends Component<{}, Viewport> {
  state: Viewport = {
    center: [47.0229, 28.8353],
    zoom: 13,
  }

  render() {
    return (
      <Map
        id={'map'}
        style={{ height: '100vh' }}
        zoomControl={false}
        viewport={this.state}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </Map>
    )
  }
}
