import { qwikVite } from "@builder.io/qwik/optimizer"
import { join } from "path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import { viteStaticCopy } from "vite-plugin-static-copy"

export default defineConfig(() => {
  return {
    build: {
      minify: false,
      target: "es2020",
      outDir: ".",
      lib: {
        entry: ["./src/index.ts"],
        formats: ["es"],
        fileName: (_, entryName) => `${entryName}.qwik.js`,
      },
      rollupOptions: {
        external: [
          "@builder.io/qwik",
          "@builder.io/qwik-city",
          "@builder.io/qwik/build",
          "@auth/core",
        ],
      },
    },
    plugins: [
      qwikVite(),
      dts({
        tsconfigPath: join(__dirname, "tsconfig.json"),
      }),
      viteStaticCopy({
        targets: [
          {
            src: "src/providers/*",
            dest: "providers/",
            rename: (fileName: string) => `${fileName}.js`,
          },
        ],
      }),
    ],
  }
})
