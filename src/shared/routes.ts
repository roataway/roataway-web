import { loader as csvLoader } from 'csv.macro'

// see src/data/routes.csv structure
type Route = {
  id_upstream: string
  name_concise: string
  name_long: string
  osm_relation: string
}

// keep `csvLoader` parameter as a strig
export const routes: Route[] = csvLoader<Route>('@roataway/infrastructure-data/routes.csv').sort((a, b) =>
  a.name_concise.localeCompare(b.name_concise, undefined, {
    numeric: true,
  }),
)
