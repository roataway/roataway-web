# File formats used

## Route information

| id_upstream | name_concise | name_long                      | osm_relation |
| ----------- | ------------ | ------------------------------ | ------------ |
| 1           | 30           | Aeroport - str. 31 August 1989 | 7390177      |
| 2           | 32           | Stăuceni - Chișinău            | 8649765      |
|             | 37           | Bubuieci - Gara Feroviară      | 9478330      |

- `id_upstream` - the internal identifier of the route in the originating GPS tracking system that we get our data from
- `name_concise` - a short name for a route, usually it is a number, but it can also contain letters, e.g. `3A`
- `name_long` - a verbose route name
- `osm_relation` - the relation of this route in OpenStreetMaps

Note that not all trolleybuses have GPS trackers yet, therefore not all routes are provisioned in the tracking system, and we don't know their `id_upstream`. In this case we simply omit it. These routes will _not_ be shown in the interface.

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

## Vehicles

The fields are:

- `tracker_id` - string identifier of tracking device installed in this vehicle
- `organization` - string identifier of organization that owns the vehicle, so far all of them are from `PT-x`, which stands for "Parcul de troleibuze nr. x"
- `board_number` - number shown on the vehicle itself
- `vehicle_type` - string enum, one of `{trolleybus, bus, minibus, tram}
- `model` - compound string, that has the format `<maker>/<model>`, e.g., `Skoda/14Tr.M`
- `door_count` - number of doors in the vehicle
- `release_date` - date in the form `DD/MM/YYYY`, this is an optional field
- `articulated` - stringified boolean, `yes` if the vehicle is articulated ("гармошка")
- `accessibility` - stringified boolean, `yes` if the vehicle is designed to make it easier for disabled people to get in and out.

| tracker_id | organization | board | vehicle_type | model        | door_count | release_date | articulated | accessibility |
| ---------- | ------------ | ----- | ------------ | ------------ | ---------- | ------------ | ----------- | ------------- |
| 000004     | PT-1         | 1232  | trolleybus   | ZiU/9        | 3          | 01/11/1989   |             |               |
|            | PT-1         | 1278  | trolleybus   | BKM/AKSM-213 | 4          | 15/11/2005   | yes         |               |
|            | PT-1         | 1285  | trolleybus   | BKM/AKSM-321 | 3          | 27/04/2011   |             | yes           |
|            | PT-1         | 1286  | trolleybus   | BKM/AKSM-321 | 3          | 27/04/2011   |             | yes           |

Note that at the moment not all vehicles are equipped with GPS trackers, hence the `tracker_id` field is empty for them. This information will be updated once more trackers are deployed.
