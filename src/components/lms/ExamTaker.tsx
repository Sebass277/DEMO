'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitExam } from '@/actions/lms';
import { CheckCircle2, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

type Option = { id: number; text: string };
type Question = { id: number; text: string; options: Option[] };
type Exam = { id: number; title: string; courseId: number; questions: Question[] };

export default function ExamTaker({ exam }: { exam: Exam }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  const handleSelect = (questionId: number, optionId: number) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < exam.questions.length) {
      alert('Por favor responde todas las preguntas');
      return;
    }
    setLoading(true);
    const res = await submitExam(exam.id, answers);
    setResult({ score: res.score, passed: res.passed });
    setLoading(false);
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8 text-center">
        <div className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 ${result.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
          {result.passed ? <CheckCircle2 className="h-10 w-10" /> : <AlertCircle className="h-10 w-10" />}
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{result.passed ? '¡Felicidades!' : 'Sigue intentándolo'}</h2>
        <p className="text-slate-500 mb-6">Tu puntuación final es:</p>
        <div className="text-5xl font-black text-slate-900 mb-8">{result.score.toFixed(0)}%</div>
        <Link href={`/dashboard/lms/course/${exam.courseId}`} className="inline-flex justify-center items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-slate-800 transition-colors">
          <BookOpen className="h-4 w-4" /> Volver al Curso
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 border-b-4 border-indigo-500">
        <h1 className="text-2xl font-bold text-slate-900">{exam.title}</h1>
        <p className="text-sm text-slate-500 mt-2">Responde todas las preguntas para completar el curso.</p>
      </div>

      <div className="space-y-6">
        {exam.questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">
                <span className="text-indigo-600 mr-2">{idx + 1}.</span>
                {q.text}
              </h3>
            </div>
            <div className="p-4 space-y-2">
              {q.options.map(opt => (
                <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers[q.id] === opt.id ? 'border-indigo-500 bg-indigo-50 text-indigo-900' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                  <input 
                    type="radio" 
                    name={`q-${q.id}`} 
                    value={opt.id}
                    checked={answers[q.id] === opt.id}
                    onChange={() => handleSelect(q.id, opt.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium">{opt.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSubmit} 
          disabled={loading || Object.keys(answers).length < exam.questions.length}
          className="inline-flex justify-center items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Evaluando...' : 'Entregar Examen'} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
