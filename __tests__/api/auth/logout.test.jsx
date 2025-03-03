import { NextResponse } from 'next/server';
import { setupNextServerMock, setupRequestMock } from '@/__tests__/test-utils';

describe('Logout API Route', () => {
  let POST;

  beforeEach(() => {
    jest.clearAllMocks();
    setupNextServerMock();
    setupRequestMock();

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
