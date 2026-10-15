module.exports = {
  testEnvironment: 'jsdom',

  // Transform .vue files with @vue/vue2-jest and .ts with babel-jest
  transform: {
    '^.+\\.vue$': '@vue/vue2-jest',
    '^.+\\.[jt]s$': 'babel-jest'
  },

  // Map @ alias and stub static assets
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/services/api$': '<rootDir>/src/tests/__mocks__/api.ts',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/tests/__mocks__/styleMock.js',
    '\\.(png|jpg|svg|ico)$': '<rootDir>/src/tests/__mocks__/fileMock.js'
  },

  // File extensions Jest will resolve
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],

  // Test file locations
  testMatch: ['**/src/tests/**/*.spec.[jt]s'],

  // Coverage
  collectCoverageFrom: [
    'src/views/**/*.vue',
    'src/components/**/*.vue',
    'src/services/**/*.ts',
    '!src/tests/**'
  ],

  coverageReporters: ['text', 'lcov'],

  // Setup Bootstrap-Vue globally for all tests
  setupFiles: ['<rootDir>/src/tests/setup.ts']
}
