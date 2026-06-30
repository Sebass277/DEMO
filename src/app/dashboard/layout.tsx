import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { prisma } from '@/lib/prisma';

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  const email = cookieStore.get('auth_email')?.value;

  if (!role || !email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, avatarUrl: true }
  });

  const unreadMessagesCount = user ? await prisma.message.count({
    where: { receiverId: user.id, isRead: false }
  }) : 0;

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-slate-900 flex">
      <Sidebar role={role} email={email} />
      <div className="flex flex-1 flex-col lg:pl-72 w-full h-screen overflow-hidden p-4 lg:p-6 lg:pl-0 pt-0 lg:pt-6">
        <main className="flex-1 w-full h-full overflow-hidden">
          <div className="bg-[#F8F9FA] rounded-[2rem] w-full h-full overflow-y-auto shadow-2xl ring-1 ring-white/10 flex flex-col">
            <Navbar role={role} email={email} avatarUrl={user?.avatarUrl} unreadCount={unreadMessagesCount} />
            <div className="px-4 py-8 sm:px-8 lg:px-10 max-w-7xl mx-auto flex-1 w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
