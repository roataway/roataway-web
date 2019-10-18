import { csvLoader } from '../shared/csv.macro'

// see src/data/vehicles.csv structure
type Vehicle = {
  tracker_id: string
  organization: string
  board: string
  vehicle_type: string
  model: string
  door_count: number
  release_date: string
  articulated: string // TODO make it bool
  accessibility: string //TODO make it bool
}

const rawVehicles: Vehicle[] = csvLoader<Vehicle>('./vehicles.csv').sort(
  (a, b) =>
    a.tracker_id.localeCompare(b.tracker_id, undefined, {
      numeric: true,
    }),
)

let vehicles = new Map() //<string, Vehicle>

rawVehicles.forEach(item => {
  vehicles.set(item.board, item)
})

export { vehicles }
