import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Newspaper, ChevronRight, HeartPulse } from 'lucide-react';

export default async function PublicHome() {
  const publicPosts = await prisma.post.findMany({
    where: { isPublic: true },
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex flex-col p-4 lg:p-6 text-slate-900">
      <div className="bg-[#F8F9FA] rounded-[2rem] w-full h-full flex-1 overflow-y-auto flex flex-col shadow-2xl ring-1 ring-white/10">
        
        {/* Header Público / Navbar (Mismo estilo que el Navbar interno) */}
        <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 bg-[#F8F9FA]/90 backdrop-blur-md px-4 sm:gap-x-6 sm:px-6 lg:px-10 pt-4">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center text-slate-900">
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
                <span className="text-xl font-black text-slate-900 tracking-tight leading-none">Prisma</span>
                <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Clínica Robles</span>
              </div>
            </div>
            <div className="flex items-center gap-x-4">
              <Link 
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-[#D9F971] px-6 py-2.5 text-sm font-bold text-slate-900 shadow-sm hover:bg-[#c4ec4d] hover:scale-105 transition-all"
              >
                Acceso Intranet
              </Link>
            </div>
          </div>
        </header>

        <main className="px-4 py-8 sm:px-8 lg:px-10 max-w-7xl mx-auto flex-1 w-full space-y-10">
          
          {/* 1. Hero Section (Estilo Widget Dashboard) */}
          <section className="relative overflow-hidden bg-white rounded-[2rem] p-10 sm:p-14 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-200 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAFCAE] text-[#8ba324] text-xs font-bold uppercase tracking-wide mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8ba324] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8ba324]"></span>
                </span>
                Portal Público
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
                Cuidando tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8ba324] to-emerald-500">Bienestar</span>
              </h1>
              <p className="mt-6 text-lg text-slate-500 font-medium max-w-xl">
                Conoce nuestras últimas noticias médicas, protocolos de salud y especialidades. Estamos aquí para brindarte la mejor atención.
              </p>
            </div>
            
            {/* Elemento Decorativo Estilo Dashboard */}
            <div className="hidden lg:flex shrink-0 relative w-72 h-72 items-center justify-center">
              <div className="absolute inset-0 bg-[#D9F971] rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute inset-4 bg-white rounded-full shadow-2xl ring-1 ring-slate-100 flex items-center justify-center">
                <HeartPulse className="h-32 w-32 text-[#8ba324] opacity-20" />
              </div>
            </div>
          </section>

          {/* 3. News Feed en 3 Columnas (Masonry Layout) */}
          <section>
            <div className="flex items-center gap-3 mb-8 px-2">
              <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
                <Newspaper className="h-5 w-5 text-indigo-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Muro de Noticias Públicas</h2>
            </div>
            
            {publicPosts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-200 border-dashed">
                <Newspaper className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">Aún no hay publicaciones disponibles.</p>
              </div>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {publicPosts.map((post) => (
                  <article key={post.id} className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 transition-shadow hover:shadow-md flex flex-col">
                    
                    {post.imageUrl && (
                      <div className="w-full bg-slate-50 border-b border-slate-100">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="w-full h-auto max-h-[800px] object-cover object-top" 
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center gap-x-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-[#EAFCAE] flex items-center justify-center text-[#8ba324] font-black text-sm shadow-sm">
                          {post.author.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-sm">{post.author.name}</h3>
                          <p className="text-xs text-slate-500 font-medium">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{post.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line mb-5">{post.content}</p>
                      
                      <button className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-[#D9F971] px-4 py-2 rounded-full transition-colors border border-slate-200 hover:border-[#c4ec4d]">
                        Leer más <ChevronRight className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

        </main>

        {/* Footer */}
        <footer className="mt-auto px-10 py-6 border-t border-slate-100">
          <div className="text-center text-sm font-semibold text-slate-400">
            &copy; {new Date().getFullYear()} Prisma by Clínica Robles. Todos los derechos reservados.
          </div>
        </footer>
      </div>
    </div>
  );
}
