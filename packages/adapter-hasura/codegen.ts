import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      'http://localhost:8080/v1/graphql': {
        headers: {
          'x-hasura-admin-secret': 'myadminsecretkey',
        },
      },
    },
  ],
  config: {
    skipTypename: true,
    enumsAsTypes: true,
  },
  documents: "src/**/*.graphql",
  generates: {
    "src/gql/": {
      preset: "client",
      config: {},
      plugins: []
    }
  }
};

export default config;
