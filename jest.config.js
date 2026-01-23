module.exports = {
  testEnvironment: 'node',
  verbose: true,
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/server.js', // Exclude entry point
    '!src/config/**', // Exclude config
    '!src/scripts/**',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],

  // Enforce coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Setup files
  setupFiles: ['<rootDir>/tests/setup.js'],
  
  // Setup files after env (for global mocks)
  setupFilesAfterEnv: ['<rootDir>/tests/mocks.js'],
  
  // Match test files in tests folder or __tests__
  testMatch: [
    "**/tests/**/*.test.js",
    "**/__tests__/**/*.test.js"
  ],
  
  // Ignore specific folders
  testPathIgnorePatterns: [
    "/node_modules/",
    "/stress/"
  ]
};
