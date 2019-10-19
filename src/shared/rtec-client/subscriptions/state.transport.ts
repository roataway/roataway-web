import { route } from '../route'

/**
 * There are 2 sources of data, the "Extended" (see `telemetry.transport`)
 * one has more trackers and will keep growing,
 * while the classic one has ~10 and will most likely stay that way
 * or even will be deprecated
 */
export const stateTransport = (id: string) => route(`state.transport.${id}`)

export type StateTransportFrameBody = {
  rtu_id: string // "012"
  /** @deprecated */
  board: string // "3916"
  route: string // "32"
  lat: string // "47.032623"
  lon: string // " 28.844086"
  dir: string // "0"
  speed: number // 0
  last_station: number // 20
}
