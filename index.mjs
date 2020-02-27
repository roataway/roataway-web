import { createRequire } from 'module'
import { writeFileSync } from 'fs'
const require = createRequire(import.meta.url)
const routes = require('@roataway/infrastructure-data/routes.json')

routes.forEach(r => {
  const json = require(`@roataway/infrastructure-data/data/route_${r.id_upstream}_stations.json`)
  const stations = json.features.reduce((prev, feature) => {
    const id = feature.properties.id
    const name = feature.properties.tags
      ? feature.properties.tags.name
      : feature.properties.name

    prev[id] = name
    return prev
  }, {})
  
  const s = JSON.stringify(stations, null, 2)
  writeFileSync(`src/shared/rtec-forecast/route_${r.id_upstream}_forecast.json`, s)
})
