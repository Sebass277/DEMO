import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Newspaper } from 'lucide-react';

export default async function AdminNewsList() {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;

  if (role === 'WORKER') redirect('/dashboard');

  const posts = await prisma.post.findMany({
    include: { author: true, targetUser: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestor de Noticias</h1>
        <Link 
          href="/dashboard/admin/news/create" 
          className="inline-flex items-center gap-2 rounded-xl bg-[#D9F971] px-4 py-2 text-sm font-bold text-slate-900 shadow-sm hover:scale-105 transition-transform"
        >
          <Plus className="h-4 w-4" />
          Nueva Noticia
        </Link>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-slate-200 sm:rounded-[2rem] overflow-hidden p-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No hay noticias</h3>
            <p className="text-slate-500 mt-1">Comienza creando tu primera publicación.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="py-3 text-left text-sm font-semibold text-slate-900">Título</th>
                  <th className="py-3 text-left text-sm font-semibold text-slate-900">Visibilidad</th>
                  <th className="py-3 text-left text-sm font-semibold text-slate-900">Destinatario</th>
                  <th className="py-3 text-left text-sm font-semibold text-slate-900">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="py-4 text-sm font-medium text-slate-900">{post.title}</td>
                    <td className="py-4 text-sm text-slate-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${post.isPublic ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                        {post.isPublic ? 'Pública' : 'Interna'}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-slate-500">
                      {post.targetUser ? post.targetUser.name : 'Todos'}
                    </td>
                    <td className="py-4 text-sm text-slate-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
