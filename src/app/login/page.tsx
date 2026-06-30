'use client';

import { login } from '@/actions/auth';
import { Building2, Lock, Mail } from 'lucide-react';
import { useActionState, useEffect } from 'react';

// Wrap the action to match the signature expected by useActionState
async function loginAction(prevState: any, formData: FormData) {
  return await login(formData);
}

export default function Login() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D9F971] shadow-[0_4px_20px_-4px_rgba(217,249,113,0.4)]">
            <Building2 className="h-8 w-8 text-slate-900" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-4xl font-black tracking-tight text-white">
          Clínica Robles
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-slate-400">
          Ingresa tus credenciales para acceder a la Intranet
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow-2xl sm:rounded-[2rem] sm:px-10">
          
          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
                Correo Electrónico
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  defaultValue="admin@empresa.com"
                  className="block w-full rounded-xl border-0 py-2.5 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#D9F971] sm:text-sm sm:leading-6 font-medium bg-slate-50"
                  placeholder="usuario@empresa.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-900">
                Contraseña
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  defaultValue="password123"
                  className="block w-full rounded-xl border-0 py-2.5 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#D9F971] sm:text-sm sm:leading-6 font-medium bg-slate-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {state?.error && (
              <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg ring-1 ring-red-200">
                {state.error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full justify-center rounded-xl bg-[#D9F971] px-3 py-3 text-sm font-bold leading-6 text-slate-900 shadow-sm hover:bg-[#c4ec4d] hover:scale-[1.02] transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9F971] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            <p><strong>Cuentas de Prueba:</strong></p>
            <ul className="mt-1 space-y-1">
              <li>Admin: admin@empresa.com</li>
              <li>Sistemas: it@empresa.com</li>
              <li>RRHH: hr@empresa.com</li>
              <li>Capacitación: lms@empresa.com</li>
              <li>Trabajador: juan@empresa.com</li>
              <li>(Clave para todos: <code>password123</code>)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
