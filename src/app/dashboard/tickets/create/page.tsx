import { createTicket } from '@/actions/tickets';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateTicketPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard/tickets" 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Nuevo Ticket</h1>
          <p className="text-sm text-slate-500 mt-1">
            Describe el problema o solicitud que necesitas que atendamos.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200">
        <form action={createTicket} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-slate-900">
                Asunto / Título
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  placeholder="Ej: Problemas con el correo, Solicitud de equipo..."
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-slate-900">
                Descripción detallada
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  required
                  placeholder="Por favor proporciona todos los detalles posibles..."
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-4 border-t border-slate-900/10 pt-6">
            <Link 
              href="/dashboard/tickets" 
              className="text-sm font-semibold leading-6 text-slate-900 hover:text-slate-700"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            >
              Enviar Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
