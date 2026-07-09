// Copyright 2025 contributors to the GeoPlegma project.
// Originally authored by João Manuel (GeoInsight GmbH, joao.manuel@geoinsight.ai)
//
// Licenced under the Apache Licence, Version 2.0 <LICENCE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENCE-MIT or http://opensource.org/licenses/MIT>, at your
// discretion. This file may not be copied, modified, or distributed
// except according to those terms.

import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";
import { existsSync } from "fs";
import type { Dggrs } from "./native";

export interface NativeBindings {
  Dggrs: typeof Dggrs;
}

if (typeof process === "undefined" || !process.versions?.node) {
  throw new Error("geoplegma-js requires Node.js");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Platform packages published under optionalDependencies, one per napi-rs target.
// See npm/<platform>/package.json and .github/workflows/build-binaries.yml.
const PLATFORM_PACKAGES: Record<string, string> = {
  "linux-x64": "geoplegma-js-linux-x64-gnu/napi.linux-x64-gnu.node",
  "darwin-arm64": "geoplegma-js-darwin-arm64/napi.darwin-arm64.node",
  "win32-x64": "geoplegma-js-win32-x64-msvc/napi.win32-x64-msvc.node",
};

function loadAddon(addonPath: string): NativeBindings {
  try {
    return require(addonPath) as NativeBindings;
  } catch (requireError) {
    // Fallback to process.dlopen for ESM compatibility
    const module = { exports: {} as NativeBindings };
    process.dlopen(module, addonPath);
    return module.exports;
  }
}

function resolveAddonPath(): string {
  // Local build produced by `npm run build-native` (see scripts/dev.sh), used
  // during development before the platform packages below are published.
  const localAddonPath = path.join(__dirname, "native", "napi.node");
  if (existsSync(localAddonPath)) {
    return localAddonPath;
  }

  const key = `${process.platform}-${process.arch}`;
  const platformPackage = PLATFORM_PACKAGES[key];
  if (!platformPackage) {
    throw new Error(
      `geoplegma-js does not ship a prebuilt binary for ${key}. ` +
        `Supported platforms: ${Object.keys(PLATFORM_PACKAGES).join(", ")}.`,
    );
  }

  try {
    return require.resolve(platformPackage);
  } catch {
    throw new Error(
      `Failed to find native binding "${platformPackage}". ` +
        "It should have been installed via optionalDependencies - try reinstalling.",
    );
  }
}

const bindings: NativeBindings = loadAddon(resolveAddonPath());

export default bindings;
