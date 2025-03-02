import { notFound } from 'next/navigation';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/session';
import { UserIcon } from '@/assets';

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return notFound();
  }

  const { id } = await params;
  const userId = parseInt(id);
  if (isNaN(userId)) {
    return notFound();
  }

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) {
    return notFound();
  }

  const createdAt = new Date(user.createdAt);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(createdAt);

  return (
    <div className="bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-base-200 rounded-box shadow-lg overflow-hidden">
            <div className="bg-primary text-primary-content p-8 flex items-center gap-6">
              <div className="bg-primary-content/20 p-4 rounded-full">
                <UserIcon className="h-16 w-16" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <p className="opacity-80 text-lg">User Profile</p>
              </div>
            </div>
            <div className="p-8">
              <div className="py-6">
                <h2 className="text-xl font-semibold mb-6">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-base-100 p-6 rounded-box shadow">
                    <p className="text-base opacity-70">User ID</p>
                    <p className="font-medium text-lg">{user.id}</p>
                  </div>
                  <div className="bg-base-100 p-6 rounded-box shadow">
                    <p className="text-base opacity-70">Username</p>
                    <p className="font-medium text-lg">{user.username}</p>
                  </div>
                  <div className="bg-base-100 p-6 rounded-box shadow">
                    <p className="text-base opacity-70">Created At</p>
                    <p className="font-medium text-lg">{formattedDate}</p>
                  </div>
                  <div className="bg-base-100 p-6 rounded-box shadow">
                    <p className="text-base opacity-70">Password Hash</p>
                    <p className="font-mono text-sm break-all bg-base-200 p-3 rounded mt-2 overflow-x-auto">
                      {user.password}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
