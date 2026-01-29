# Introduction

JavaScript package for GeoPlegma.

## Get Started

Install the library.

```bash
npm install geoplegma-js
```

or

```bash
yarn add geoplegma-js
```

or

```bash
pnpm install geoplegma-js
```

Example:

```js
import { Dggrs } from "geoplegma-js";
const g = new Dggrs("IVEA7H");
const rl = 3;
const bbox = [
  [-10.0, -10.0],
  [10.0, 10.0],
];
const a = g.zonesFromBbox(rl, bbox);

console.log("from bbox: " + a.map((v) => v.id));
// from bbox: [ "B4-0-C", "B4-0-D", "B4-1-D", "B4-3-C", "B4-4-B", "B4-4-C", "B4-4-D" ]

// other functions
for (const p of points) {
  const r = g.zoneFromPoint(rl, p);
  console.log("from point: " + r[0].id);

  const c = g.zonesFromParent(rl, r[0].id);
  console.log("parent: " + c[0].id);

  for (const child of c) {
    console.log("children: " + child.id);
  }

  const i = g.zoneFromId(r[0].id);
  console.log("from id: " + i.map((v) => v.id));
}
```

We have the following available grids: `ISEA3HDGGRID`, `IGEO7`, `H3`, `ISEA3HDGGAL`, `IVEA3H`, `ISEA9R`, `IVEA9R`, `RTEA3H`, `RTEA9R`, `IVEA7H`, `IVEA7H_Z7`. The grids are provided by DGGRID, DGGAL, and H3. More will be added eventually.

### Client-side

The library works almost exclusively on the server-side frontends at the moment, specifically for DGGRID and DGGAL grids. To work on client-side frontends you will have to use the [nextjs](nextjs.org) framework. Eventually more wrappers to other frontend frameworks and libraries will be added (remixjs, vitejs, svelte, etc). Example:

```js
"use client";

import { DggrsClient } from "geoplegma-js/next/client";
import { useEffect } from "react";
const g = new DggrsClient("IVEA7H");
const rl = 3;
const bbox = [
  [-10.0, -10.0],
  [10.0, 10.0],
];

let points = [
  [19.96, 5.34],
  [9.06, 52.98],
  [-29.11, -15.28],
];

export default function Component() {
  useEffect(() => {
    const fetch = async () => {
      const a = await g.zonesFromBbox(rl, bbox);
      console.log(a.map((v) => v.id));
    };
  }, []);

  return <div></div>;
}
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
