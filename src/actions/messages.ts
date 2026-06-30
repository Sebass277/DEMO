'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function sendMessage(formData: FormData) {
  const cookieStore = await cookies();
  const senderIdStr = cookieStore.get('auth_id')?.value;
  
  if (!senderIdStr) return { error: 'No autorizado' };

  const senderId = parseInt(senderIdStr);
  const receiverId = parseInt(formData.get('receiverId') as string);
  const content = formData.get('content') as string;
  const fileUrl = formData.get('fileUrl') as string;

  if (!receiverId || !content) {
    return { error: 'Faltan campos requeridos' };
  }

  await prisma.message.create({
    data: {
      content,
      fileUrl: fileUrl || null,
      senderId,
      receiverId,
    }
  });

  revalidatePath('/dashboard/messages');
  return { success: true };
}
