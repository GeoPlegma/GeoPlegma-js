# Introduction

JavaScript package for GeoPlegma. Geoplegma-js exposes a DGGRS (Discrete Global Grid Reference System) via:
- Client-side helpers (Next.js / browser-safe)
- Server-side native bindings (Node.js only)

The client API proxies requests to a Next.js API route, while the server API calls the native addon directly.

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
```

We have the following available grids: `ISEA3HDGGRID`, `IGEO7`, `H3`, `ISEA3HDGGAL`, `IVEA3H`, `ISEA9R`, `IVEA9R`, `RTEA3H`, `RTEA9R`, `IVEA7H`, `IVEA7H_Z7`. The grids are provided by DGGRID, DGGAL, and H3. More will be added eventually.


### Server-side API (Node.js only)

Server-side functions call the native rust DGGS implementation directly.
These must not be used in the browser or Edge runtimes.
```ts
import { Dggrs } from "geoplegma-js";

const grid = new Dggrs("IVEA3H");
```

#### Functions and types
Common Options
```js
interface Config {
  region: boolean;
  center: boolean;
  vertexCount: boolean;
  children: boolean;
  neighbors: boolean;
  areaSqm: boolean;
  densify: boolean;
}
```

##### zonesFromBbox
Generate zones covering a bounding box.
```ts
zonesFromBbox(
  refinementLevel: number,
  bbox: number[][],
  config?: Config
)
```
###### Parameters
- `refinementLevel` – Grid resolution level
- `bbox` – Bounding box as `[[minLon, minLat], [maxLon, maxLat]]`
- `config` – Optional output configuration
###### Example
```ts
const zones = await grid.zonesFromBbox(
  5,
  [
    [-122.6, 37.6],
    [-122.3, 37.9],
  ],
  {    
    center: true,
    region: false,
    vertexCount: false,
    children: false,
    neighbors: false,
    areaSqm: false,
    densify: false
  }
);
```

##### zoneFromPoint
Return the zone containing a single point.
```ts
zoneFromPoint(
  refinementLevel: number,
  points: number[],
  config?: Config
)
```

###### Parameters
- `points` – Array of [lon, lat] coordinates
###### Example
```ts
const zones = await grid.zoneFromPoint(
  7,
  [
    [-73.9857, 40.7484],
    [2.2945, 48.8584],
  ]
);
```

##### zonesFromParent
Generate child zones from a parent zone ID.
```ts
zonesFromParent(
  parentId: string,
  config?: Config
)
```
###### Parameters
- `parentId` – Parent id of a zone.
###### Example
```ts
const children = await grid.zonesFromParent(
  "D4-1A7-A",
  { neighbors: true }
);
```

##### zoneFromId
Return a single zone by ID.
```ts
zoneFromId(
  ids: string,
  config?: Config
)
```
###### Parameters
- `id` – Id of a zone.
###### Example
```ts
const children = await grid.zoneFromId([
  "D4-1A7-B"​,
  "D4-1A7-C",
  "D4-1A7-D",
  "D4-1A6-C",
  "D4-18B-D",
  "D4-18B-C",
  "D4-18C-D"]
);
```

### Client-side API (Next.js)

The library works almost exclusively on server-side frontends at the moment, specifically for DGGRID and DGGAL grids. To work on client-side frontends you will have to use the [nextjs](nextjs.org) framework. Eventually more wrappers to other frontend frameworks and libraries will be added (remixjs, vitejs, svelte, etc).
Client-side functions are safe to use in:
- React components
- Server Components
- Route handlers
- API consumers

They communicate with the server through `/api/geoplegma/*`.

Example:
```js
"use client";

import { DggrsClient } from "geoplegma-js/next/client";
import { useEffect } from "react";
const g = new DggrsClient("IVEA3H");
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

#### Next.js

For next.js version >= 16, please create a file called `proxy.ts`, on the `root` level or inside `src`, depending on where your `app` folder is. Add this to the file:

```ts
export { proxy } from "geoplegma-js/next/server";

export const config = {
  matcher: ["/api/geoplegma/:path*"],
};
```

For next.js version < 16, repeat the process, but instead of `proxy.ts`, create a file named `middleware.ts`.

#### Functions and types
Common Options
```js
interface Config {
  region: boolean;
  center: boolean;
  vertexCount: boolean;
  children: boolean;
  neighbors: boolean;
  areaSqm: boolean;
  densify: boolean;
}
```

##### zonesFromBbox
Generate zones covering a bounding box.

```ts
zonesFromBbox(
  refinementLevel: number,
  bbox: number[][],
  config?: Config
): Promise<any>
```

###### Parameters
- `refinementLevel` – Grid resolution level
- `bbox` – Bounding box as `[[minLon, minLat], [maxLon, maxLat]]`
- `config` – Optional output configuration

###### Example
```ts
const zones = await client.zonesFromBbox(
  5,
  [
    [-122.6, 37.6],
    [-122.3, 37.9],
  ],
  {    
    center: true,
    region: false,
    vertexCount: false,
    children: false,
    neighbors: false,
    areaSqm: false,
    densify: false
  }
);
```

##### zonesFromPoints
Generate zones from multiple points.
```ts
zonesFromPoints(
  refinementLevel: number,
  points: number[][],
  config?: Config
): Promise<any>
```

###### Parameters
- `points` – Array of [lon, lat] coordinates
###### Example
```ts
const zones = await client.zonesFromPoints(
  7,
  [
    [-73.9857, 40.7484],
    [2.2945, 48.8584],
  ]
);
```

##### zonesFromParent
Generate child zones from a parent zone ID.
```ts
zonesFromParent(
  parentId: string,
  config?: Config
): Promise<any>
```

###### Parameters
- `parentId` – Parent id of a zone.
###### Example
```ts
const children = await client.zonesFromParent(
  "D4-1A7-A",
  { neighbors: true }
);
```

##### zonesFromIds
Fetch zones by their zone IDs.
```ts
zonesFromIds(
  ids: string[],
  config?: Config
): Promise<any>
```

###### Parameters
- `id` – Id of a zone.

###### Example
```ts
const children = await client.zonesFromIds([
  "D4-1A7-B"​,
  "D4-1A7-C",
  "D4-1A7-D",
  "D4-1A6-C",
  "D4-18B-D",
  "D4-18B-C",
  "D4-18C-D"]
);
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
