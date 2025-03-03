import { NextResponse } from 'next/server';
import { assignShiftToUser, getShiftsByUser } from '@/db/helpers';
import { getCurrentUser } from '@/lib/session';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const shiftId = parseInt(id);

    // Check if user already has a shift
    const userShifts = await getShiftsByUser(user.id);
    if (userShifts.length > 0) {
      return NextResponse.json(
        { error: 'You are already assigned to another shift' },
        { status: 400 }
      );
    }

    // Assign the shift to the user
    const updatedShift = await assignShiftToUser(shiftId, user.id);

    return NextResponse.json(
      { message: 'Successfully applied to shift', shift: updatedShift },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error applying to shift:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to apply to shift';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
