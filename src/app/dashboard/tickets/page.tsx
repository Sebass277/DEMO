import { prisma } from '@/lib/prisma';
import { Ticket as TicketIcon, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Tickets() {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  const userIdStr = cookieStore.get('auth_id')?.value;
  
  if (!role || !userIdStr) redirect('/login');
  const userId = parseInt(userIdStr);

  const canViewAllTickets = role === 'IT_MANAGER' || role === 'ADMIN';

  const tickets = await prisma.ticket.findMany({
    where: canViewAllTickets ? undefined : { authorId: userId },
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  });

  const statusConfig = {
    OPEN: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Abierto' },
    IN_PROGRESS: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'En Progreso' },
    RESOLVED: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Resuelto' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestor de Solicitudes</h1>
        <Link href="/dashboard/tickets/create" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors">
          Nuevo Ticket
        </Link>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-slate-200 sm:rounded-xl">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">
                Título
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                Estado
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                Solicitante
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                Actualizado
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Ver</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {tickets.map((ticket) => {
              const status = statusConfig[ticket.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;

              return (
                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                    <div className="flex items-center gap-3">
                      <TicketIcon className="h-5 w-5 text-slate-400" />
                      {ticket.title}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium border ${status.bg} ${status.color} ${status.border}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {status.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {ticket.author.name.charAt(0)}
                      </div>
                      {ticket.author.name}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                    {formatDistanceToNow(ticket.updatedAt, { addSuffix: true, locale: es })}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link href={`/dashboard/tickets/${ticket.id}`} className="text-indigo-600 hover:text-indigo-900 font-semibold">
                      Ver<span className="sr-only">, {ticket.title}</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
