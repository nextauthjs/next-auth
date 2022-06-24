/** @type { import('@jest/types').Config.InitialOptions } */
module.exports = {
    preset: "@next-auth/adapter-test/jest",
    setupFilesAfterEnv: ["./tests/jest-setup.js"]
};
