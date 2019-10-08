import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

// Applying the workaround, otherwise station markers are not rendered
// https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-264311098
// This seems to be a known issue, and other workarounds failed, e.g.:
// https://github.com/PaulLeCam/react-leaflet/issues/453#issuecomment-410450387
L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
})
