# Introduction

JavaScript package for GeoPlegma. At this point, it runs only DGGRID.

## Get Started

Install the library.

```bash
npm install GeoPlegma-js
```

or

```bash
yarn add GeoPlegma-js
```

or

```bash
pnpm install GeoPlegma-js
```

Example:

```js
import { Dggrs } from "geoplegma-js";
const g = new Dggrs("isea3h");
const rl = 3;
const bbox = [
  [-10.0, -10.0],
  [10.0, 10.0],
];
const a = g.zonesFromBbox(rl, bbox);

console.log("from bbox: " + a.map((v) => v.id));
// from bbox: 307fffffffffffff,30bfffffffffffff,31bfffffffffffff,323fffffffffffff,327fffffffffffff,32bfffffffffffff,3a7fffffffffffff
```

## Development

- Install dependencies:

```bash
npm install
```

- Get the native binding files, and run the script:
```bash
./scripts/dev.sh
```

This will:
- Build the .node files from GeoPlegma/gp-bindings/js.
- Copy them into GeoPlegma-js/native/.
- Let your JS code require('./native/something.node') without committing them.

- Run the unit tests:

```bash
npm run test
```

- Build the library:

```bash
npm run build
```

The `build` script will build a new folder `dist` with the bundled files inside, and copy the index.node and index.d.ts files into that same folder. This folder will be used in the npm library as the source code files.

NOTE: Eventually a github job will be added for this statement workflow.
