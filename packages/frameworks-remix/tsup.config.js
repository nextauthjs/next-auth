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
  external: ["@remix-run/server-runtime", "@remix-run/react"],
  dts: true,
  bundle: false,
}));
