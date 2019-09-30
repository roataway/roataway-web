# RoataWăy web interface

It assumes you have `npm` installed. This is how you get started:

1. Clone the git repo and switch into the freshly checked out directory
2. `npm install` - to install all the dependencies
3. `npm start` - to run the app in the development mode on http://localhost:3000

- `npm run build` - Builds the app for production to the `build` folder.

## Preparing route meta-data

The information is taken from OpenStreetMap, which conveniently groups all public transport in Chișinău into a `relation`, its id is `6726484`.

Here is the process, so far it was done manually, we shall consider automating it in the future:

1. Go to https://www.openstreetmap.org/relation/6726484
2. Note the column on the left, it contains a list of relations, each corresponding to a route. The routes cover minibuses, buses and trolleybuses. In this project we got started with trolleybuses.
3. Copy-paste the list into a text editor and use search/replace functionality to transform the list.
4. Save the result into `data/routes.csv`

### File formats

CSV is chosen because it is easier to manage than JSON (fewer commas and braces), and can potentially be edited directly by RTEC, so they themselves can contribute to the system in the future and provide fresh updates.

It can also be transformed into JSON, using automated means.

The current structure is as follows:

| id_upstream |  name_concise |  name_long                       |  osm_relation |
|-------------|---------------|----------------------------------|---------------|
| 1           | 30            |  Aeroport 🡘 str. 31 August 1989 | 7390177       |
| 2           | 32            |  Stăuceni 🡘 Chișinău            | 8649765       |
|             | 37            |  Bubuieci 🡘 Gara Feroviară      | 9478330       |

- `id_upstream` - the internal identifier of the route in the originating GPS tracking system that we get our data from
- `name_concise` - a short name for a route, usually it is a number, but it can also contain letters, e.g. `3A`
- `name_long` - a verbose route name
- `osm_relation` - the relation of this route in OpenStreetMaps

Note that not all trolleybuses have GPS trackers yet, therefore not all routes are provisioned in the tracking system, and we don't know their `id_upstream`. In this case we simply omit it. These routes will *not* be shown in the interface.

### Route segments

These are obtained via the Overpass API.

1. Go to `http://overpass-api.de/api/interpreter?data=[out:json];relation%20(xxxxxxx)%3B>>%3Bway._%3Bout%20geom%3B`
2. Replace `xxxxxxx` with the relation id, e.g. `8649765`
3. Save the resulting JSON to `data/route_<rtec_id>_segments.json`, replacing `rtec_id` with the route's internal identifier in the RTEC system. These identifiers are not yet known, time will tell what they are.

### Route stations

The process is similar to route segments, but the Overpass API query is different:

1. Go to `http://overpass-api.de/api/interpreter?data=[out:json];relation%20(xxxxxxx)%3B>>%3Bnode._%20[public_transport%3Dplatform]%3Bout%3B`
2. Replace `xxxxxxx` with the relation id, e.g. `8649765`
3. Save the resulting JSON to `data/route_<rtec_id>_stations.json`, replacing `rtec_id` with the route's internal identifier in the RTEC system.
