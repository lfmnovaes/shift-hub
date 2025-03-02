import { getCurrentUser } from '@/lib/session';
import Navbar from '@/components/navbar';
import { redirect } from 'next/navigation';

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar username={user.username} userId={user.id} />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
