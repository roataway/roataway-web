/*
  Copy-pasted with minor updates from: https://github.com/liveby/react-leaflet-control
*/

import ReactDOM from 'react-dom'
import { MapControl, withLeaflet, MapControlProps } from 'react-leaflet'
import { Control, DomUtil, DomEvent, Map } from 'leaflet'

const DumbControl = Control.extend({
  options: {
    className: '',
    onOff: '',
    handleOff: () => {},
  },

  onAdd() {
    const _controlDiv = DomUtil.create('div', this.options.className)
    DomEvent.disableClickPropagation(_controlDiv).disableScrollPropagation(_controlDiv) // add possibility to scroll inside control
    return _controlDiv
  },

  onRemove(map: Map) {
    if (this.options.onOff) {
      map.off(this.options.onOff, this.options.handleOff, this)
    }

    return this
  },
})

export default withLeaflet(
  class LeafletControl extends MapControl {
    createLeafletElement(props: MapControlProps) {
      return new DumbControl(Object.assign({}, props))
    }

    componentDidMount() {
      if (super.componentDidMount) {
        super.componentDidMount()
      }

      // This is needed because the control is only attached to the map in
      // MapControl's componentDidMount, so the container is not available
      // until this is called. We need to now force a render so that the
      // portal and children are actually rendered.
      this.forceUpdate()
    }

    render() {
      if (this.leafletElement && this.leafletElement.getContainer()) {
        return ReactDOM.createPortal(this.props.children, this.leafletElement.getContainer()!)
      }

      return null
    }
  },
)
