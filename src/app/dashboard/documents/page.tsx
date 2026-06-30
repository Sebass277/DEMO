import { prisma } from '@/lib/prisma';
import { FileText, Download, FileSpreadsheet, FileIcon, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default async function Documents() {
  const documents = await prisma.document.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  });

  const getFileIcon = (url: string) => {
    if (url.endsWith('.pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (url.endsWith('.xlsx')) return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    return <FileIcon className="h-8 w-8 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Repositorio de Documentos</h1>
        <button className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors">
          Subir Documento
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="group relative flex flex-col items-start justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-x-4">
              <div className="rounded-lg bg-slate-50 p-2 ring-1 ring-slate-900/5">
                {getFileIcon(doc.url)}
              </div>
              <div className="text-sm leading-6">
                <p className="font-semibold text-slate-900 line-clamp-1" title={doc.title}>
                  <a href={doc.url} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {doc.title}
                  </a>
                </p>
                <p className="text-slate-500 flex items-center gap-1 mt-1 text-xs">
                  <ShieldCheck className="h-3 w-3" /> Oficial
                </p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-x-3 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Subido por:</span> {doc.author.name}
            </div>
            <div className="mt-2 flex w-full justify-between border-t border-slate-100 pt-4">
              <time dateTime={doc.createdAt.toISOString()} className="text-xs text-slate-400">
                {format(doc.createdAt, "dd MMM yyyy", { locale: es })}
              </time>
              <Download className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
