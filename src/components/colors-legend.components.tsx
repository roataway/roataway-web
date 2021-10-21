import { FC, useState } from 'react'
import { MapControlProps } from 'react-leaflet'
import MapControl from './map-control.component'
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import DoubleArrowRoundedIcon from '@mui/icons-material/DoubleArrowRounded'
import { useRouteColors } from '../route-colors.context'
import legendClasses from './colors-legend.module.scss'
import { routes as allRoutes } from '../shared/routes'
import { useSelectedRoutes } from '../selected-routes.context'

const ColorsLegend: FC<MapControlProps> = ({ position = 'topright' }) => {
  const colors = useRouteColors()
  const { routes, setRoutes } = useSelectedRoutes()
  const [isLegendCollapsed, setLegendCollapseState] = useState<boolean>(false)

  if (!allRoutes || Object.keys(colors).length === 0) {
    return null
  }

  const toggleLegendCollapseState = () => {
    setLegendCollapseState((s) => !s)
  }

  const removeRoute = (routeId: string) => {
    routes.delete(routeId)
    setRoutes(new Set(routes))
  }

  const renderRow = (route: string) => {
    const routeInfo = allRoutes.find((rt) => rt.id_upstream === route)!
    const routeColors = colors[route]
    const listItemTextClasses = `${legendClasses.legendText} ${isLegendCollapsed ? legendClasses.collapsedText : ''}`

    return (
      <ListItem className={legendClasses.legendRow} key={route}>
        <ListItemIcon className={legendClasses.legendIcon}>
          <div style={{ borderColor: routeColors.segment }} className={legendClasses.routeMarker}>
            <span style={{ color: routeColors.marker }}>{routeInfo.name_concise}</span>
          </div>
        </ListItemIcon>
        <ListItemText className={listItemTextClasses} primary={routeInfo.name_long} />
        <ListItemSecondaryAction>
          <RemoveRouteButton routeId={route} onClick={removeRoute} />
        </ListItemSecondaryAction>
      </ListItem>
    )
  }

  return (
    <MapControl position={position}>
      <Paper className={legendClasses.legendContainer} elevation={3}>
        <ToggleRoutesButton isCollapsed={isLegendCollapsed} onClick={toggleLegendCollapseState} />
        <List dense>{Object.keys(colors).map(renderRow)}</List>
      </Paper>
    </MapControl>
  )
}

const RemoveRouteButton: FC<{ routeId: string; onClick: (id: string) => void }> = ({ routeId, onClick }) => {
  const handleClick = () => onClick(routeId)

  return (
    <IconButton onClick={handleClick} edge="end" aria-label="delete" size="large">
      <ClearIcon />
    </IconButton>
  )
}

const ToggleRoutesButton: FC<{ isCollapsed: boolean; onClick: () => void }> = ({ isCollapsed, onClick }) => {
  const collapseButtonIconClasses = `${isCollapsed ? legendClasses.rotatedToggleIcon : ''}`
  return (
    <div className={legendClasses.collapseWrapper}>
      <Button className={legendClasses.collapseButton} onClick={onClick}>
        <DoubleArrowRoundedIcon className={collapseButtonIconClasses} />
      </Button>
    </div>
  )
}
export default ColorsLegend
