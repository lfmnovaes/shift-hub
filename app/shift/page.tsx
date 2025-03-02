import Link from 'next/link';

export default function ShiftPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">Welcome!</h1>
          <p className="py-4">You have successfully logged in to the Shift Hub.</p>
          <div className="card-actions justify-end">
            <Link href="/" className="btn btn-primary">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
