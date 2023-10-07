import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  overwrite: true,
  schema: "schema.graphql",
  emitLegacyCommonJSImports: false,
  documents: "src/**/*.graphql",
  generates: {
    "src/lib/": {
      preset: "client",
      config: {
        documentMode: "string",
        skipTypename: true,
        enumsAsTypes: true,
        strictScalars: true,
        useTypeImports: true,
        scalars: {
          timestamptz: "string",
          uuid: "string",
        },
      },
      plugins: [],
    },
  },
  hooks: { afterAllFileWrite: ["prettier --write"] },
}

export default config
