module.exports = {
  transform: {
    ".(ts|tsx)$": "@swc/jest",
    ".(js|jsx)$": "@swc/jest", // jest's default
  },
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  rootDir: ".",
  // coverageDirectory: "<rootDir>/coverage/",
  // collectCoverageFrom: ["<rootDir>/packages/*/src/**/*.{ts,tsx}"],
  testURL: "http://localhost/",
  moduleDirectories: ["node_modules"],
}
