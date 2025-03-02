// Import Jest DOM extensions
import '@testing-library/jest-dom';

// Import test utilities
import { setupToastMock, setupRouterMock, setupFetchMock } from './__tests__/test-utils';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}));

// Setup common mocks
setupToastMock();
setupRouterMock();
setupFetchMock();
