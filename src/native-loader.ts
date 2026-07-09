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

function loadPlatformBinding(): NativeBindings {
  // Local build produced by `npm run build-native` (see scripts/dev.sh), used
  // during development before the platform packages below are published.
  const localAddonPath = path.join(__dirname, "native", "napi.node");
  if (existsSync(localAddonPath)) {
    return loadAddon(localAddonPath);
  }

  // Platform packages published under optionalDependencies, one per napi-rs
  // target (see npm/<platform>/package.json and
  // .github/workflows/build-binaries.yml). Each branch below must use a
  // static, literal `require("pkg-name")` call: bundlers and static file
  // tracers (webpack, esbuild, Next.js output file tracing, pkg, ...) only
  // follow literal require specifiers, not ones built from a variable/lookup
  // table - a dynamic path here gets silently dropped from traced/bundled
  // output, which is exactly what caused it to go missing under Next.js's
  // standalone build.
  //
  // Only linux-x64-gnu is built today: geoplegma depends on dggal-rust, which
  // bootstraps the ecere/eC toolchain via a POSIX make-based build.rs that
  // doesn't yet build on macOS/Windows. Add darwin-arm64/win32-x64-msvc back
  // here (as their own branch, same pattern) once that upstream build is
  // portable.
  if (process.platform === "linux" && process.arch === "x64") {
    try {
      return require("geoplegma-js-linux-x64-gnu") as NativeBindings;
    } catch {
      throw new Error(
        'Failed to find native binding "geoplegma-js-linux-x64-gnu". ' +
          "It should have been installed via optionalDependencies - try reinstalling.",
      );
    }
  }

  throw new Error(
    `geoplegma-js does not ship a prebuilt binary for ${process.platform}-${process.arch}. ` +
      "Supported platforms: linux-x64 (glibc).",
  );
}

const bindings: NativeBindings = loadPlatformBinding();

export default bindings;
