'use client';

import { Bell, Search, Menu } from 'lucide-react';

import Link from 'next/link';

interface NavbarProps {
  role: string;
  email: string;
  avatarUrl?: string | null;
  unreadCount?: number;
}

export function Navbar({ role, email, avatarUrl, unreadCount = 0 }: NavbarProps) {
  const getRoleName = (r: string) => {
    if (r === 'ADMIN') return 'Administrador';
    if (r === 'HR') return 'Recursos Humanos';
    return 'Trabajador';
  };

  return (
    <div className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 bg-transparent px-4 sm:gap-x-6 sm:px-6 lg:px-10 pt-4">
      <button 
        type="button" 
        className="-m-2.5 p-2.5 text-slate-700 lg:hidden"
        onClick={() => window.dispatchEvent(new Event('toggle-mobile-menu'))}
      >
        <span className="sr-only">Abrir sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-slate-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1 max-w-md" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Buscar
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-4 h-full w-5 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-12 w-full rounded-full border-0 py-0 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] focus:ring-2 focus:ring-[#D9F971] sm:text-sm font-medium transition-all"
            placeholder="Buscar empleados, documentos..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Link href="/dashboard/messages" className="relative p-2.5 text-slate-400 hover:text-slate-700 bg-white rounded-full shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] transition-transform hover:scale-105">
            <span className="sr-only">Ver notificaciones</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff5f5f] text-[10px] font-black text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* Separator */}
          <div className="hidden lg:block lg:h-8 lg:w-px lg:bg-slate-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative">
            <button className="flex items-center gap-3 p-1.5 hover:bg-white/60 rounded-full transition-colors pr-4" id="user-menu-button">
              <span className="sr-only">Abrir menú de usuario</span>
              {avatarUrl ? (
                <img
                  className="h-10 w-10 rounded-full object-cover shadow-sm"
                  src={avatarUrl}
                  alt={email}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-[#EAFCAE] flex items-center justify-center font-bold text-[#8ba324] text-sm shadow-sm">
                  {email.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden lg:flex lg:flex-col lg:items-start">
                <span className="text-sm font-bold leading-5 text-slate-900" aria-hidden="true">
                  {email.split('@')[0]}
                </span>
                <span className="text-[11px] leading-4 text-slate-500 font-bold uppercase tracking-wider">
                  {getRoleName(role)}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
