/**
 * Test setup file - runs before all tests
 */

// Mock console.warn to reduce noise in tests
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