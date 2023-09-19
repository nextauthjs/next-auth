import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      "http://localhost:8080/v1/graphql": {
        headers: {
          "x-hasura-admin-secret": "myadminsecretkey",
        },
      },
    },
  ],
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
