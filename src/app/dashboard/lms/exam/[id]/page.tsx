import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ExamTaker from '@/components/lms/ExamTaker';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function TakeExamPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const email = cookieStore.get('auth_email')?.value;
  
  if (!email) redirect('/login');

  const resolvedParams = await params;
  const examId = parseInt(resolvedParams.id);
  
  // Verify enrollment
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) redirect('/login');

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      questions: { include: { options: true } },
      course: true
    }
  });

  if (!exam) redirect('/dashboard/lms');

  const enrollment = await prisma.courseEnrollment.findFirst({
    where: { userId: user.id, courseId: exam.courseId }
  });

  if (!enrollment && user.role !== 'LMS_MANAGER' && user.role !== 'ADMIN') {
    redirect('/dashboard/lms');
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <Link href={`/dashboard/lms/course/${exam.courseId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Curso
        </Link>
      </div>
      <ExamTaker exam={exam} />
    </div>
  );
}
