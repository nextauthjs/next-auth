// @ts-check

/** @type {import("@swc/core").Config} */
const swcConfig = {
  jsc: {
    parser: { syntax: "typescript", decorators: true },
    transform: { legacyDecorator: true, decoratorMetadata: true },
  },
}

/** @type {import("jest").Config} */
// @ts-expect-error FIXME
export default {
  transform: {
    "^.+\\.(t|j)s$": ["@swc/jest", swcConfig],
  },
  rootDir: ".",
  // coverageDirectory: "<rootDir>/coverage/",
  // collectCoverageFrom: ["<rootDir>/packages/*/src/**/*.{ts,tsx}"],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
}
