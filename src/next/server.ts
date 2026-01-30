// Copyright 2026 contributors to the GeoPlegma project.
// Originally authored by João Manuel (GeoInsight GmbH, joao.manuel@geoinsight.ai)
//
// Licenced under the Apache Licence, Version 2.0 <LICENCE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENCE-MIT or http://opensource.org/licenses/MIT>, at your
// discretion. This file may not be copied, modified, or distributed
// except according to those terms.

import { NextRequest, NextResponse } from "next/server";
import { Dggrs, type Config } from "../extend";

interface Body {
  grid_name: string;
}

interface ZonesBbox {
  refinement_level: number;
  bbox: number[][];
  config?: Config;
}

interface ZonesPoint {
  refinement_level: number;
  points: number[][];
  config?: Config;
}

interface ZonesParent {
  relative_depth: number;
  parent_zone_id: string | number;
  config?: Config;
}

interface ZonesId {
  zone_ids: string[] | number[];
  config?: Config;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (req.method === "POST" || req.method === "PUT") {
    try {
      let body = await req.json() as Body;
      if (pathname.startsWith("/api/geoplegma")) {
        const route = pathname.replace("/api/geoplegma/", "");

        if (!body || typeof body !== "object") {
          return NextResponse.json({ error: "Invalid body" }, { status: 400 });
        }

        if (typeof body.grid_name !== "string") {
          return NextResponse.json({ error: "grid_name is required" }, { status: 400 });
        }
        
        const { grid_name, ...rest } = body;
        const grid = new Dggrs(grid_name);

        switch (route) {
          case "zones-from-bbox": {
            const { refinement_level, bbox, config } = rest as ZonesBbox;
            return NextResponse.json(
              grid.zonesFromBbox(refinement_level, bbox, config),
            );
          }
          case "zones-from-points": {
            const { refinement_level, points, config } = rest as ZonesPoint;

            const response = [];
            for (let index = 0, len = points.length; index < len; index++) {
              const point = points[index];
              response.push(
                ...grid.zoneFromPoint(refinement_level, point, config),
              );
            }

            return NextResponse.json(response);
          }
          case "zones-from-parent": {
            const { relative_depth, parent_zone_id, config } =
              rest as ZonesParent;
            return NextResponse.json(
              grid.zonesFromParent(relative_depth, parent_zone_id, config),
            );
          }
          case "zones-from-ids": {
            const { zone_ids, config } = rest as ZonesId;

            const response = [];
            for (let index = 0, len = zone_ids.length; index < len; index++) {
              const zone_id = zone_ids[index];
              response.push(
                ...grid.zoneFromId(zone_id, config),
              );
            }

            return NextResponse.json(response);
          }
          default:
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  } else {
    return NextResponse.next();
  }
}
