import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, File, Video, Link as LinkIcon, Trash2 } from 'lucide-react';
import { createModule, addMaterial, createExam } from '@/actions/lms';

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  
  if (role !== 'LMS_MANAGER' && role !== 'ADMIN') redirect('/dashboard');

  const resolvedParams = await params;
  const courseId = parseInt(resolvedParams.id);
  
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: { materials: true }
      },
      exams: true
    }
  });

  if (!course) redirect('/dashboard/lms/manager');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/lms/manager" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{course.title}</h1>
          <p className="text-sm text-slate-500 mt-1">Editor de Contenido y Módulos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content: Modules */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Módulos de Aprendizaje</h2>
          </div>

          {course.modules.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center">
              <p className="text-sm text-slate-500 mb-4">Aún no hay módulos en este curso.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {course.modules.map(mod => (
                <div key={mod.id} className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">{mod.title}</h3>
                  </div>
                  
                  {/* Materials list */}
                  <div className="p-4 space-y-2">
                    {mod.materials.map(mat => (
                      <div key={mat.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                        <div className="h-8 w-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          {mat.type === 'PDF' && <File className="h-4 w-4" />}
                          {mat.type === 'VIDEO' && <Video className="h-4 w-4" />}
                          {mat.type === 'LINK' && <LinkIcon className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{mat.title}</p>
                          <a href={mat.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline truncate block">
                            Ver Recurso
                          </a>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {/* Add material form */}
                    <form action={async (formData) => {
                      'use server';
                      const title = formData.get('title') as string;
                      const url = formData.get('url') as string;
                      const type = formData.get('type') as string;
                      await addMaterial(mod.id, title, url, type);
                      redirect(`/dashboard/lms/manager/course/${course.id}`);
                    }} className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-12 gap-2">
                      <input type="text" name="title" required placeholder="Nuevo Material..." className="col-span-5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                      <input type="url" name="url" required placeholder="URL..." className="col-span-4 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                      <select name="type" className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-2 text-sm outline-none">
                        <option value="VIDEO">Video</option>
                        <option value="PDF">PDF</option>
                        <option value="LINK">Link</option>
                      </select>
                      <button type="submit" className="col-span-1 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700">
                        <Plus className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form to add a new module */}
          <form action={async (formData) => {
            'use server';
            const title = formData.get('title') as string;
            await createModule(courseId, title);
          }} className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-6 flex gap-3">
            <input 
              type="text" 
              name="title" 
              required
              placeholder="Nombre del Nuevo Módulo..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
            />
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors">
              <Plus className="h-4 w-4" /> Añadir Módulo
            </button>
          </form>
        </div>

        {/* Sidebar: Exams & Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Examen Final</h2>
              <p className="text-xs text-slate-500 mt-1">Evalúa el conocimiento de los empleados al terminar.</p>
            </div>
            <div className="p-6">
              {course.exams.length > 0 ? (
                <div className="space-y-3">
                  {course.exams.map(e => (
                    <div key={e.id} className="p-3 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 text-sm font-semibold flex justify-between items-center">
                      {e.title}
                      <Link href={`/dashboard/lms/manager/course/${course.id}/exam/${e.id}`} className="text-xs underline hover:text-emerald-700">Editar</Link>
                    </div>
                  ))}
                </div>
              ) : (
                <form action={async () => {
                  'use server';
                  await createExam(courseId, 'Examen Final');
                }}>
                  <button type="submit" className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors">
                    <Plus className="h-4 w-4" /> Crear Examen
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
