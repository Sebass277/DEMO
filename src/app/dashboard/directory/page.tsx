import { prisma } from '@/lib/prisma';
import { Mail, Phone, Building2 } from 'lucide-react';

export default async function Directory() {
  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Directorio de Empleados</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="col-span-1 flex flex-col divide-y divide-slate-200 rounded-xl bg-white text-center shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-1 flex-col p-8">
              {user.avatarUrl ? (
                <img className="mx-auto h-24 w-24 flex-shrink-0 rounded-full object-cover ring-4 ring-indigo-50 shadow-md" src={user.avatarUrl} alt={user.name} />
              ) : (
                <div className="mx-auto h-24 w-24 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold ring-4 ring-indigo-50 shadow-md">
                  {user.name.charAt(0)}
                </div>
              )}
              <h3 className="mt-6 text-sm font-medium text-slate-900">{user.name}</h3>
              <dl className="mt-1 flex flex-grow flex-col justify-between">
                <dt className="sr-only">Title</dt>
                <dd className="text-sm text-slate-500">{user.role}</dd>
                <dt className="sr-only">Role</dt>
                <dd className="mt-3">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {user.department}
                  </span>
                </dd>
              </dl>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-slate-200">
                <div className="flex w-0 flex-1">
                  <a
                    href={`mailto:${user.email}`}
                    className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                  >
                    <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    Email
                  </a>
                </div>
                <div className="-ml-px flex w-0 flex-1">
                  <button className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                    <Building2 className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    Oficina
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
