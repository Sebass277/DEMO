import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ArrowLeft, Send, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { addTicketComment, updateTicketStatus } from '@/actions/tickets';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({ params }: PageProps) {
  const { id } = await params;
  const ticketId = parseInt(id);

  if (isNaN(ticketId)) notFound();

  const cookieStore = await cookies();
  const userIdStr = cookieStore.get('auth_id')?.value;
  const role = cookieStore.get('auth_role')?.value;

  if (!userIdStr || !role) redirect('/login');
  const userId = parseInt(userIdStr);

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      author: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!ticket) notFound();

  // Validate Privacy
  const isIT = role === 'IT_MANAGER' || role === 'ADMIN';
  if (!isIT && ticket.authorId !== userId) {
    redirect('/dashboard/tickets'); // User trying to access someone else's ticket
  }

  const statusConfig = {
    OPEN: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Abierto' },
    IN_PROGRESS: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'En Progreso' },
    RESOLVED: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Resuelto' },
  };

  const status = statusConfig[ticket.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  const handleComment = addTicketComment.bind(null, ticket.id);
  const handleStatusUpdate = async (formData: FormData) => {
    'use server';
    const newStatus = formData.get('status') as string;
    await updateTicketStatus(ticket.id, newStatus);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/tickets" 
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Ticket #{ticket.id}
          </h1>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${status.bg} ${status.color} ${status.border}`}>
            <StatusIcon className="h-4 w-4" />
            {status.label}
          </span>
        </div>

        {isIT && (
          <form action={handleStatusUpdate} className="flex items-center gap-2">
            <select
              name="status"
              defaultValue={ticket.status}
              className="block w-40 rounded-md border-0 py-1.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="OPEN">Abierto</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="RESOLVED">Resuelto</option>
            </select>
            <button
              type="submit"
              className="rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
            >
              Actualizar
            </button>
          </form>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                {ticket.author.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{ticket.author.name}</p>
                <p className="text-sm text-slate-500">{ticket.author.role} • {ticket.author.department}</p>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              {formatDistanceToNow(ticket.createdAt, { addSuffix: true, locale: es })}
            </p>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{ticket.title}</h2>
          <div className="prose prose-slate max-w-none">
            <p className="whitespace-pre-line text-slate-700">{ticket.description}</p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-slate-50 p-6 space-y-6">
          <h3 className="text-sm font-semibold text-slate-900">Historial de Comunicación</h3>
          
          <div className="space-y-6">
            {ticket.comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <div className="h-8 w-8 shrink-0 rounded-full bg-white ring-1 ring-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                  {comment.author.name.charAt(0)}
                </div>
                <div className="flex-1 bg-white p-4 rounded-2xl rounded-tl-none shadow-sm ring-1 ring-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-slate-900">{comment.author.name}</span>
                    <span className="text-xs text-slate-400">
                      {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: es })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-line">{comment.content}</p>
                </div>
              </div>
            ))}

            {ticket.comments.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-4">No hay respuestas todavía.</p>
            )}
          </div>
        </div>

        {/* Comment Input */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form action={handleComment} className="flex gap-4">
            <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
              Yo
            </div>
            <div className="flex-1 relative">
              <textarea
                name="content"
                rows={1}
                required
                placeholder="Escribe una respuesta..."
                className="block w-full rounded-2xl border-0 py-2.5 pl-4 pr-12 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 resize-none min-h-[44px]"
              />
              <button
                type="submit"
                className="absolute right-2 top-1.5 p-1.5 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
