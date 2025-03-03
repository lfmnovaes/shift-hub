import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

// Determine if we're running on the server or client
const isServer = typeof window === 'undefined';

// Configure database client with environment-appropriate URL
const client = createClient({
  // For server-side: use file URL, for client-side: use http fallback
  url: isServer
    ? process.env.DATABASE_URL || 'file:local.db'
    : process.env.NEXT_PUBLIC_DATABASE_URL || 'http://localhost:8080',
  // Sync with remote database if available
  syncUrl: process.env.SYNC_DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

// Helper functions for user management
export async function getUserByUsername(username: string) {
  // Ensure this only runs on the server
  if (!isServer) {
    throw new Error('Database operations should only be performed on the server');
  }

  const result = await db.select().from(schema.users).where(eq(schema.users.username, username));
  return result[0] || null;
}

export async function createUser(username: string, hashedPassword: string) {
  // Ensure this only runs on the server
  if (!isServer) {
    throw new Error('Database operations should only be performed on the server');
  }

  try {
    const result = await db
      .insert(schema.users)
      .values({
        username,
        password: hashedPassword,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}
