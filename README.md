# RoataWăy web interface

It assumes you have `npm` installed. This is how you get started:

1. Clone the git repo and switch into the freshly checked out directory
2. `npm install` - to install all the dependencies
3. `npm start` - to run the app in the development mode on http://localhost:3000

- `npm run build` - Builds the app for production to the `build` folder.

## Troubleshooting

- If you see `Error: Failed to load plugin react-hooks: Cannot find module 'eslint-plugin-react-hooks'`, run `npm install -g eslint-plugin-react` to solve it.
- `Error: Failed to load parser '@typescript-eslint/parser' declared in '.eslintrc.json#overrides[0]': Cannot find module 'eslint/lib/util/traverser'` can be resolved with `npm install @typescript-eslint/parser --save-dev`.

## Todo

1. Add rendering of `direction`
2. Add routes, such that users can go to `roataway.com/route/30` and view the route directly
3. Add local storage for some properties, such as the last selected route, or the language. Use the `componentDidUpdate` method of React, and somewhere in there `localStorage.setItem("lastSelectedRoute", JSON.stringify(this.state.selectedRoute))` and pair it with `localStorage.getItem("lastSelectedRoute")`.
4. Add loader of routeId->routeName maps from local file, if available, otherwise pull it from the server
