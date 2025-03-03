import { NextResponse } from 'next/server';
import { releaseShift, getShiftById } from '@/db/helpers';
import { getCurrentUser } from '@/lib/session';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const shiftId = parseInt(id);

    // Verify the user owns this shift
    const shift = await getShiftById(shiftId);
    if (!shift || shift.userId !== user.id) {
      return NextResponse.json({ error: 'You are not assigned to this shift' }, { status: 400 });
    }

    // Release the shift
    const updatedShift = await releaseShift(shiftId, user.id);

    return NextResponse.json(
      { message: 'Successfully withdrew from shift', shift: updatedShift },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error withdrawing from shift:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to withdraw from shift';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
