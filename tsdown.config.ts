import { defineConfig } from "tsdown";
import { cpSync } from "fs";
import path, { join } from "path";
import { fileURLToPath } from "url";

export default defineConfig([
  {
    entry: ["./src/index.ts"],
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
      // Copy native bindings folder into dist
      cpSync(join(__dirname, "src/native"), join(__dirname, "dist/native"), {
        recursive: true,
      });
      console.log("✅ Copied native bindings into dist/native");
    },
  },
]);
