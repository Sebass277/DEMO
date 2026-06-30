import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { PlayCircle, CheckCircle2, Circle } from 'lucide-react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function LMS() {
  const cookieStore = await cookies();
  const email = cookieStore.get('auth_email')?.value;

  if (!email) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      courseEnrollments: {
        include: { course: true }
      }
    }
  });

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Mis Cursos (LMS)</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {user.courseEnrollments.map((enrollment) => (
          <div key={enrollment.id} className="relative flex flex-col justify-between rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md overflow-hidden">
            {enrollment.course.coverUrl ? (
              <div className="h-32 w-full">
                <img src={enrollment.course.coverUrl} alt={enrollment.course.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-32 bg-indigo-100 flex items-center justify-center relative">
                <PlayCircle className="h-12 w-12 text-indigo-400 opacity-80" />
              </div>
            )}
            
            <div className="p-6">
              <h3 className="font-bold text-lg text-slate-900 leading-tight mb-2">{enrollment.course.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-6">{enrollment.course.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={enrollment.completed ? 'text-emerald-600' : 'text-indigo-600'}>
                    Progreso
                  </span>
                  <span className="text-slate-700">{enrollment.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${enrollment.completed ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                {enrollment.completed ? (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> Completado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-600">
                    <Circle className="h-4 w-4" /> En curso
                  </span>
                )}
                <Link href={`/dashboard/lms/course/${enrollment.courseId}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                  {enrollment.progress === 0 ? 'Comenzar' : 'Continuar'} →
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {user.courseEnrollments.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
            No estás inscrito en ningún curso.
          </div>
        )}
      </div>
    </div>
  );
}
