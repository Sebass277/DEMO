import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserPlus, CheckCircle, Clock } from 'lucide-react';
import { enrollUser } from '@/actions/lms';

export default async function CourseStudentsPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  
  if (role !== 'LMS_MANAGER' && role !== 'ADMIN') redirect('/dashboard');

  const resolvedParams = await params;
  const courseId = parseInt(resolvedParams.id);
  
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      enrollments: {
        include: { user: true }
      }
    }
  });

  if (!course) redirect('/dashboard/lms/manager');

  // Obtener usuarios que NO están inscritos en el curso
  const enrolledUserIds = course.enrollments.map(e => e.userId);
  const availableUsers = await prisma.user.findMany({
    where: {
      id: { notIn: enrolledUserIds },
      role: 'WORKER'
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/lms/manager" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Alumnos Inscritos</h1>
          <p className="text-sm text-slate-500 mt-1">{course.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* List of Enrolled Students */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-semibold text-slate-900">Inscritos Actuales ({course.enrollments.length})</h2>
            </div>
            {course.enrollments.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">No hay empleados inscritos en este curso.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {course.enrollments.map(enrollment => (
                  <div key={enrollment.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                        {enrollment.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{enrollment.user.name}</p>
                        <p className="text-xs text-slate-500">{enrollment.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {enrollment.completed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle className="h-3 w-3" /> Completado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          <Clock className="h-3 w-3" /> En Progreso ({enrollment.progress}%)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Enroll New Student */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Inscribir Empleado</h2>
              <p className="text-xs text-slate-500 mt-1">Asigna el curso a un trabajador para que pueda tomarlo.</p>
            </div>
            <div className="p-6">
              {availableUsers.length === 0 ? (
                <p className="text-sm text-slate-500 text-center">Todos los trabajadores ya están inscritos.</p>
              ) : (
                <div className="space-y-4">
                  {availableUsers.map(user => (
                    <form key={user.id} action={async () => {
                      'use server';
                      await enrollUser(courseId, user.id);
                    }} className="flex items-center justify-between p-2 rounded-lg border border-slate-100">
                      <span className="text-sm font-medium text-slate-700">{user.name}</span>
                      <button type="submit" className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Asignar curso">
                        <UserPlus className="h-4 w-4" />
                      </button>
                    </form>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
