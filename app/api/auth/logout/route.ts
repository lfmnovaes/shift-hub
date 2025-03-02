import { NextResponse } from 'next/server';

export async function POST() {
  // Create a response that redirects to the home page
  const response = NextResponse.redirect(
    new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  );

  // Clear the username cookie
  response.cookies.set({
    name: 'username',
    value: '',
    httpOnly: true,
    expires: new Date(0), // Set expiration to the past
    path: '/',
  });

  console.log('User logged out successfully');
  return response;
}
