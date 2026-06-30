import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createCourse } from '@/actions/lms';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default async function CreateCoursePage() {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  
  if (role !== 'LMS_MANAGER' && role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/lms/manager" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Crear Nuevo Curso</h1>
          <p className="text-sm text-slate-500 mt-1">Configura los detalles básicos de tu nuevo curso.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <form action={async (formData) => {
          'use server';
          await createCourse(formData);
          redirect('/dashboard/lms/manager');
        }} className="p-8 space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Título del Curso</label>
            <input 
              type="text" 
              name="title" 
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Ej. Seguridad y Salud Ocupacional" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Descripción</label>
            <textarea 
              name="description" 
              required
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none" 
              placeholder="¿Qué aprenderán los empleados en este curso?" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">URL de la Imagen de Portada (Opcional)</label>
            <input 
              type="url" 
              name="coverUrl" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="https://ejemplo.com/imagen.jpg" 
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link href="/dashboard/lms/manager" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              Cancelar
            </Link>
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
              <BookOpen className="h-4 w-4" /> Crear Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
