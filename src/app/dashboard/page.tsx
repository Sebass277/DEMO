import { prisma } from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Megaphone, MessageSquare } from 'lucide-react';
import { cookies } from 'next/headers';
import PostItem from '@/components/ui/PostItem';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get('auth_id')?.value;
  const currentUserId = userIdStr ? parseInt(userIdStr) : -1;

  const posts = await prisma.post.findMany({
    where: { 
      isPublic: false,
      OR: [
        { targetUserId: null },
        { targetUserId: currentUserId }
      ]
    },
    include: { 
      author: true,
      reactions: true,
      poll: {
        include: {
          options: true,
          votes: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <Megaphone className="h-5 w-5 text-indigo-500" />
              Muro de Novedades
            </h2>
            
            <div className="space-y-8">
              {posts.map((post) => (
                <PostItem key={post.id} post={post} currentUserId={currentUserId} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Enlaces Rápidos</h2>
            <ul className="space-y-3">
              <li>
                <a href="/directory" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  → Buscar un compañero
                </a>
              </li>
              <li>
                <a href="/tickets" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  → Crear solicitud de soporte
                </a>
              </li>
              <li>
                <a href="/documents" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  → Políticas de la empresa
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
