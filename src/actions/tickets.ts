'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTicket(formData: FormData) {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get('auth_id')?.value;
  
  if (!userIdStr) {
    throw new Error('No estás autenticado');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  if (!title || !description) {
    throw new Error('Todos los campos son obligatorios');
  }

  await prisma.ticket.create({
    data: {
      title,
      description,
      authorId: parseInt(userIdStr),
      status: 'OPEN',
    },
  });

  revalidatePath('/dashboard/tickets');
  redirect('/dashboard/tickets');
}

export async function addTicketComment(ticketId: number, formData: FormData) {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get('auth_id')?.value;
  
  if (!userIdStr) {
    throw new Error('No estás autenticado');
  }

  const content = formData.get('content') as string;

  if (!content) return;

  await prisma.ticketComment.create({
    data: {
      content,
      ticketId,
      authorId: parseInt(userIdStr),
    },
  });

  // Actualizamos el updated_at del ticket
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { updatedAt: new Date() }
  });

  revalidatePath(`/dashboard/tickets/${ticketId}`);
  revalidatePath('/dashboard/tickets');
}

export async function updateTicketStatus(ticketId: number, status: string) {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  
  if (role !== 'IT_MANAGER' && role !== 'ADMIN') {
    throw new Error('No tienes permisos para realizar esta acción');
  }

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { status },
  });

  revalidatePath(`/dashboard/tickets/${ticketId}`);
  revalidatePath('/dashboard/tickets');
}
