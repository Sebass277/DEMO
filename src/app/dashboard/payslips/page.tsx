import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { Banknote, Download } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function WorkerPayslips() {
  const cookieStore = await cookies();
  const email = cookieStore.get('auth_email')?.value;

  if (!email) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { email },
    include: { payslips: { orderBy: { createdAt: 'desc' } } }
  });

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Mis Boletas de Pago</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {user.payslips.map((payslip) => (
          <div key={payslip.id} className="relative flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
            <div className="flex items-center gap-x-4">
              <div className="rounded-lg bg-emerald-50 p-3 ring-1 ring-emerald-900/10">
                <Banknote className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{payslip.title}</h3>
                <p className="text-sm text-slate-500">Periodo: {payslip.month}/{payslip.year}</p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                Pagado
              </span>
              <button className="flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                <Download className="h-4 w-4" />
                Descargar PDF
              </button>
            </div>
          </div>
        ))}
        {user.payslips.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
            No tienes boletas de pago registradas.
          </div>
        )}
      </div>
    </div>
  );
}
