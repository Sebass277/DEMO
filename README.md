# 🏥 Prisma - Portal e Intranet Corporativa (Clínica Robles)

¡Bienvenido a **Prisma**, la intranet corporativa y portal administrativo de la **Clínica Robles**! Esta aplicación web moderna ha sido diseñada para optimizar la comunicación interna, la capacitación del personal, la gestión de soporte técnico (TI), y los trámites de Recursos Humanos dentro de la organización.

---

## 🚀 Características Principales

El portal cuenta con diferentes módulos integrados y adaptados para satisfacer las necesidades de múltiples roles dentro de la clínica:

1. **📰 Muro de Noticias (Público y Privado)**:
   - Publicación de noticias institucionales y novedades médicas.
   - Soporte para reacciones (Likes, Love, etc.) y encuestas interactivas.
   - Control de visibilidad (noticias públicas visibles para pacientes o externas, y noticias privadas exclusivas para personal).

2. **🎓 LMS - Sistema de Aprendizaje Integrado**:
   - Plataforma para cursos internos y capacitaciones continuas (ej. Seguridad en la oficina).
   - Organización de módulos de estudio con soporte de videos, PDFs y enlaces externos.
   - Evaluaciones interactivas (exámenes) con autocalificación y registro de aprobados.
   - Seguimiento del progreso individual de cada empleado por parte de los supervisores (`LMS_MANAGER`).

3. **🎫 Centro de Soporte (Tickets TI)**:
   - Registro de incidencias técnicas (problemas de red, impresoras, hardware/software).
   - Asignación de tickets a especialistas de soporte (`IT_MANAGER`).
   - Comentarios internos y actualización de estados (`OPEN`, `IN_PROGRESS`, `RESOLVED`).

4. **💼 Recursos Humanos**:
   - **Solicitudes de Empleado**: Petición y aprobación de vacaciones, licencias médicas y cambios de turnos.
   - **Boletas de Pago (Payslips)**: Subida, organización y consulta confidencial de recibos de sueldo mensuales.
   - Panel de aprobación dedicado para el rol de Recursos Humanos (`HR_MANAGER`).

5. **💬 Chat y Mensajería Interna**:
   - Chat en tiempo real entre empleados de la clínica.
   - Envío de archivos y documentos adjuntos dentro de la mensajería.
   - Notificación visual de mensajes no leídos.

6. **📁 Directorio de Contactos**:
   - Directorio institucional para buscar perfiles de otros médicos, enfermeros y personal administrativo por departamento.

---

## 🛠️ Stack Tecnológico

El proyecto está construido sobre las tecnologías más modernas de desarrollo web:

- **Frontend & Backend**: [Next.js 16 (App Router)](https://nextjs.org/) con React 19 y TypeScript.
- **Base de Datos**: SQLite (ideal para desarrollo rápido y demostraciones locales).
- **ORM**: [Prisma](https://www.prisma.io/) para el modelado de datos y consultas tipadas.
- **Estilos**: Tailwind CSS 4 para un diseño premium, fluido, moderno y responsivo.
- **Iconografía**: [Lucide React](https://lucide.dev/).
- **Seguridad**: Encriptación de contraseñas con `bcryptjs` y manejo seguro de sesiones.

---

## 👥 Credenciales de Prueba (Demo Seeding)

La base de datos contiene usuarios precargados para evaluar las funcionalidades de cada rol. **La contraseña para todos los usuarios de demostración es `password123`**.

| Nombre | Correo Electrónico | Rol (Role) | Departamento | Funcionalidad Principal |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Sistema** | `admin@empresa.com` | `ADMIN` | Gerencia | Control global, creación de contenido y administración general. |
| **Juan Perez** | `juan@empresa.com` | `WORKER` | Ventas / Staff | Vista estándar del empleado: realiza solicitudes, ve sus boletas y cursos. |
| **Maria RRHH** | `hr@empresa.com` | `HR_MANAGER` | Recursos Humanos | Autoriza solicitudes de vacaciones, gestiona y carga boletas de pago. |
| **Carlos Sistemas** | `it@empresa.com` | `IT_MANAGER` | IT / Sistemas | Atiende, asigna y resuelve los tickets de soporte de la clínica. |
| **Laura Capacitación** | `lms@empresa.com` | `LMS_MANAGER` | Capacitación | Crea cursos, módulos de estudio, exámenes y monitorea el progreso formativo. |

---

## 📥 Guía de Instalación y Configuración Local

Sigue estos pasos para levantar la intranet Prisma en tu entorno de desarrollo local:

### 1. Requisitos Previos
Asegúrate de tener instalado **Node.js** (versión 18 o superior recomendada) y tu gestor de paquetes favorito (`npm`, `yarn`, `pnpm` o `bun`).

### 2. Clonar el Repositorio e Instalar Dependencias
Clona el repositorio desde GitHub e ingresa al directorio del proyecto:

```bash
git clone https://github.com/Sebass277/DEMO.git
cd DEMO
```

Instala las dependencias necesarias:

```bash
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto (puedes duplicar el archivo `.env` existente si ya está configurado). Debe contener la variable de conexión de base de datos SQLite:

```env
DATABASE_URL="file:./dev.db"
```

### 4. Configurar la Base de Datos (Prisma)
Genera el cliente de Prisma y levanta el esquema de la base de datos (SQLite):

```bash
# Sincroniza la estructura de la base de datos con el esquema de Prisma
npx prisma db push
```

A continuación, ejecuta el script de **Seed** para poblar la base de datos con los usuarios de prueba, noticias iniciales, chats, y cursos del LMS descritos anteriormente:

```bash
# Carga los datos de demostración precargados
npx prisma db seed
```

*(Opcional) Si en algún momento quieres inspeccionar visualmente los datos almacenados de forma interactiva:*
```bash
npx prisma studio
```

### 5. Iniciar el Servidor de Desarrollo
Por último, arranca la aplicación localmente:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para interactuar con la aplicación. Para iniciar sesión en la intranet, haz clic en **"Acceso Intranet"** en la esquina superior derecha y usa cualquiera de las credenciales especificadas en la sección de **Credenciales de Prueba**.

---

## 📁 Estructura del Proyecto

A continuación se detalla la organización de los directorios clave en `src/`:

```text
src/
├── actions/        # Server Actions para mutaciones de datos estructurados (auth, tickets, courses)
├── app/            # Next.js App Router (Rutas, Layouts y Páginas)
│   ├── dashboard/  # Dashboard de la intranet protegido con subcarpetas para cada módulo
│   ├── login/      # Página de inicio de sesión y autenticación
│   ├── globals.css # Configuración e importación de Tailwind CSS 4
│   └── page.tsx    # Página de inicio pública (Muro de Novedades)
├── components/     # Componentes compartidos de la UI (layout, chat, forms, stats)
├── lib/            # Utilidades reutilizables y cliente Prisma configurado
└── generated/      # Código y tipos generados automáticamente (Prisma client)
```

---

## 🔒 Licencia y Contribuciones

Este proyecto fue desarrollado como demostración técnica para la **Clínica Robles**. Las contribuciones, sugerencias y reportes de fallos son bienvenidos a través de Pull Requests y el módulo de Issues de este repositorio.
