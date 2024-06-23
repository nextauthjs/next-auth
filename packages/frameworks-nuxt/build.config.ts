import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  entries: [
    {
      input: "src/providers/",
      outDir: `dist/providers`,
      format: "esm",
      ext: "js",
    },
  ],
})
