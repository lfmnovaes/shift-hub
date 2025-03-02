import { getCurrentUser } from '@/lib/session';
import LogoutButton from '@/components/logout-button';

export default async function ShiftPage() {
  const user = await getCurrentUser();
  const username = user?.username || 'Guest';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">Welcome, {username}!</h1>
          <p className="py-4">You have successfully logged in to the Shift Hub.</p>
          <div className="card-actions justify-end">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
