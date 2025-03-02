import { getCurrentUser } from '@/lib/session';

export default async function ShiftPage() {
  const user = await getCurrentUser();
  const username = user?.username || 'Guest';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">Welcome, {username}!</h1>
          <p className="py-4">You have successfully logged in to the Shift Hub.</p>
          <p>Use the navbar above to navigate to your account settings or log out.</p>
        </div>
      </div>
    </div>
  );
}
