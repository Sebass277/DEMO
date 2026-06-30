import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createRequest } from '@/actions/requests';
import { Clock, Calendar, CheckCircle2, XCircle } from 'lucide-react';

export default async function WorkerRequestsPage() {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get('auth_id')?.value;
  
  if (!userIdStr) redirect('/login');
  const userId = parseInt(userIdStr);

  const requests = await prisma.employeeRequest.findMany({
    where: { authorId: userId },
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Mis Solicitudes</h1>
        <p className="text-sm text-slate-500 mt-1">Gestiona tus permisos y vacaciones con Recursos Humanos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulario */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Nueva Solicitud
            </h2>
            <form action={createRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Solicitud</label>
                <select name="type" required className="w-full rounded-lg border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm">
                  <option value="">Seleccionar...</option>
                  <option value="VACATION">Vacaciones</option>
                  <option value="SICK_LEAVE">Permiso de Salud</option>
                  <option value="SCHEDULE_SWAP">Intercambio de Horario</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción / Motivo</label>
                <textarea name="description" required rows={4} className="w-full rounded-lg border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" placeholder="Detalla las fechas o el motivo de tu solicitud..."></textarea>
              </div>
              <button type="submit" className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Enviar a RRHH
              </button>
            </form>
          </div>
        </div>

        {/* Historial */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Detalle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {getTypeLabel(r.type)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <p className="line-clamp-2 max-w-xs">{r.description}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(r.status)}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                      No has realizado ninguna solicitud aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
