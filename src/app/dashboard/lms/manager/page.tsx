import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { BookOpen, Plus, Users } from 'lucide-react';
import Link from 'next/link';

export default async function LmsManagerPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  
  if (role !== 'LMS_MANAGER' && role !== 'ADMIN') redirect('/dashboard');

  const courses = await prisma.course.findMany({
    include: {
      enrollments: true
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestión de Cursos (LMS)</h1>
          <p className="text-sm text-slate-500 mt-1">Crea cursos y supervisa el avance de los empleados.</p>
        </div>
        <Link href="/dashboard/lms/manager/create" className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
          <Plus className="h-4 w-4" /> Nuevo Curso
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map(c => (
          <div key={c.id} className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden flex flex-col">
            {c.coverUrl ? (
              <div className="h-32 w-full">
                <img src={c.coverUrl} alt={c.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-32 w-full bg-slate-100 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-slate-300" />
              </div>
            )}
            <div className="p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                  <Users className="h-3 w-3" /> {c.enrollments.length} Inscritos
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{c.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-3">{c.description}</p>
            </div>
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex gap-2">
              <Link href={`/dashboard/lms/manager/course/${c.id}/students`} className="flex-1 text-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-colors">
                Ver Alumnos
              </Link>
              <Link href={`/dashboard/lms/manager/course/${c.id}`} className="flex-1 text-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-colors">
                Editar Curso
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
