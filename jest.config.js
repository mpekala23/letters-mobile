const expoPreset = require('jest-expo/jest-preset');
const jestPreset = require('@testing-library/react-native/jest-preset');

module.exports = Object.assign(expoPreset, jestPreset, {
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: [...expoPreset.setupFiles, ...jestPreset.setupFiles, './test/setup/setupJest.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)',
  ],
});
