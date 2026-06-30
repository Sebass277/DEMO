'use client';

import { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Circle, File, Link as LinkIcon, Video, GraduationCap } from 'lucide-react';
import Link from 'next/link';

type Material = {
  id: number;
  title: string;
  url: string;
  type: string;
};

type Module = {
  id: number;
  title: string;
  materials: Material[];
};

type Exam = {
  id: number;
  title: string;
};

type Course = {
  id: number;
  title: string;
  description: string;
  modules: Module[];
  exams: Exam[];
};

export default function CoursePlayer({ course }: { course: Course }) {
  const [activeItem, setActiveItem] = useState<{ type: 'material' | 'exam', id: number } | null>(
    course.modules[0]?.materials[0] ? { type: 'material', id: course.modules[0].materials[0].id } : null
  );

  const activeMaterial = activeItem?.type === 'material' 
    ? course.modules.flatMap(m => m.materials).find(m => m.id === activeItem.id) 
    : null;
    
  const activeExam = activeItem?.type === 'exam'
    ? course.exams.find(e => e.id === activeItem.id)
    : null;

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col hidden lg:flex">
        <div className="p-4 border-b border-slate-200 bg-white">
          <Link href="/dashboard/lms" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver a Mis Cursos
          </Link>
          <h2 className="font-bold text-slate-900 leading-tight">{course.title}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {course.modules.map((mod, idx) => (
            <div key={mod.id}>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Módulo {idx + 1}: {mod.title}</h3>
              <div className="space-y-1">
                {mod.materials.map(mat => {
                  const isActive = activeItem?.type === 'material' && activeItem.id === mat.id;
                  return (
                    <button 
                      key={mat.id}
                      onClick={() => setActiveItem({ type: 'material', id: mat.id })}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-start gap-3 transition-colors ${isActive ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-100 border border-transparent'}`}
                    >
                      <div className={`mt-0.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {mat.type === 'PDF' && <File className="h-4 w-4" />}
                        {mat.type === 'VIDEO' && <Video className="h-4 w-4" />}
                        {mat.type === 'LINK' && <LinkIcon className="h-4 w-4" />}
                      </div>
                      <span className={`text-sm ${isActive ? 'font-semibold text-indigo-900' : 'font-medium text-slate-700'}`}>{mat.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {course.exams.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Evaluación</h3>
              <div className="space-y-1">
                {course.exams.map(exam => {
                  const isActive = activeItem?.type === 'exam' && activeItem.id === exam.id;
                  return (
                    <button 
                      key={exam.id}
                      onClick={() => setActiveItem({ type: 'exam', id: exam.id })}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-start gap-3 transition-colors ${isActive ? 'bg-emerald-50 border border-emerald-100' : 'hover:bg-slate-100 border border-transparent'}`}
                    >
                      <div className={`mt-0.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <span className={`text-sm ${isActive ? 'font-semibold text-emerald-900' : 'font-medium text-slate-700'}`}>{exam.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-slate-100 relative">
        {activeMaterial ? (
          <div className="flex-1 flex flex-col p-6">
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-6 mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{activeMaterial.title}</h1>
                <p className="text-sm text-slate-500 mt-1">Material de tipo {activeMaterial.type}</p>
              </div>
              <a href={activeMaterial.url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-indigo-500 transition-colors">
                Abrir en nueva pestaña
              </a>
            </div>
            
            <div className="flex-1 bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
              {activeMaterial.type === 'VIDEO' && activeMaterial.url.includes('youtube.com') ? (
                <iframe 
                  className="w-full h-full" 
                  src={activeMaterial.url.replace('watch?v=', 'embed/')} 
                  allowFullScreen 
                />
              ) : (
                <iframe 
                  className="w-full h-full" 
                  src={activeMaterial.url} 
                />
              )}
            </div>
          </div>
        ) : activeExam ? (
          <div className="flex-1 flex items-center justify-center p-6">
             <div className="max-w-md w-full bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8 text-center">
                <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{activeExam.title}</h2>
                <p className="text-slate-500 mb-8">Estás a punto de iniciar tu evaluación final. Asegúrate de tener una conexión estable y tiempo suficiente.</p>
                <Link href={`/dashboard/lms/exam/${activeExam.id}`} className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-500 transition-colors">
                  Iniciar Examen
                </Link>
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <BookOpen className="h-16 w-16 mb-4 opacity-50" />
            <p>Selecciona un módulo en el menú lateral para comenzar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
