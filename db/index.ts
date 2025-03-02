import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

// SQLite database for local development only
const client = createClient({
  url: process.env.DATABASE_URL || 'file:./local.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

// Helper functions for user management
export async function getUserByUsername(username: string) {
  const result = await db.select().from(schema.users).where(eq(schema.users.username, username));
  return result[0] || null;
}

export async function createUser(username: string, hashedPassword: string) {
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
