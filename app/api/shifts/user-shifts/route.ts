import { NextResponse } from 'next/server';
import { getShiftsByUser } from '@/db/helpers';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userShifts = await getShiftsByUser(user.id);

    return NextResponse.json({ shifts: userShifts }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching user shifts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user shifts';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
