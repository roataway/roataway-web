This is a form of the original https://github.com/roataway/web-ui, with some UI
tweaks requested by RTEC, for use on troleibuze.md.

All the good parts should be merged back into the upstream project, while the
ones that RTEC wants (but which don't seem reasonable otherwise) will remain
here, in a separate branch.

# RoataWăy web client

It assumes you have `git`, `node` and `npm` installed. This is how you get started:

1. Clone the git repo and switch into the freshly checked out directory
```shell
git clone git@github.com:roataway/web-ui.git
cd web-ui
git submodule init
git submodule update
```

2. `npm install` - to install all the dependencies
3. Build or start app
  - `npm start` - to run the app in the development mode on http://localhost:3000
  - `npm run build` - Builds the app for production to the `build` folder.
