import { route } from '../route'

export const stateStation = (id: string) => route(`state.station.${id}`)

export type StateStationFrameBody = {
  eta: {
    [key: string]: [
      // "32"
      [
        number, // 30
        string, // "3916"
      ],
    ]
  }
  station_id: number // 905
  name: string // "str. Alexei Mateevici dir. Chisinau"
}
