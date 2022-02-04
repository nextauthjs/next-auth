module.exports = {
  ...require("../adapter-test/jest.config"),
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
}
