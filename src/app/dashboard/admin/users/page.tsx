import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { toggleUserStatus } from '@/actions/admin';
import { ShieldAlert, ShieldCheck, UserX, UserCheck } from 'lucide-react';

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  
  if (role !== 'ADMIN') redirect('/dashboard');

  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestión de Empleados</h1>
          <p className="text-sm text-slate-500 mt-1">Activa o deshabilita accesos al sistema.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Empleado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rol / Dpto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {u.avatarUrl ? (
                      <img className="h-10 w-10 rounded-full object-cover" src={u.avatarUrl} alt="" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        {u.name.charAt(0)}
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">{u.name}</div>
                      <div className="text-sm text-slate-500">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{u.role}</div>
                  <div className="text-sm text-slate-500">{u.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    u.isActive ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                  }`}>
                    {u.isActive ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                    {u.isActive ? 'Activo' : 'Desactivado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {u.role !== 'ADMIN' && (
                    <form action={toggleUserStatus}>
                      <input type="hidden" name="userId" value={u.id} />
                      <input type="hidden" name="currentStatus" value={u.isActive ? 'true' : 'false'} />
                      <button
                        type="submit"
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          u.isActive 
                            ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                            : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        {u.isActive ? (
                          <><UserX className="h-4 w-4" /> Deshabilitar</>
                        ) : (
                          <><UserCheck className="h-4 w-4" /> Reactivar</>
                        )}
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
