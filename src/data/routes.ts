import { csvLoader } from '../shared/csv.macro'

// see src/data/routes.csv structure
type Route = {
  id_upstream: string
  name_concise: string
  name_long: string
  osm_relation: string
}

export const routes: Route[] = csvLoader('./routes.csv')
