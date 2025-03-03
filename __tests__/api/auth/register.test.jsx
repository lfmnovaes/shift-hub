import * as authModule from '@/lib/auth';
import { NextResponse } from 'next/server';
import { setupNextServerMock, setupRequestMock } from '@/__tests__/test-utils';

jest.mock('@/lib/auth');

describe('Register API Route', () => {
  let POST;
  const { registerUser } = authModule;

  beforeEach(() => {
    jest.clearAllMocks();
    setupNextServerMock();
    setupRequestMock();

    jest.isolateModules(() => {
      const route = require('@/app/api/auth/register/route');
      POST = route.POST;
    });
  });

  it('should register a user successfully', async () => {
    jest.mocked(registerUser).mockResolvedValueOnce({
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
    jest.mocked(registerUser).mockResolvedValue({
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
    jest.mocked(registerUser).mockRejectedValue(new Error('Database error'));

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
