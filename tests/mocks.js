// Global Mocks
// Mock Database Connection to prevent connection attempts during tests
jest.mock('../src/config/db', () => ({
  query: jest.fn(),
  execute: jest.fn(),
  on: jest.fn(),
  end: jest.fn()
}));

// Mock Logger to silence logs during tests
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));
