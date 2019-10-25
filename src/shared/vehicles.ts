import { loader as csvLoader } from 'csv.macro'

// see src/data/vehicles.csv structure
type RawVehicle = {
  tracker_id: string
  organization: string
  board: string
  vehicle_type: string
  model: string
  door_count: string
  release_date: string
  articulated: string
  accessibility: string
}

enum VehicleType {
  trolleybus = 'trolleybus',
  bus = 'bus',
  minibus = 'minibus',
}

// This is almost like RawVehicle above, but we convert all the stringified
// values to proper data types
type Vehicle = {
  tracker_id: string
  organization: string
  board: string
  vehicle_type: VehicleType
  model: string
  door_count: number
  release_date: Date
  articulated: boolean
  accessibility: boolean
}

// keep `csvLoader` parameter as a strig
const rawVehicles: RawVehicle[] = csvLoader<RawVehicle>(
  '@roataway/infrastructure-data/vehicles.csv',
)
// Thi maps a board number to a Vehicle
let vehicles = new Map()

// This maps a tracker ID to a board number
let trackers = new Map()

rawVehicles.forEach(item => {
  const vehicle: Vehicle = {
    // Because not all vehicles have trackers yet, some entries will not
    // have this attribute. This will be ressolved soon, but until all the
    // trackers are deployed, keep this in mind.
    tracker_id: item.tracker_id,
    organization: item.organization,
    board: item.board,
    vehicle_type: VehicleType[item.vehicle_type],
    model: item.model,
    door_count: parseInt(item.door_count),
    release_date: new Date(item.release_date),
    articulated: item.articulated === 'yes',
    accessibility: item.accessibility === 'yes',
  }
  vehicles.set(item.board, vehicle)

  trackers.set(item.tracker_id, item.board)
})

export { vehicles, trackers }
