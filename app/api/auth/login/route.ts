import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    console.log(`Login attempt for user: ${username}`);

    const result = await loginUser(username, password);

    if (!result.success) {
      console.log(`Login failed for user: ${username}. Reason: ${JSON.stringify(result.error)}`);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Set a cookie with the username
    if (result.user) {
      console.log(`Login successful for user: ${username}`);

      const response = NextResponse.json({
        user: {
          id: result.user.id,
          username: result.user.username,
          createdAt: result.user.createdAt,
        },
      });

      // Set cookie using the response
      response.cookies.set({
        name: 'username',
        value: result.user.username,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      return response;
    }

    console.error(`Login failed for user: ${username}. User object not returned.`);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
