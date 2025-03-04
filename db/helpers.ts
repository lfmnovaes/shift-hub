import { eq } from 'drizzle-orm';
import { db } from './index';
import { shifts } from './schema';
import {
  userIdSchema,
  shiftIdSchema,
  shiftAssignmentSchema,
  shiftReleaseSchema,
} from './validation';
import { ZodError } from 'zod';

export async function getShiftsByUser(userId: number) {
  try {
    const validatedUserId = userIdSchema.parse(userId);

    return await db.select().from(shifts).where(eq(shifts.userId, validatedUserId));
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Invalid user ID: ${error.message}`);
    }
    throw error;
  }
}

export async function getShiftById(id: number) {
  try {
    const validatedShiftId = shiftIdSchema.parse(id);

    const result = await db.select().from(shifts).where(eq(shifts.id, validatedShiftId));
    return result[0] || null;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Invalid shift ID: ${error.message}`);
    }
    throw error;
  }
}

export async function assignShiftToUser(shiftId: number, userId: number) {
  try {
    const validatedParams = shiftAssignmentSchema.parse({ shiftId, userId });

    const userShifts = await getShiftsByUser(validatedParams.userId);
    if (userShifts.length > 0) {
      throw new Error('User already has an assigned shift');
    }

    const shift = await getShiftById(validatedParams.shiftId);
    if (!shift || shift.userId !== null) {
      throw new Error('Shift is not available');
    }

    const result = await db
      .update(shifts)
      .set({ userId: validatedParams.userId })
      .where(eq(shifts.id, validatedParams.shiftId))
      .returning();
    return result[0];
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Validation error: ${error.message}`);
    }
    console.error('Error assigning shift:', error);
    throw error;
  }
}

export async function releaseShift(shiftId: number, userId: number) {
  try {
    const validatedParams = shiftReleaseSchema.parse({ shiftId, userId });

    const shift = await getShiftById(validatedParams.shiftId);
    if (!shift || shift.userId !== validatedParams.userId) {
      throw new Error('User does not own this shift');
    }

    const result = await db
      .update(shifts)
      .set({ userId: null })
      .where(eq(shifts.id, validatedParams.shiftId))
      .returning();
    return result[0];
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Validation error: ${error.message}`);
    }
    throw error;
  }
}
