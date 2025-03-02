import { registerUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

jest.mock('@/lib/auth', () => ({
  registerUser: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, options) => ({
      status: options?.status || 200,
      headers: new Map(),
      json: () => Promise.resolve(data),
    })),
  },
}));

// Mock the Request constructor
global.Request = jest.fn().mockImplementation((url, options) => ({
  url,
  json: () => Promise.resolve(options.body ? JSON.parse(options.body) : {}),
}));

describe('Register API Route', () => {
  let POST;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.isolateModules(() => {
      const route = require('@/app/api/auth/register/route');
      POST = route.POST;
    });
  });

  it('should register a user successfully', async () => {
    registerUser.mockResolvedValueOnce({
      success: true,
      user: {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        createdAt: new Date(),
      },
    });

    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(registerUser).toHaveBeenCalledWith('testuser', 'password123', 'password123');
  });

  it('should return validation errors', async () => {
    registerUser.mockResolvedValue({
      success: false,
      error: { username: ['Username already taken'] },
    });

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'existinguser',
        password: 'password123',
        confirmPassword: 'password123',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: { username: ['Username already taken'] } },
      { status: 400 }
    );
  });

  it('should handle server errors', async () => {
    registerUser.mockRejectedValue(new Error('Database error'));

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  });
});
