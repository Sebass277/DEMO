'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  LogOut,
  GraduationCap,
  Banknote,
  LineChart,
  MessageSquare,
  Newspaper,
  X
} from 'lucide-react';

interface SidebarProps {
  role: string;
  email: string;
}

export function Sidebar({ role, email }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-mobile-menu', handleToggle);
    return () => window.removeEventListener('toggle-mobile-menu', handleToggle);
  }, []);

  const getNavigation = (role: string) => {
    const baseNav = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Directorio', href: '/dashboard/directory', icon: Users },
      { name: 'Documentos', href: '/dashboard/documents', icon: FileText },
      { name: 'Mensajes', href: '/dashboard/messages', icon: MessageSquare },
    ];

    if (role === 'WORKER') {
      baseNav.push({ name: 'Plataforma de Capacitación', href: '/dashboard/lms', icon: GraduationCap });
      baseNav.push({ name: 'Mis Boletas', href: '/dashboard/payslips', icon: Banknote });
      baseNav.push({ name: 'Mis Permisos', href: '/dashboard/worker/requests', icon: FileText });
    } else if (role === 'ADMIN') {
      baseNav.push({ name: 'Panel Admin', href: '/dashboard/admin', icon: LineChart });
      baseNav.push({ name: 'Empleados', href: '/dashboard/admin/users', icon: Users });
    } else if (role === 'HR_MANAGER') {
      baseNav.push({ name: 'Gestor de Boletas', href: '/dashboard/hr/payslips', icon: Banknote });
      baseNav.push({ name: 'Bandeja Permisos', href: '/dashboard/hr/requests', icon: FileText });
    } else if (role === 'LMS_MANAGER') {
      baseNav.push({ name: 'Plataforma de Capacitación', href: '/dashboard/lms/manager', icon: GraduationCap });
    }

    if (role !== 'WORKER') {
      baseNav.push({ name: 'Crear Avisos', href: '/dashboard/admin/news', icon: Newspaper });
    }

    return baseNav;
  };

  const navigation = getNavigation(role);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      document.cookie = 'auth_role=; path=/; max-age=0;';
      document.cookie = 'auth_email=; path=/; max-age=0;';
      document.cookie = 'auth_id=; path=/; max-age=0;';
      window.location.href = '/login';
    }
  };

  const SidebarContent = () => (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#1A1A1A] px-6 pb-4 pt-6 h-full">
      <div className="flex h-16 shrink-0 items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center text-slate-900">
            <svg viewBox="0 0 512 512" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <rect x="32" y="32" width="448" height="448" rx="120" fill="#D9F971" />
              <g stroke="#0f172a" strokeWidth="80" strokeLinecap="butt">
                <line x1="256" y1="120" x2="256" y2="392" />
                <line x1="120" y1="256" x2="392" y2="256" />
                <line x1="160" y1="160" x2="352" y2="352" />
                <line x1="160" y1="352" x2="352" y2="160" />
              </g>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white tracking-tight leading-none">Prisma</span>
            <span className="text-[10px] font-bold text-[#D9F971]/70 mt-1 uppercase tracking-wider">Clínica Robles</span>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        group flex items-center gap-x-4 rounded-2xl p-3 text-sm leading-6 font-bold transition-all duration-200
                        ${isActive 
                          ? 'bg-[#D9F971] text-slate-900 shadow-[0_4px_20px_-4px_rgba(217,249,113,0.4)] translate-x-2' 
                          : 'bg-[#2A2A2A] text-slate-300 hover:text-white hover:bg-[#3A3A3A] hover:translate-x-1 shadow-sm'
                        }
                      `}
                    >
                      <item.icon
                        className={`h-5 w-5 shrink-0 ${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-white'}`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          <li className="mt-auto">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full group flex items-center gap-x-4 rounded-2xl bg-[#2A2A2A] p-3 text-sm font-bold leading-6 text-slate-300 hover:bg-[#ff5f5f] hover:text-white transition-all duration-200 shadow-sm"
            >
              <LogOut className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-white" aria-hidden="true" />
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
          <div className="relative flex w-72 flex-col bg-[#1A1A1A] shadow-2xl transition-transform">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
