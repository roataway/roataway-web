import { MapControlProps } from 'react-leaflet'
import MapControl from './map-control.component'
import {
  Box,
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
import { useRouteColors } from '../contexts/route-colors.context'
import { routes as allRoutes } from '../shared/routes'
import { useSelectedRoutes } from '../contexts/selected-routes.context'
import { useLocalStorage } from '../shared/use-local-storage'

export function ColorsLegend({ position = 'topright' }: MapControlProps) {
  const colors = useRouteColors()
  const { removeRoute } = useSelectedRoutes()
  const [collapsed, setCollapsed] = useLocalStorage('legend-collapsed', false)

  const routes = Object.keys(colors)
  if (routes.length === 0) return null

  return (
    <MapControl position={position}>
      <Paper
        elevation={3}
        sx={{
          maxHeight: '300px',
          overflowY: 'auto',
          display: 'flex',
        }}
      >
        <Box sx={{ width: '40px' }}>
          <Button
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              width: '100%',
              height: '100%',
              minWidth: '0',
              color: 'rgba(0, 0, 0, 0.54)',
            }}
          >
            <DoubleArrowRoundedIcon sx={{ transform: collapsed ? 'rotate(180deg)' : undefined }} />
          </Button>
        </Box>
        <List dense>
          {routes.map((route: string) => {
            const routeInfo = allRoutes.find((rt) => rt.id_upstream === route)!
            const routeColors = colors[route]
            return (
              <ListItem key={route}>
                <ListItemIcon sx={{ minWidth: '35px' }}>
                  <Box
                    style={{ borderColor: routeColors.segment, color: routeColors.marker }}
                    children={routeInfo.name_concise}
                    sx={{
                      width: '25px',
                      height: '25px',
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid',
                      color: 'white',
                    }}
                  />
                </ListItemIcon>
                {collapsed && (
                  <ListItemText
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      transition: 'width 0.27s ease-out',
                      maxWidth: '250px',
                    }}
                    primary={routeInfo.name_long}
                  />
                )}
                <ListItemSecondaryAction>
                  <IconButton onClick={() => removeRoute(route)} edge="end" aria-label="delete" size="large">
                    <ClearIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )
          })}
        </List>
      </Paper>
    </MapControl>
  )
}
