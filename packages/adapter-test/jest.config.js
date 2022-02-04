module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["dist/", "node_modules/"],
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
  // TODO: Set-up with Codecov https://about.codecov.io/
  // collectCoverage: true,
  // coverageReporters: ["json", "html"],
}
