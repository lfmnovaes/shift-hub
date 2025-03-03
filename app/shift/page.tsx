import { db } from '@/db';
import { companies, shifts } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import Link from 'next/link';

async function getShiftsForWeek() {
  const weekShifts = await db
    .select({
      id: shifts.id,
      date: shifts.date,
      hour: shifts.hour,
      position: shifts.position,
      payment: shifts.payment,
      companyName: companies.name,
      companyLocation: companies.location,
      userId: shifts.userId,
    })
    .from(shifts)
    .leftJoin(companies, eq(shifts.companyId, companies.id))
    .where(and(gte(shifts.date, '2025-03-02'), lte(shifts.date, '2025-03-08')));

  const shiftsByDate = weekShifts.reduce(
    (acc, shift) => {
      const date = shift.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(shift);
      return acc;
    },
    {} as Record<string, typeof weekShifts>
  );

  return shiftsByDate;
}

export default async function ShiftPage() {
  const shiftsByDate = await getShiftsForWeek();

  // Example of week dates data
  const weekDates = [
    { date: '2025-03-02', day: 'Sunday' },
    { date: '2025-03-03', day: 'Monday' },
    { date: '2025-03-04', day: 'Tuesday' },
    { date: '2025-03-05', day: 'Wednesday' },
    { date: '2025-03-06', day: 'Thursday' },
    { date: '2025-03-07', day: 'Friday' },
    { date: '2025-03-08', day: 'Saturday' },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {weekDates.map(({ date, day }) => (
          <div key={date} className="card bg-base-100 shadow-xl">
            <div className="card-body p-4">
              <div className="flex flex-col items-center space-y-1 mb-4">
                <h2 className="card-title text-xl font-bold text-primary">{day}</h2>
                <span className="text-base">
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="space-y-4">
                {shiftsByDate[date]?.map((shift) => (
                  <div
                    key={shift.id}
                    className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow duration-200 w-full"
                  >
                    <div className="card-body p-4 h-64 overflow-y-auto">
                      <div className="flex justify-between items-start">
                        <h3 className="card-title text-sm mb-2">{shift.position}</h3>
                      </div>
                      <div className="text-xs space-y-1">
                        <p className="font-semibold">{shift.companyName}</p>
                        <p className="text-base-content/70">{shift.companyLocation}</p>
                        <p className="text-primary font-bold">{shift.payment}</p>
                        <p className="text-base-content/70">{shift.hour}</p>
                      </div>
                      {shift.userId && <div className="badge badge-warning badge-sm">Occupied</div>}
                      <div className="card-actions justify-center mt-auto">
                        <Link href={`/shift/${shift.id}`} className="btn btn-primary btn-sm">
                          More details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                {!shiftsByDate[date]?.length && (
                  <div className="text-center text-base-content/50 py-4">No shifts available</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
