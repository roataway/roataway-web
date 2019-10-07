# csv.macro

This is a macro that will read a CSV file and give it as JSON
`create-react-app` is using [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) by default

A macro is run in node environment not in browser.  
Developing a macro implies AST understanding.  
This is not beginner entry.

```js
import { csvLoader } from './shared/csv.macro'

type Route = {} // define CSV format

// User writes this
const routes: Route[] = csvLoader('./data/routes.csv')

// but will get this
const routes: Route[] = [
  {
    id_upstream: '...',
    name_concise: '...',
    name_long: '...',
    osm_relation: '...',
  },
  {
    id_upstream: '...',
    name_concise: '...',
    name_long: '...',
    osm_relation: '...',
  },
  // ...
]
```

Note: this will be moved to a separate library, if someone wants to use it.
