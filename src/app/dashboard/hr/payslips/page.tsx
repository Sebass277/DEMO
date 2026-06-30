import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Search, Plus, FileSpreadsheet } from 'lucide-react';

export default async function HRPayslips() {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;

  if (role !== 'HR_MANAGER' && role !== 'ADMIN') redirect('/');

  const payslips = await prisma.payslip.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestor de Boletas</h1>
        <button className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
          <Plus className="h-4 w-4" />
          Nueva Boleta
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por empleado..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Empleado</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Documento</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Periodo</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Fecha de Carga</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {payslips.map((payslip) => (
                <tr key={payslip.id} className="hover:bg-slate-50 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        {payslip.user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-slate-900">{payslip.user.name}</div>
                        <div className="text-slate-500">{payslip.user.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-indigo-500" />
                      {payslip.title}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                    {payslip.month}/{payslip.year}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                    {new Date(payslip.createdAt).toLocaleDateString()}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button className="text-indigo-600 hover:text-indigo-900 font-semibold">
                      Ver/Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payslips.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No hay boletas registradas en el sistema.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
