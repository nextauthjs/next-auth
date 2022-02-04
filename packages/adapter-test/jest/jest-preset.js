module.exports = {
  transform: {
    ".(ts|tsx)$": "ts-jest",
    ".(js|jsx)$": "babel-jest", // jest's default
  },
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  rootDir: ".",
  roots: [
    "../adapter-dgraph",
    "../adapter-fauna",
    "../adapter-mikro-orm",
    "../adapter-neo4j",
    "../adapter-prisma",
    "../adapter-upstash-redis",
    "../adapter-dynamodb",
    "../adapter-firebase",
    "../adapter-mongodb",
    "../adapter-pouchdb",
    "../adapter-sequelize",
    "../adapter-typeorm-legacy",
  ],
  coverageDirectory: "<rootDir>/coverage/",
  collectCoverageFrom: ["<rootDir>/packages/*/src/**/*.{ts,tsx}"],
  testURL: "http://localhost/",
  moduleDirectories: ["node_modules"],
}
