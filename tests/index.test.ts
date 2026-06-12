import { test } from "vitest";
import { Dggrs } from "../src";
import { Config } from "../src/extend";

// test("Execute grid", () => {
//   const g = new Dggrs("IVEA7H");
//   const rl = 3;
//   const bbox = [
//     [-77.0, 39.0],
//     [-76.0, 40.0],
//   ];
//   const a = g.zonesFromBbox(rl, bbox);
//   let points = [
//     [19.96, 5.34],
//     [9.06, 52.98],
//     [-29.11, -15.28],
//   ];

//   console.log("from bbox: " + a.map((v) => v.id));

//   for (const p of points) {
//     const r = g.zoneFromPoint(rl, p);
//     console.log("from point: " + r[0].id);

//     const c = g.zonesFromParent(rl, r[0].id);
//     console.log("parent: " + c[0].id);

//     for (const child of c) {
//       console.log("children: " + child.id);
//     }

//     const i = g.zoneFromId(r[0].id);
//     console.log( i);
//   }
// });

test("Check config", () => {
  const g = new Dggrs("IVEA7H");
  const rl = 3;
  const bbox = [
    [-77.0, 39.0],
    [-76.0, 40.0],
  ];
  const config: Config = {
    region: true,
    center: true,
    vertexCount: true,
    children: true,
    neighbors: true, // ONE MORE NEIGHTBOR NEED TO FIX -> ITS A ""
    areaSqm: true,
    densify: true // check densify
    // FALTA ADICIONAR AS FUNCTIONS AO JS
  }
  const a = g.zonesFromBbox(rl, bbox, config);
  let points = [
    [19.96, 5.34],
    [9.06, 52.98],
    [-29.11, -15.28],
  ];

  console.log("from bbox: " , a);
});