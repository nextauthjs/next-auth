import config from "utils/adapter/jest-preset.js"

//TODO: update rest of the packages to Jest 29+
const {testURL, ...rest} = config
export default {
  ...rest,
  testEnvironmentOptions: {
    url: testURL
  },
  rootDir: ".."
}