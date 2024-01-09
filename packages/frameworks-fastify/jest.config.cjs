/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: "node",
  verbose: true,
  moduleNameMapper: {
    '^@auth/core(.*)$': ['<rootDir>/node_modules/@auth/core/$1'],
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.cjs"]
}
