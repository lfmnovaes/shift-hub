// Import Jest DOM extensions
import '@testing-library/jest-dom';

// Import test utilities
import {
  setupToastMock,
  setupRouterMock,
  setupFetchMock,
  setupNextLinkMock,
  setupNextServerMock,
  setupRequestMock,
} from './__tests__/test-utils';

// Setup common mocks
setupToastMock();
setupRouterMock();
setupFetchMock();
setupNextLinkMock();
setupNextServerMock();
setupRequestMock();

// Suppress console logs and errors during tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Replace original console methods with jest mocks
beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

// Restore original console methods after tests
afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});
