# Helper tools

Some tools for pre- or post-processing data, they are not critical for the operation
of the web site, they automate or simplify certain tasks, such as route data collection.

Although they are non-critical, they should not get in the way either; ideally, running
out of the box, without any external dependencies. In the worst case, keep dependencies
at a minimum. 

## Retrieving routes metadata with `getRoute`

This tool retrieves information about a given route, by taking all routes from a CSV
file that was fed into it, or by explicitly retrieving one particular route specified
by its OpenStreetMap `relation id`.

The data are stored in GeoJSON, in 2 files:
- `route_<upstream_id>_segments.json`
- `route_<upstream_id>_stations.json`

Installation:

- `virtualenv -p python3 venv-getRoute`
- `source venv-getRoute/bin/activate`
- `pip install osm2geojson`

Examples of use (activate the virtualenv via `source venv-getRoute/bin/activate` first):

- `python getRoute --csv ../src/data/routes.csv --dst out` - Get all the routes specified in
  `../src/data/routes.csv` and save the resulting files to `out/` in the current directory.
- `python getRoute -r 9478330` - Retrieve data about relation `9478330`; in this case the file
  name will use the `relation_id`, rather than the `upstream_id`.
- `python getRoute --help` - See what command line args are available

If all is well, you will see something like this:

```
 INFO - Processing all routes from ../src/data/routes.csv
 INFO - Processing route 30, `Aeroport - Piața Marii Adunări Naționale`
 INFO - Processing route 32, `str. 31 August 1989 - com. Stăuceni`
 ...
 INFO - Processing route 1, `or. Durlești - str. Sarmizegetusa`
 INFO - Done
```

And the metadata will be saved in the directory you've indicated.

Note that the Overpass API of OSM returns a JSON which does not conform to the GeoJSON
schema (though they look the same to the untrained eye)! Thus, the tool relies on a
third-party library, `osm2geojson` to do the conversion.

What happens in principle:

- retrieve XML data from Overpass
- use `osm2geojson` to convert that XML to GeoJSON
- save GeoJSON to file