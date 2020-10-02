import { route } from '../route'

/**
 * This path acts as the prefix for route-specific subscriptions.
 * Append the route's upstream_id to the end, and you will receive event
 * from vehicles that serve that particular route.
 */
export const eventRoute = (id: string | number) => route(`event.route.${id}`)

export type EventType = 'remove'

export type EventRouteFrameBody = {
  event: EventType
  board: string // "1364"
  rtu_id: string // "0000023"
}
