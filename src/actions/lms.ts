'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function checkLmsAccess() {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  if (role !== 'LMS_MANAGER' && role !== 'ADMIN') {
    throw new Error('No autorizado');
  }
}

export async function createCourse(formData: FormData) {
  await checkLmsAccess();
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const coverUrl = formData.get('coverUrl') as string;

  if (!title || !description) throw new Error('Faltan campos');

  await prisma.course.create({
    data: { title, description, coverUrl: coverUrl || null }
  });

  revalidatePath('/dashboard/lms/manager');
  return { success: true };
}

export async function createModule(courseId: number, title: string) {
  await checkLmsAccess();
  
  const count = await prisma.courseModule.count({ where: { courseId } });
  
  await prisma.courseModule.create({
    data: { title, courseId, order: count + 1 }
  });

  revalidatePath(`/dashboard/lms/manager/course/${courseId}`);
  return { success: true };
}

export async function addMaterial(moduleId: number, title: string, url: string, type: string) {
  await checkLmsAccess();
  
  await prisma.material.create({
    data: { title, url, type, moduleId }
  });

  // Revalidaríamos la ruta que corresponda, pero la recibiremos en el cliente o haremos revalidate local
  return { success: true };
}

export async function deleteCourse(courseId: number) {
  await checkLmsAccess();
  await prisma.course.delete({ where: { id: courseId } });
  revalidatePath('/dashboard/lms/manager');
  return { success: true };
}

export async function createExam(courseId: number, title: string) {
  await checkLmsAccess();
  
  const exam = await prisma.exam.create({
    data: { title, courseId }
  });

  revalidatePath(`/dashboard/lms/manager/course/${courseId}`);
  return exam;
}
export async function addQuestion(examId: number, text: string, options: { text: string; isCorrect: boolean }[]) {
  await checkLmsAccess();
  
  await prisma.question.create({
    data: {
      text,
      examId,
      options: {
        create: options
      }
    }
  });

  // Revalidate might need the courseId, we'll let the client handle it or just revalidate the layout
  revalidatePath('/dashboard/lms/manager', 'layout');
  return { success: true };
}

export async function enrollUser(courseId: number, userId: number) {
  await checkLmsAccess();
  
  // Check if already enrolled
  const existing = await prisma.courseEnrollment.findFirst({
    where: { courseId, userId }
  });

  if (!existing) {
    await prisma.courseEnrollment.create({
      data: { courseId, userId }
    });
  }

  revalidatePath(`/dashboard/lms/manager/course/${courseId}/students`);
  return { success: true };
}

export async function submitExam(examId: number, answers: Record<number, number>) {
  const cookieStore = await cookies();
  const email = cookieStore.get('auth_email')?.value;
  if (!email) throw new Error('No autenticado');
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Usuario no encontrado');

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      questions: { include: { options: true } },
      course: true
    }
  });

  if (!exam) throw new Error('Examen no encontrado');

  let correctCount = 0;
  const total = exam.questions.length;

  for (const q of exam.questions) {
    const selectedOptionId = answers[q.id];
    const correctOption = q.options.find(o => o.isCorrect);
    if (correctOption && selectedOptionId === correctOption.id) {
      correctCount++;
    }
  }

  const score = total > 0 ? (correctCount / total) * 100 : 0;
  const passed = score >= 60; // 60% para aprobar

  await prisma.examAttempt.create({
    data: {
      userId: user.id,
      examId,
      score,
      passed
    }
  });

  // Update enrollment completed state
  if (passed) {
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: { userId: user.id, courseId: exam.courseId }
    });
    
    if (enrollment) {
      await prisma.courseEnrollment.update({
        where: { id: enrollment.id },
        data: { completed: true, progress: 100 }
      });
    }
  }

  revalidatePath(`/dashboard/lms/course/${exam.courseId}`);
  revalidatePath(`/dashboard/lms`);
  
  return { success: true, score, passed };
}
