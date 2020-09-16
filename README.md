[![GitHub license](https://img.shields.io/github/license/roataway/roataway-web)](https://github.com/roataway/roataway-web/blob/main/LICENSE)
[![Developers chat](https://img.shields.io/github/license/roataway/roataway-web)](https://roataway.zulipchat.com/)
![GitHub contributors](https://img.shields.io/github/contributors/roataway/roataway-web)
![Number of users](https://img.shields.io/badge/Users-%3C500K-brightgreen)


This is a form of the original https://github.com/roataway/web-ui, with some UI
tweaks requested by RTEC, for use on troleibuze.md.

All the good parts should be merged back into the upstream project, while the
ones that RTEC wants (but which don't seem reasonable otherwise) will remain
here, in a separate branch.

## Roataway web site

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
