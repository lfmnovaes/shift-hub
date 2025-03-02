import { loginUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

jest.mock('@/lib/auth', () => ({
  loginUser: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, options) => ({
      status: options?.status || 200,
      headers: new Map(),
      json: () => Promise.resolve(data),
      cookies: { set: jest.fn() },
    })),
  },
}));

// Mock the Request constructor
global.Request = jest.fn().mockImplementation((url, options) => ({
  url,
  json: () => Promise.resolve(options.body ? JSON.parse(options.body) : {}),
}));

describe('Login API Route', () => {
  let POST;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.isolateModules(() => {
      const route = require('@/app/api/auth/login/route');
      POST = route.POST;
    });
  });

  it('should login a user successfully', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      password: 'hashedpassword',
      createdAt: new Date(),
    };

    loginUser.mockResolvedValue({ success: true, user: mockUser });

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', password: 'password123' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(loginUser).toHaveBeenCalledWith('testuser', 'password123');
    expect(NextResponse.json).toHaveBeenCalledWith({
      user: {
        id: 1,
        username: 'testuser',
        createdAt: expect.any(Date),
      },
    });
    expect(response.cookies.set).toHaveBeenCalledWith({
      name: 'username',
      value: 'testuser',
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  });

  it('should return validation errors', async () => {
    loginUser.mockResolvedValue({
      success: false,
      error: { _errors: ['Invalid username or password'] },
    });

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'wronguser', password: 'wrongpassword' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: { _errors: ['Invalid username or password'] } },
      { status: 400 }
    );
  });

  it('should handle server errors', async () => {
    loginUser.mockRejectedValue(new Error('Database error'));

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', password: 'password123' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  });
});
