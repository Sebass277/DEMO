import { prisma } from '@/lib/prisma';
import { Users, FileText, GraduationCap } from 'lucide-react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;

  if (role !== 'ADMIN') redirect('/');

  const [usersCount, docsCount, coursesCount] = await Promise.all([
    prisma.user.count(),
    prisma.document.count(),
    prisma.course.count()
  ]);

  const metrics = [
    { name: 'Usuarios Activos', value: usersCount, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Documentos', value: docsCount, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Cursos Activos', value: coursesCount, icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Panel Administrativo</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((item) => (
          <div key={item.name} className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <dt>
              <div className={`absolute rounded-lg p-3 ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-slate-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
              <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
            </dd>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200 min-h-[400px] flex items-center justify-center text-slate-400 border border-dashed border-slate-300">
        Área para futuras gráficas y reportes detallados (Recharts/Chart.js)
      </div>
    </div>
  );
}
