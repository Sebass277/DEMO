'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleUserStatus(formData: FormData) {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  
  if (role !== 'ADMIN') return { error: 'No autorizado' };

  const userId = parseInt(formData.get('userId') as string);
  const currentStatus = formData.get('currentStatus') === 'true';

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: !currentStatus }
  });

  revalidatePath('/dashboard/admin/users');
  return { success: true };
}
