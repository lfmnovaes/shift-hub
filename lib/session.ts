import { cookies } from 'next/headers';
import { getUserByUsername } from '@/db';

export async function getCurrentUser() {
  try {
    // Get the cookie
    const cookieStore = await cookies();
    const username = cookieStore.get('username')?.value;

    if (!username) {
      return null;
    }

    const user = await getUserByUsername(username);

    if (!user) {
      return null;
    }

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
