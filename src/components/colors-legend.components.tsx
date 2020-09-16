import React, { FC, useEffect, useState } from 'react'
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

interface Props extends MapControlProps {}

interface InfrastructureRouteInfo {
  id_upstream: string
  name_concise: string
  name_long: string
  osm_relation: string
}

const ColorsLegend: FC<Props> = ({ position = 'topright' }) => {
  const { colors } = useRouteColors()
  const [allRoutes, setAllRoutes] = useState<InfrastructureRouteInfo[] | undefined>(undefined)

  useEffect(() => {
    import(`@roataway/infrastructure-data/routes.json`)
      .then(m => m.default)
      .then(res => setAllRoutes(res))
  }, [])

  if (!allRoutes) {
    return null
  }

  return (
    <MapControl position={position}>
      <Paper className={legendClasses.legendContainer} elevation={3}>
        <List dense>
          {Object.keys(colors).map(route => (
            <ListItem className={legendClasses.legendRow} key={route}>
              <ListItemIcon>
                <div style={{ borderColor: colors[route].segments }} className={legendClasses.routeMarker}>
                  {allRoutes.find(rt => rt.id_upstream === route)!.name_concise}
                </div>
              </ListItemIcon>
              <ListItemText
                className={legendClasses.legendText}
                primary={allRoutes.find(rt => rt.id_upstream === route)!.name_long}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <ClearIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </MapControl>
  )
}

export default ColorsLegend
