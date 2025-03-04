import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { getUserByUsername, createUser } from '@/db';

// Validation schemas
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(/^[a-zA-Z][a-zA-Z\-_]*$/, 'Only letters, dash or underscore allowed');

export const passwordSchema = z.string().min(3, 'Password must be at least 3 characters');

export const registerSchema = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export async function registerUser(username: string, password: string, confirmPassword: string) {
  // Validate input
  const result = registerSchema.safeParse({ username, password, confirmPassword });
  if (!result.success) {
    return { success: false, error: result.error.format() };
  }

  // Check if user already exists
  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return { success: false, error: { username: ['Username already taken'] } };
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await createUser(username, hashedPassword);
  if (!user) {
    return { success: false, error: { _errors: ['Failed to create user'] } };
  }

  return { success: true, user };
}

export async function loginUser(username: string, password: string) {
  // Validate input
  const result = loginSchema.safeParse({ username, password });
  if (!result.success) {
    return { success: false, error: result.error.format() };
  }

  // Check if user exists
  const user = await getUserByUsername(username);
  if (!user) {
    return { success: false, error: { _errors: ['Invalid username or password'] } };
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { success: false, error: { _errors: ['Invalid username or password'] } };
  }

  return { success: true, user };
}
