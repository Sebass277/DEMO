import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { updateRequestStatus } from '@/actions/requests';
import { Clock, CheckCircle2, XCircle, User } from 'lucide-react';

export default async function HrRequestsPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  
  if (role !== 'HR_MANAGER' && role !== 'ADMIN') redirect('/dashboard');

  const requests = await prisma.employeeRequest.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"><CheckCircle2 className="h-3 w-3"/> Aprobado</span>;
      case 'REJECTED': return <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"><XCircle className="h-3 w-3"/> Rechazado</span>;
      default: return <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20"><Clock className="h-3 w-3"/> Pendiente</span>;
    }
  };

  const getTypeLabel = (type: string) => {
    if (type === 'VACATION') return 'Vacaciones';
    if (type === 'SICK_LEAVE') return 'Permiso por Salud';
    if (type === 'SCHEDULE_SWAP') return 'Intercambio de Horario';
    return type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bandeja de Solicitudes</h1>
          <p className="text-sm text-slate-500 mt-1">Revisa y gestiona las peticiones de los empleados.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {requests.map((r) => (
          <div key={r.id} className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-6 flex flex-col sm:flex-row sm:items-center gap-6">
            
            <div className="flex items-center gap-4 sm:w-1/4 shrink-0">
              {r.author.avatarUrl ? (
                <img src={r.author.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover shadow-sm ring-2 ring-white" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shadow-sm ring-2 ring-white">
                  <User className="h-6 w-6" />
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-900 text-sm">{r.author.name}</p>
                <p className="text-xs text-slate-500">{r.author.department}</p>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-bold text-slate-900">{getTypeLabel(r.type)}</span>
                {getStatusBadge(r.status)}
              </div>
              <p className="text-sm text-slate-600">{r.description}</p>
              <p className="text-xs text-slate-400 mt-2">Enviado: {new Date(r.createdAt).toLocaleString()}</p>
            </div>

            {r.status === 'PENDING' && (
              <div className="flex gap-2 sm:flex-col sm:w-32 shrink-0">
                <form action={updateRequestStatus} className="flex-1">
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="APPROVED" />
                  <button type="submit" className="w-full inline-flex justify-center items-center gap-1 rounded-md bg-green-50 px-3 py-2 text-sm font-semibold text-green-700 shadow-sm hover:bg-green-100 ring-1 ring-inset ring-green-600/20">
                    <CheckCircle2 className="h-4 w-4" /> Aprobar
                  </button>
                </form>
                <form action={updateRequestStatus} className="flex-1">
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="REJECTED" />
                  <button type="submit" className="w-full inline-flex justify-center items-center gap-1 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100 ring-1 ring-inset ring-red-600/20">
                    <XCircle className="h-4 w-4" /> Rechazar
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}

        {requests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm ring-1 ring-slate-200 border-dashed">
            <Clock className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Bandeja vacía</h3>
            <p className="text-slate-500 mt-1">No hay solicitudes pendientes de revisión.</p>
          </div>
        )}
      </div>
    </div>
  );
}
