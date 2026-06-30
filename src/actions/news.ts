'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { promises as fs } from 'fs';
import path from 'path';

export async function createNewsPost(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get('auth_id')?.value;
  const role = cookieStore.get('auth_role')?.value;

  if (role === 'WORKER' || !userIdStr) {
    return { error: 'No autorizado' };
  }

  const userId = parseInt(userIdStr);
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const file = formData.get('file') as File | null;
  const visibility = formData.get('visibility') as string;
  const targetUserIdStr = formData.get('targetUserId') as string;
  const allowReactions = formData.get('allowReactions') !== 'false';
  
  const hasPoll = formData.get('hasPoll') === 'true';
  const pollQuestion = formData.get('pollQuestion') as string;
  const pollOptionsJson = formData.get('pollOptions') as string; // JSON string array of options

  if (!title || !content) {
    return { error: 'Título y contenido son obligatorios' };
  }

  try {
    const isPublic = visibility === 'PUBLIC';
    const targetUserId = visibility === 'SPECIFIC_USER' && targetUserIdStr ? parseInt(targetUserIdStr) : null;

    let finalLinkUrl: string | null = null;
    
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      try {
        await fs.access(uploadDir);
      } catch {
        await fs.mkdir(uploadDir, { recursive: true });
      }
      
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      finalLinkUrl = `/uploads/${filename}`;
    } else {
      finalLinkUrl = formData.get('linkUrl') as string || null;
    }

    let pollData = undefined;
    if (hasPoll && pollQuestion && pollOptionsJson) {
      const options = JSON.parse(pollOptionsJson) as string[];
      if (options.length > 0) {
        pollData = {
          create: {
            question: pollQuestion,
            options: {
              create: options.map(text => ({ text }))
            }
          }
        };
      }
    }

    await prisma.post.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || null,
        linkUrl: finalLinkUrl,
        allowReactions,
        isPublic,
        authorId: userId,
        targetUserId,
        poll: pollData,
      }
    });

    revalidatePath('/dashboard/admin/news');
    revalidatePath('/dashboard');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error creating post:', error);
    return { error: 'Error al crear la noticia' };
  }
}

export async function toggleReaction(postId: number, reactionType: string) {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get('auth_id')?.value;
  if (!userIdStr) throw new Error('No autorizado');
  const userId = parseInt(userIdStr);

  const existing = await prisma.postReaction.findUnique({
    where: {
      postId_userId: { postId, userId }
    }
  });

  if (existing) {
    if (existing.type === reactionType) {
      await prisma.postReaction.delete({ where: { id: existing.id } });
    } else {
      await prisma.postReaction.update({
        where: { id: existing.id },
        data: { type: reactionType }
      });
    }
  } else {
    await prisma.postReaction.create({
      data: { postId, userId, type: reactionType }
    });
  }
  revalidatePath('/dashboard');
}

export async function votePoll(pollOptionId: number, pollId: number) {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get('auth_id')?.value;
  if (!userIdStr) throw new Error('No autorizado');
  const userId = parseInt(userIdStr);

  // Check if already voted
  const existingVote = await prisma.pollVote.findUnique({
    where: {
      pollId_userId: { pollId, userId }
    }
  });

  if (existingVote) {
    throw new Error('Ya has votado en esta encuesta');
  }

  await prisma.pollVote.create({
    data: { pollOptionId, userId, pollId }
  });

  revalidatePath('/dashboard');
}
