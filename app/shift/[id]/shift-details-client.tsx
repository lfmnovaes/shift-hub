'use client';

import Link from 'next/link';
import ShiftActionButton from './shift-action-button';
import { Shift } from '@/db/schema';

interface ShiftWithCompany extends Omit<Shift, 'createdAt' | 'companyId'> {
  companyName: string | null;
  companyLocation: string | null;
}

interface ShiftDetailsClientProps {
  shift: ShiftWithCompany;
  isApplied: boolean;
  isOccupied: boolean;
  userId?: number;
}

export default function ShiftDetailsClient({
  shift,
  isApplied,
  isOccupied,
  userId,
}: ShiftDetailsClientProps) {
  return (
    <div className="container mx-auto p-4">
      <div className="card bg-base-100 shadow-xl max-w-3xl mx-auto">
        <div className="card-body">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="card-title text-2xl mb-2">{shift.position}</h1>
              <h2 className="text-xl font-semibold text-primary">{shift.companyName}</h2>
              <p className="text-base-content/70">{shift.companyLocation}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{shift.payment}</p>
              <p className="text-base-content/70">{shift.hour}</p>
              {isOccupied && !isApplied && (
                <span className="badge badge-warning mt-2">Occupied</span>
              )}
            </div>
          </div>
          <div className="divider"></div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Service Description</h3>
              <p className="text-base-content/80">{shift.serviceDescription}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <p className="text-base-content/80">{shift.requirements}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Benefits</h3>
              <p className="text-base-content/80">{shift.benefits}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Date</h3>
              <p className="text-base-content/80">
                {new Date(shift.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="card-actions justify-between mt-8">
            <Link href="/shift" className="btn">
              Back to Shifts
            </Link>
            <ShiftActionButton
              shiftId={shift.id}
              isApplied={isApplied}
              isOccupied={isOccupied}
              userId={userId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
