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

It can also be transformed into JSON, using automated means. For details about specific files, see `data/readme.md`.
