import { eq } from 'drizzle-orm';
import { db } from './index';
import { shifts } from './schema';

export async function getShiftsByUser(userId: number) {
  return await db.select().from(shifts).where(eq(shifts.userId, userId));
}

export async function getShiftById(id: number) {
  const result = await db.select().from(shifts).where(eq(shifts.id, id));
  return result[0] || null;
}

export async function assignShiftToUser(shiftId: number, userId: number) {
  const userShifts = await getShiftsByUser(userId);
  if (userShifts.length > 0) {
    throw new Error('User already has an assigned shift');
  }

  const shift = await getShiftById(shiftId);
  if (!shift || shift.userId !== null) {
    throw new Error('Shift is not available');
  }

  try {
    const result = await db
      .update(shifts)
      .set({ userId })
      .where(eq(shifts.id, shiftId))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Error assigning shift:', error);
    throw error;
  }
}

export async function releaseShift(shiftId: number, userId: number) {
  const shift = await getShiftById(shiftId);
  if (!shift || shift.userId !== userId) {
    throw new Error('User does not own this shift');
  }

  try {
    const result = await db
      .update(shifts)
      .set({ userId: null })
      .where(eq(shifts.id, shiftId))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Error releasing shift:', error);
    throw error;
  }
}
