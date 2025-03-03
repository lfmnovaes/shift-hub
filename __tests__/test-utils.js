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
export const setupFetchMock = (mockResponse = null) => {
  if (mockResponse) {
    global.fetch = jest.fn().mockResolvedValue(mockResponse);
  } else {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
  }
};

// Common test setup
export const setupTest = () => {
  jest.clearAllMocks();
  if (global.fetch) global.fetch.mockClear();
  document.body.innerHTML = '';
};

export const setupNextLinkMock = () => {
  jest.mock('next/link', () => ({ href, children }) => <a href={href}>{children}</a>);
};

export function setupNextServerMock() {
  jest.mock('next/server', () => ({
    NextResponse: {
      json: jest.fn().mockImplementation((data, options) => ({
        status: options?.status || 200,
        headers: new Map(),
        json: () => Promise.resolve(data),
        cookies: { set: jest.fn() },
      })),
      redirect: jest.fn().mockImplementation(() => ({
        status: 307,
        headers: new Map(),
        cookies: { set: jest.fn() },
      })),
    },
  }));
}

export const setupSessionMock = (mockUser = null) => {
  // Override the implementation to eliminate the cookie error
  jest.mock(
    '@/lib/session',
    () => ({
      getCurrentUser: jest.fn(() => {
        // Return the provided mock user or the default
        return Promise.resolve(mockUser);
      }),
    }),
    { virtual: true }
  );
};

export const setupDBMock = (mockData = {}) => {
  const defaultDbMock = {
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        leftJoin: jest.fn(() => ({
          where: jest.fn(() => Promise.resolve([])),
        })),
      })),
    })),
  };

  const dbMock = { ...defaultDbMock, ...mockData };

  jest.mock('@/db', () => {
    const originalModule = jest.requireActual('@/db');
    return {
      __esModule: true,
      ...originalModule,
      db: dbMock,
      eq: jest
        .fn()
        .mockImplementation((a, b) => ({ leftField: a, rightValue: b, operation: 'eq' })),
      and: jest.fn().mockImplementation((...conditions) => ({ conditions, operation: 'and' })),
      or: jest.fn().mockImplementation((...conditions) => ({ conditions, operation: 'or' })),
      isNull: jest.fn().mockImplementation((field) => ({ field, operation: 'isNull' })),
      not: jest.fn().mockImplementation((condition) => ({ condition, operation: 'not' })),
      gt: jest
        .fn()
        .mockImplementation((a, b) => ({ leftField: a, rightValue: b, operation: 'gt' })),
      lt: jest
        .fn()
        .mockImplementation((a, b) => ({ leftField: a, rightValue: b, operation: 'lt' })),
      gte: jest
        .fn()
        .mockImplementation((a, b) => ({ leftField: a, rightValue: b, operation: 'gte' })),
      lte: jest
        .fn()
        .mockImplementation((a, b) => ({ leftField: a, rightValue: b, operation: 'lte' })),
      like: jest
        .fn()
        .mockImplementation((a, b) => ({ leftField: a, rightValue: b, operation: 'like' })),
      sql: jest.fn().mockImplementation((query) => ({ query, operation: 'sql' })),
    };
  });
};

export const setupAuthMock = () => {
  jest.mock('@/lib/auth', () => {
    const loginUserMock = jest.fn();
    const registerUserMock = jest.fn();
    return {
      verifyPassword: jest.fn((plain, hashed) => plain === 'validpassword'),
      hashPassword: jest.fn(() => 'hashedpassword'),
      loginUser: loginUserMock,
      registerUser: registerUserMock,
    };
  });
};

export const setupRequestMock = () => {
  global.Request = class Request {
    constructor(url, options = {}) {
      this.url = url;
      this.method = options.method || 'GET';
      this.headers = options.headers || {};
      this.body = options.body || null;
    }

    json() {
      return Promise.resolve(this.body ? JSON.parse(this.body) : {});
    }
  };

  // Also mock URL for API route tests
  global.URL = class URL {
    constructor(path, base) {
      this.path = path;
      this.base = base;
      this.href = `${base || ''}${path}`;
    }

    toString() {
      return this.href;
    }
  };
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
