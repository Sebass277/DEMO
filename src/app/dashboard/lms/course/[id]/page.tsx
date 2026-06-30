import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CoursePlayer from '@/components/lms/CoursePlayer';

export default async function ViewCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const email = cookieStore.get('auth_email')?.value;
  
  if (!email) redirect('/login');

  const resolvedParams = await params;
  const courseId = parseInt(resolvedParams.id);
  
  // Verify enrollment
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) redirect('/login');

  const enrollment = await prisma.courseEnrollment.findFirst({
    where: { userId: user.id, courseId }
  });

  if (!enrollment && user.role !== 'LMS_MANAGER' && user.role !== 'ADMIN') {
    redirect('/dashboard/lms');
  }

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

  if (!course) redirect('/dashboard/lms');

  return (
    <div className="max-w-7xl mx-auto -m-6">
      <CoursePlayer course={course} />
    </div>
  );
}
