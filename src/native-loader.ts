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

if (typeof process === 'undefined' || !process.versions?.node) {
  throw new Error('geoplegma-js requires Node.js');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const addonPath = path.join(__dirname, 'native', 'napi.node');

if (!existsSync(addonPath)) {
  throw new Error(`Native addon not found at: ${addonPath}`);
}

let bindings;

try {
  const require = createRequire(import.meta.url);
  bindings = require(addonPath);
} catch (requireError) {
  // Fallback to process.dlopen for ESM compatibility
  const module = { exports: {} };
  process.dlopen(module, addonPath);
  bindings = module.exports;
}

export default bindings;
