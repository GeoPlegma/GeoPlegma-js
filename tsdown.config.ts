import { defineConfig } from "tsdown";
import { cpSync, existsSync } from "fs";
import path, { join } from "path";
import { fileURLToPath } from "url";

export default defineConfig([
  {
    entry: {
      index: "./src/index.ts",
      "next/client": "./src/next/client.ts",
      "next/server": "./src/next/server.ts",
    },
    platform: "node",
    format: ["esm", "cjs"],
    dts: true,
    external: [
      "module", // Node built-in
      "url", // Node built-in
      "path", // always externalize built-ins
    ],
    sourcemap: true,
    clean: true,
    async onSuccess() {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const nativeDir = join(__dirname, "src/native");
      // Only present locally after `npm run build-native` (see scripts/dev.sh).
      // Not required for CI/publish builds, which rely on the prebuilt
      // per-platform optionalDependencies packages instead.
      if (existsSync(nativeDir)) {
        cpSync(nativeDir, join(__dirname, "dist/native"), {
          recursive: true,
        });
        console.log("✅ Copied native bindings into dist/native");
      }
    },
  },
]);
