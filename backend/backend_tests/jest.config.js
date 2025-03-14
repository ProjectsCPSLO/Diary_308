export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  extensionsToTreatAsEsm: ['.js', '.jsx'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  transformIgnorePatterns: [],
  forceExit: true,
  testTimeout: 10000
};