import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Circle } from 'lucide-react';
import QuestionForm from '@/components/lms/QuestionForm';

export default async function EditExamPage({ params }: { params: Promise<{ id: string, examId: string }> }) {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  
  if (role !== 'LMS_MANAGER' && role !== 'ADMIN') redirect('/dashboard');

  const resolvedParams = await params;
  const courseId = parseInt(resolvedParams.id);
  const examId = parseInt(resolvedParams.examId);
  
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      course: true,
      questions: {
        include: {
          options: true
        }
      }
    }
  });

  if (!exam) redirect(`/dashboard/lms/manager/course/${courseId}`);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/lms/manager/course/${courseId}`} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Banco de Preguntas</h1>
          <p className="text-sm text-slate-500 mt-1">Examen: {exam.title} ({exam.course.title})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Questions List */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Preguntas Guardadas ({exam.questions.length})</h2>
          </div>

          {exam.questions.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center">
              <p className="text-sm text-slate-500">Este examen aún no tiene preguntas.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {exam.questions.map((q, idx) => (
                <div key={q.id} className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">{idx + 1}. {q.text}</h3>
                  <div className="space-y-2">
                    {q.options.map(opt => (
                      <div key={opt.id} className={`flex items-center gap-2 p-2 rounded-lg border ${opt.isCorrect ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-slate-100 text-slate-600'}`}>
                        {opt.isCorrect ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <Circle className="h-4 w-4 text-slate-300" />}
                        <span className="text-sm">{opt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form to add a new question */}
        <div className="xl:col-span-1">
          <div className="sticky top-6">
            <QuestionForm examId={exam.id} />
          </div>
        </div>

      </div>
    </div>
  );
}
