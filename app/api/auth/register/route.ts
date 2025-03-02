import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, confirmPassword } = body;

    console.log(`Registration attempt for user: ${username}`);

    const result = await registerUser(username, password, confirmPassword);

    if (!result.success) {
      if (result.error?.username) {
        console.log(`Registration failed for user: ${username}. Username already taken.`);
      } else {
        console.log(
          `Registration failed for user: ${username}. Reason: ${JSON.stringify(result.error)}`
        );
      }
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (result.user) {
      console.log(`Registration successful for user: ${username}`);
      return NextResponse.json({
        user: {
          id: result.user.id,
          username: result.user.username,
          createdAt: result.user.createdAt,
        },
      });
    }

    console.error(`Registration failed for user: ${username}. User created but not returned.`);
    return NextResponse.json({ error: 'User created but not returned' }, { status: 500 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
