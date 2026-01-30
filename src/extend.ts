// Copyright 2025 contributors to the GeoPlegma project.
// Originally authored by João Manuel (GeoInsight GmbH, joao.manuel@geoinsight.ai)
//
// Licenced under the Apache Licence, Version 2.0 <LICENCE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENCE-MIT or http://opensource.org/licenses/MIT>, at your
// discretion. This file may not be copied, modified, or distributed
// except according to those terms.

import { decodeZones } from "./utils";

import bindings from "./native-loader";

const { Dggrs: Aux } = bindings;

export interface Config {
  region: boolean;
  center: boolean;
  vertexCount: boolean;
  children: boolean;
  neighbors: boolean;
  areaSqm: boolean;
  densify: boolean;
}

export class Dggrs extends Aux {
  constructor(name: string) {
    super(name);
  }
  zonesFromBbox(refinement_level: number, bbox?: number[][], config?: Config) {
    return decodeZones(super.zonesFromBbox(refinement_level, bbox, config));
  }
  zoneFromPoint(refinement_level: number, point?: number[], config?: Config) {
    return decodeZones(super.zoneFromPoint(refinement_level, point, config));
  }
  zonesFromParent(
    relative_depth: number,
    parentZoneId: string | number,
    config?: Config,
  ): any {
    return decodeZones(
      super.zonesFromParent(relative_depth, parentZoneId, config),
    );
  }
  zoneFromId(zoneId: string | number, config?: Config): any {
    return decodeZones(super.zoneFromId(zoneId, config));
  }
}
