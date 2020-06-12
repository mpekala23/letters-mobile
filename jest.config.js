import * as expoPreset from "jest-expo";
const jestPreset = require("@testing-library/react-native/jest-preset");

module.exports = Object.assign(expoPreset, jestPreset, {
  preset: "jest-expo",
  setupFiles: [
    ...expoPreset.setupFiles,
    ...jestPreset.setupFiles,
    "./test/setupJest.ts",
  ],
});
