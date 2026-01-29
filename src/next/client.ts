// Copyright 2026 contributors to the GeoPlegma project.
// Originally authored by João Manuel (GeoInsight GmbH, joao.manuel@geoinsight.ai)
//
// Licenced under the Apache Licence, Version 2.0 <LICENCE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENCE-MIT or http://opensource.org/licenses/MIT>, at your
// discretion. This file may not be copied, modified, or distributed
// except according to those terms.

import type { Config } from "../native";

interface ClientOptions {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class DggrsClient {
  private name: string;
  private baseUrl: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor(name: string, options: ClientOptions = {}) {
    this.name = name;
    this.baseUrl = options.baseUrl || "/api/geoplegma";
    this.timeout = options.timeout || 30000;
    this.headers = options.headers || {};
  }

  private async request(endpoint: string, body: any): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.headers,
        },
        body: JSON.stringify({ grid_name: this.name, ...body }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = (await response.json().catch(() => ({
          error: response.statusText,
        }))) as { error: string };
        throw new Error(`API error: ${error.error || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new Error("Request timeout");
      }
      throw error;
    }
  }

  async zonesFromBbox(
    refinement_level: number,
    bbox?: number[][],
    config?: Config,
  ) {
    return this.request("/zones-from-bbox", {
      refinement_level,
      bbox,
      config,
    });
  }

  async zoneFromPoint(
    refinement_level: number,
    point?: number[],
    config?: Config,
  ) {
    return this.request("/zone-from-point", {
      refinement_level,
      point,
      config,
    });
  }

  async zonesFromParent(
    relative_depth: number,
    parent_zone_id: string,
    config?: Config,
  ) {
    return this.request("/zones-from-parent", {
      relative_depth,
      parent_zone_id,
      config,
    });
  }

  async zoneFromId(zone_id: string, config?: Config) {
    return this.request("/zone-from-id", {
      zone_id,
      config,
    });
  }
}
