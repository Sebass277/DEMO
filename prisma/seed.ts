import { config } from 'dotenv';
config({ path: '.env' });
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding demo data...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@empresa.com' },
    update: {},
    create: {
      email: 'admin@empresa.com',
      password: hashedPassword,
      name: 'Admin Sistema',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      role: 'ADMIN',
      department: 'Gerencia',
    },
  });

  const worker = await prisma.user.upsert({
    where: { email: 'juan@empresa.com' },
    update: {},
    create: {
      email: 'juan@empresa.com',
      password: hashedPassword,
      name: 'Juan Perez',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      role: 'WORKER',
      department: 'Ventas',
    },
  });

  const hr = await prisma.user.upsert({
    where: { email: 'hr@empresa.com' },
    update: {},
    create: {
      email: 'hr@empresa.com',
      password: hashedPassword,
      name: 'Maria RRHH',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      role: 'HR_MANAGER',
      department: 'Recursos Humanos',
    },
  });

  const it = await prisma.user.upsert({
    where: { email: 'it@empresa.com' },
    update: {},
    create: {
      email: 'it@empresa.com',
      password: hashedPassword,
      name: 'Carlos Sistemas',
      role: 'IT_MANAGER',
      department: 'IT',
    },
  });

  const lms = await prisma.user.upsert({
    where: { email: 'lms@empresa.com' },
    update: {},
    create: {
      email: 'lms@empresa.com',
      password: hashedPassword,
      name: 'Laura Capacitación',
      role: 'LMS_MANAGER',
      department: 'Capacitación',
    },
  });

  // Create Posts
  await prisma.post.create({
    data: {
      title: '¡Bienvenidos a la nueva intranet!',
      content: 'Esta es la versión de demostración de nuestra nueva plataforma corporativa.',
      authorId: admin.id,
      isPublic: false,
    },
  });

  await prisma.post.create({
    data: {
      title: 'Noticia Pública: Nuevo servicio lanzado',
      content: 'Estamos felices de anunciar nuestro nuevo servicio a todo el mundo. ¡Únete a nosotros!',
      authorId: admin.id,
      isPublic: true,
    },
  });

  // Create Messages
  await prisma.message.create({
    data: {
      content: 'Hola Juan, ¿pudiste revisar el archivo adjunto?',
      senderId: admin.id,
      receiverId: worker.id,
    }
  });

  await prisma.message.create({
    data: {
      content: 'Sí, aquí te devuelvo el reporte firmado.',
      fileUrl: '/docs/reporte_firmado.pdf',
      senderId: worker.id,
      receiverId: admin.id,
    }
  });

  // Create Documents
  await prisma.document.create({
    data: {
      title: 'Políticas de Vacaciones 2026',
      url: '/docs/politicas_vacaciones.pdf',
      category: 'RRHH',
      uploadedBy: hr.id,
    },
  });

  // Create Course
  const course = await prisma.course.create({
    data: {
      title: 'Seguridad en la Oficina 101',
      description: 'Conceptos básicos de seguridad y prevención de riesgos laborales.',
      coverUrl: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?auto=format&fit=crop&q=80&w=1000'
    }
  });

  const module1 = await prisma.courseModule.create({
    data: {
      title: 'Módulo 1: Introducción',
      order: 1,
      courseId: course.id,
    }
  });

  await prisma.material.create({
    data: {
      title: 'Manual de Evacuación (PDF)',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      type: 'PDF',
      moduleId: module1.id
    }
  });

  // Create Course Enrollment
  await prisma.courseEnrollment.create({
    data: {
      userId: worker.id,
      courseId: course.id,
      progress: 50,
      completed: false,
    },
  });

  // Create Payslip
  await prisma.payslip.create({
    data: {
      title: 'Boleta de Pago - Mayo 2026',
      month: 5,
      year: 2026,
      url: '/docs/boletas/juan_mayo_2026.pdf',
      userId: worker.id,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
