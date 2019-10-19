import { route } from '../route'

/**
 * This path acts as the prefix for route-specific subscriptions.
 * Append the route's upstream_id to the end, and you will receive telemetry
 * from vehicles that serve that particular route.
 */
export const telemetryRoute = (id: string | number) =>
  route(`telemetry.route.${id}`)

export type TelemetryRouteFrameBody = {
  latitude: number // 46.995369
  longitude: number // 28.785961
  timestamp: string // "2019-10-25T18:46:11Z"
  speed: number // 18
  direction: number // 359.4
  sat: number // 14
  board: string // "1364"
  rtu_id: string // "0000023"
  route: string // "35"
}
