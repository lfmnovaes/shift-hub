import { db } from '@/db';
import { companies, shifts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/session';
import { notFound } from 'next/navigation';
import ShiftDetailsClient from './shift-details-client';

async function getShiftDetails(id: string) {
  const shiftDetails = await db
    .select({
      id: shifts.id,
      date: shifts.date,
      hour: shifts.hour,
      position: shifts.position,
      payment: shifts.payment,
      serviceDescription: shifts.serviceDescription,
      requirements: shifts.requirements,
      benefits: shifts.benefits,
      companyName: companies.name,
      companyLocation: companies.location,
      userId: shifts.userId,
    })
    .from(shifts)
    .leftJoin(companies, eq(shifts.companyId, companies.id))
    .where(eq(shifts.id, parseInt(id)))
    .limit(1);
  return shiftDetails[0];
}

export default async function ShiftDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const shift = await getShiftDetails(id);
  const user = await getCurrentUser();

  if (!shift) {
    notFound();
  }

  const isApplied = shift.userId === user?.id;
  const isOccupied = shift.userId !== null;

  return (
    <ShiftDetailsClient
      shift={shift}
      isApplied={isApplied}
      isOccupied={isOccupied}
      userId={user?.id}
    />
  );
}
