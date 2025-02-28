module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['./frontend_tests/setup.js'], // Updated path
  testMatch: ['**/frontend_tests/**/*.test.js'], // Updated path
  moduleDirectories: ['node_modules', 'src'],
};
