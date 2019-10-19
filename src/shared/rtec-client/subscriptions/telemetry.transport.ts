import { route } from '../route'

export const telemetryTransport = (id: string) =>
  route(`telemetry.transport.${id}`)

export type TelemetryTransportFrameBody = {
  latitude: number // 47.036354
  longitude: number // 28.822111
  timestamp: string // "2019-10-25T18:46:10Z"
  speed: number // 14
  direction: number // 40.3
  sat: number // 15
}
