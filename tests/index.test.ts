import { test, expect } from "vitest";
import { Dggrs } from "../src";
import { Config } from "../src/extend";

test("Execute grid", () => {
  const g = new Dggrs("IVEA7H");
  const rl = 3;
  const bbox = [
    [-77.0, 39.0],
    [-76.0, 40.0],
  ];

  const zones = g.zonesFromBbox(rl, bbox);
  expect(Array.isArray(zones)).toBe(true);
  expect(zones.length).toBeGreaterThan(0);
  expect(zones[0].id).toBeDefined();

  const points = [
    [19.96, 5.34],
    [9.06, 52.98],
    [-29.11, -15.28],
  ];

  for (const p of points) {
    const r = g.zoneFromPoint(rl, p);
    expect(Array.isArray(r)).toBe(true);
    expect(r[0].id).toBeDefined();

    const c = g.zonesFromParent(1, r[0].id);
    expect(Array.isArray(c)).toBe(true);
    expect(c.length).toBeGreaterThan(0);
    expect(c[0].id).toBeDefined();

    const i = g.zoneFromId(r[0].id);
    expect(Array.isArray(i)).toBe(true);
    expect(i[0].id).toBe(r[0].id);
  }
});

test("Check config", () => {
  const g = new Dggrs("IVEA7H");
  const rl = 5;
  const bbox = [
    [-77.0, 39.0],
    [-76.0, 40.0],
  ];
  const config: Config = {
    region: true,
    center: true,
    vertexCount: true,
    children: true,
    neighbors: true,
    areaSqm: true,
    densify: true,
  };

  const zones = g.zonesFromBbox(rl, bbox, config);
  expect(Array.isArray(zones)).toBe(true);
  expect(zones.length).toBeGreaterThan(0);
  expect(zones[0].id).toBeDefined();
  expect(Array.isArray(zones[0].center)).toBe(true);
  expect(Array.isArray(zones[0].region)).toBe(true);
  expect(zones[0].region.length).toBeGreaterThan(0);
  expect(typeof zones[0].vertexCount).toBe("number");
  expect(Array.isArray(zones[0].children)).toBe(true);
  expect(Array.isArray(zones[0].neighbors)).toBe(true);
  expect(typeof zones[0].area_sqm).toBe("number");
  expect(zones[0].area_sqm).toBeGreaterThan(0);
});

test("Grid level info", () => {
  const g = new Dggrs("IVEA7H");

  const count = g.zoneCount(3);
  expect(typeof count).toBe("number");
  expect(count).toBeGreaterThan(0);

  const min = g.minRefinementLevel();
  const max = g.maxRefinementLevel();
  const def = g.defaulRefinementLevel();
  expect(typeof min).toBe("number");
  expect(typeof max).toBe("number");
  expect(typeof def).toBe("number");
  expect(min).toBeLessThanOrEqual(max);
  expect(def).toBeGreaterThanOrEqual(min);
  expect(def).toBeLessThanOrEqual(max);

  const maxDepth = g.maxRelativeDepth();
  const defaultDepth = g.defaultRelativeDepth();
  expect(typeof maxDepth).toBe("number");
  expect(typeof defaultDepth).toBe("number");
  expect(defaultDepth).toBeLessThanOrEqual(maxDepth);
});
