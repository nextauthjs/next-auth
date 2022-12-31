import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/**/*.ts"],
  target: "esnext",
  sourcemap: options.watch ? "inline" : false,
  clean: true,
  minify: false,
  keepNames: false,
  tsconfig: "./tsconfig.json",
  format: ["esm"],
  external: ["solid-js", "solid-js/web", "solid-start"],
  dts: true,
  bundle: false,
}));
