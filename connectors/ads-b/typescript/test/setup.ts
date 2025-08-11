/**
 * Test setup file - runs before all tests
 */

// If you need to suppress console.warnings in a test, mock console.warn locally in that
// test file or suite.
const originalWarn = console.warn;
console.warn = jest.fn();

// Restore after tests
afterAll(() => {
  console.warn = originalWarn;
});

// Global test utilities
declare global {
  function fail(message?: string): never;
}

global.fail = (message?: string): never => {
  throw new Error(message || 'Test failed');
};

// Mock timers for consistent testing
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});