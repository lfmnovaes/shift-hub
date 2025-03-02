// Common test utilities and mocks

// Mock toast messages to be testable
export const mockSuccess = jest.fn();
export const mockError = jest.fn();

// Mock react-hot-toast
export const setupToastMock = () => {
  jest.mock('react-hot-toast', () => ({
    __esModule: true,
    default: {
      success: jest.fn((message) => {
        mockSuccess(message);
        document.body.innerHTML += `<div data-testid="toast-success">${message}</div>`;
        return { id: 'success-toast' };
      }),
      error: jest.fn((message) => {
        mockError(message);
        document.body.innerHTML += `<div data-testid="toast-error">${message}</div>`;
        return { id: 'error-toast' };
      }),
    },
  }));
};

// Mock router
export const mockPush = jest.fn();
export const setupRouterMock = () => {
  jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
    }),
    usePathname: () => '',
    useSearchParams: () => new URLSearchParams(),
  }));
};

// Setup fetch mock
export const setupFetchMock = () => {
  global.fetch = jest.fn();
};

// Common test setup
export const setupTest = () => {
  jest.clearAllMocks();
  if (global.fetch) global.fetch.mockClear();
  document.body.innerHTML = '';
};

// Add a simple test to make Jest happy
describe('Test utilities', () => {
  it('exports the necessary functions', () => {
    expect(typeof mockSuccess).toBe('function');
    expect(typeof mockError).toBe('function');
    expect(typeof mockPush).toBe('function');
    expect(typeof setupToastMock).toBe('function');
    expect(typeof setupRouterMock).toBe('function');
    expect(typeof setupFetchMock).toBe('function');
    expect(typeof setupTest).toBe('function');
  });
});
