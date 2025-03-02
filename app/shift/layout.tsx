import { getCurrentUser } from '@/lib/session';
import Navbar from '@/components/navbar';

export default async function ShiftLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar username={user.username} userId={user.id} />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
