// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.PORT = 3001;
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'password';
process.env.DB_NAME = 'test_db';

// Mock console.log/error to keep test output clean
global.console = {
  ...console,
  // log: jest.fn(), // Uncomment if you want to suppress logs
  // error: jest.fn(),
};
