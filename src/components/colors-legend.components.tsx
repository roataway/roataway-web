import React, { FC } from 'react'
import { MapControlProps } from 'react-leaflet'
import MapControl from './map-control.component'
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'
import { useRouteColors } from '../route-colors.context'
import legendClasses from './colors-legend.module.scss'
import { routes as allRoutes } from '../shared/routes'
import { useSelectedRoutes } from '../selected-routes.context'

interface Props extends MapControlProps {}

interface InfrastructureRouteInfo {
  id_upstream: string
  name_concise: string
  name_long: string
  osm_relation: string
}

const ColorsLegend: FC<Props> = ({ position = 'topright' }) => {
  const { colors } = useRouteColors()
  const { routes, setRoutes } = useSelectedRoutes()

  if (!allRoutes || Object.keys(colors).length === 0) {
    return null
  }

  const removeRoute = routeId => {
    routes.delete(routeId)
    setRoutes(new Set(routes))
  }

  const renderRow = (route: string) => {
    const routeInfo = allRoutes.find(rt => rt.id_upstream === route)!
    const routeColors = colors[route]

    return (
      <ListItem className={legendClasses.legendRow} key={route}>
        <ListItemIcon>
          <div style={{ borderColor: routeColors.segment }} className={legendClasses.routeMarker}>
            <span style={{ color: routeColors.marker }}>{routeInfo.name_concise}</span>
          </div>
        </ListItemIcon>
        <ListItemText className={legendClasses.legendText} primary={routeInfo.name_long} />
        <ListItemSecondaryAction>
          <RemoveRouteButton routeId={route} onClick={removeRoute} />
        </ListItemSecondaryAction>
      </ListItem>
    )
  }

  return (
    <MapControl position={position}>
      <Paper className={legendClasses.legendContainer} elevation={3}>
        <List dense>{Object.keys(colors).map(renderRow)}</List>
      </Paper>
    </MapControl>
  )
}

const RemoveRouteButton: FC<{ routeId: string; onClick: (id: string) => void }> = ({ routeId, onClick }) => {
  const handleClick = () => onClick(routeId)

  return (
    <IconButton onClick={handleClick} edge="end" aria-label="delete">
      <ClearIcon />
    </IconButton>
  )
}

export default ColorsLegend
