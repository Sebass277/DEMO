import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CreateNewsForm from '@/components/admin/CreateNewsForm';

export default async function CreateNewsPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;

  if (role === 'WORKER') redirect('/dashboard');

  const users = await prisma.user.findMany({
    select: { id: true, name: true, department: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/admin/news" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a Noticias
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Crear Noticia</h1>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-slate-200 sm:rounded-[2rem] p-8">
        <CreateNewsForm users={users} />
      </div>
    </div>
  );
}
