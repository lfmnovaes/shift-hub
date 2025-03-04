import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import * as schema from './schema';
import { usernameSchema, newUserSchema } from './validation';
import { ZodError } from 'zod';

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

export async function getUserByUsername(username: string) {
  if (!isServer) {
    throw new Error('Database operations should only be performed on the server');
  }

  try {
    const validatedUsername = usernameSchema.parse(username);
    const result = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, validatedUsername));
    return result[0] || null;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Invalid username: ${error.message}`);
    }
    throw error;
  }
}

export async function createUser(username: string, hashedPassword: string) {
  if (!isServer) {
    throw new Error('Database operations should only be performed on the server');
  }

  try {
    const validatedInput = newUserSchema.parse({
      username,
      password: hashedPassword,
    });

    const result = await db
      .insert(schema.users)
      .values({
        username: validatedInput.username,
        password: validatedInput.password,
      })
      .returning();
    return result[0];
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Validation error: ${error.message}`);
    }
    return null;
  }
}
