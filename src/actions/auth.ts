'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Correo y contraseña son requeridos' };
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return { error: 'Credenciales inválidas' };
  }

  if (!user.isActive) {
    return { error: 'Tu cuenta ha sido desactivada por el administrador.' };
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return { error: 'Credenciales inválidas' };
  }

  const cookieStore = await cookies();
  cookieStore.set('auth_role', user.role, { path: '/' });
  cookieStore.set('auth_email', user.email, { path: '/' });
  cookieStore.set('auth_id', user.id.toString(), { path: '/' });

  redirect('/dashboard');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_role');
  cookieStore.delete('auth_email');
  cookieStore.delete('auth_id');
  redirect('/login');
}
