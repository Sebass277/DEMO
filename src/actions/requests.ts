'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createRequest(formData: FormData): Promise<void> {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get('auth_id')?.value;
  
  if (!userIdStr) return;

  const type = formData.get('type') as string;
  const description = formData.get('description') as string;

  if (!type || !description) return;

  await prisma.employeeRequest.create({
    data: {
      type,
      description,
      authorId: parseInt(userIdStr),
      status: 'PENDING'
    }
  });

  revalidatePath('/dashboard/worker/requests');
}

export async function updateRequestStatus(formData: FormData): Promise<void> {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  
  if (role !== 'HR_MANAGER') return;

  const id = parseInt(formData.get('id') as string);
  const status = formData.get('status') as string;

  await prisma.employeeRequest.update({
    where: { id },
    data: { status }
  });

  revalidatePath('/dashboard/hr/requests');
}
