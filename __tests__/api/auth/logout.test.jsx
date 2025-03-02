import { NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation(() => ({
      status: 200,
      headers: new Map(),
      json: () => Promise.resolve({}),
      cookies: { set: jest.fn() },
    })),
    redirect: jest.fn().mockImplementation(() => ({
      status: 307,
      headers: new Map(),
      cookies: { set: jest.fn() },
    })),
  },
}));

// Mock the Request constructor
global.Request = jest.fn().mockImplementation((url) => ({ url }));

// Mock URL constructor
global.URL = jest.fn().mockImplementation((path) => ({
  toString: () => path,
}));

describe('Logout API Route', () => {
  let POST;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.isolateModules(() => {
      const route = require('@/app/api/auth/logout/route');
      POST = route.POST;
    });
  });

  it('should clear the username cookie and redirect to home', async () => {
    const request = new Request('http://localhost/api/auth/logout', {
      method: 'POST',
    });

    const response = await POST(request);

    expect(response.status).toBe(307); // Redirect status
    expect(NextResponse.redirect).toHaveBeenCalled();
    expect(response.cookies.set).toHaveBeenCalledWith({
      name: 'username',
      value: '',
      httpOnly: true,
      expires: expect.any(Date),
      path: '/',
    });
  });
});
