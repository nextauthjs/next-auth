import type { CodegenConfig } from "@graphql-codegen/cli"

export default {
  overwrite: true,
  schema: "schema.gql",
  emitLegacyCommonJSImports: false,
  documents: "src/queries/*.graphql",
  generates: {
    "src/lib/generated/": {
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
    },
  },
} satisfies CodegenConfig
