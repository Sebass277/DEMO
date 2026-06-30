'use client';

import { useActionState, useState } from 'react';
import { createNewsPost } from '@/actions/news';
import { Plus, X } from 'lucide-react';

export default function CreateNewsForm({ users }: { users: { id: number, name: string, department: string | null }[] }) {
  const [state, formAction, isPending] = useActionState(createNewsPost, null);
  const [visibility, setVisibility] = useState('PUBLIC');
  const [allowReactions, setAllowReactions] = useState(true);
  
  const [hasPoll, setHasPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  const addOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removeOption = (index: number) => {
    if (pollOptions.length > 2) {
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  return (
    <form action={formAction} className="space-y-8 max-w-2xl">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Título de la Noticia</label>
          <input 
            name="title" 
            required 
            className="w-full rounded-xl border-0 py-3 px-4 text-slate-900 bg-slate-50 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-[#D9F971]"
            placeholder="Ej: Nuevo beneficio para empleados"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Contenido</label>
          <textarea 
            name="content" 
            required 
            rows={4}
            className="w-full rounded-xl border-0 py-3 px-4 text-slate-900 bg-slate-50 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-[#D9F971]"
            placeholder="Escribe el cuerpo de la noticia aquí..."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">URL de la Imagen (Opcional)</label>
            <input 
              name="imageUrl" 
              type="url"
              className="w-full rounded-xl border-0 py-3 px-4 text-slate-900 bg-slate-50 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-[#D9F971]"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Archivo Adjunto / Enlace Externo</label>
            <div className="space-y-3">
              <input 
                name="file" 
                type="file"
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p className="text-xs font-semibold text-center text-slate-400">O ingresa un enlace</p>
              <input 
                name="linkUrl" 
                type="url"
                className="w-full rounded-xl border-0 py-2.5 px-4 text-slate-900 bg-slate-50 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-[#D9F971] text-sm"
                placeholder="https://ejemplo.com/documento"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Visibilidad</label>
          <select 
            name="visibility" 
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full rounded-xl border-0 py-3 px-4 text-slate-900 bg-slate-50 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-[#D9F971]"
          >
            <option value="PUBLIC">Público (Visible en el portal exterior)</option>
            <option value="ALL_EMPLOYEES">Interno (Visible para todos los empleados)</option>
            <option value="SPECIFIC_USER">Empleado Específico</option>
          </select>
        </div>

        {visibility === 'SPECIFIC_USER' && (
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Seleccionar Empleado</label>
            <select 
              name="targetUserId" 
              required
              className="w-full rounded-xl border-0 py-3 px-4 text-slate-900 bg-slate-50 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-[#D9F971]"
            >
              <option value="">Selecciona un destinatario...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.department || 'Sin dpto'})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Permitir Reacciones</h3>
            <p className="text-xs text-slate-500">Los empleados podrán reaccionar con emojis al aviso.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="allowReactions" value="true" checked={allowReactions} onChange={(e) => setAllowReactions(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Añadir Encuesta Rápida</h3>
            <p className="text-xs text-slate-500">Crea un cuestionario sencillo de una pregunta.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="hasPoll" value="true" checked={hasPoll} onChange={(e) => setHasPoll(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {hasPoll && (
          <div className="bg-slate-50 p-6 rounded-2xl ring-1 ring-inset ring-slate-200 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Pregunta de la Encuesta</label>
              <input 
                name="pollQuestion" 
                required={hasPoll}
                className="w-full rounded-xl border-0 py-2.5 px-4 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#D9F971]"
                placeholder="Ej: ¿Asistirás al evento corporativo?"
              />
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-900">Opciones (Mínimo 2, Máximo 4)</label>
              {pollOptions.map((opt, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    value={opt}
                    onChange={(e) => updateOption(idx, e.target.value)}
                    required={hasPoll}
                    className="flex-1 rounded-xl border-0 py-2 px-4 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#D9F971]"
                    placeholder={`Opción ${idx + 1}`}
                  />
                  {pollOptions.length > 2 && (
                    <button type="button" onClick={() => removeOption(idx)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              {pollOptions.length < 4 && (
                <button type="button" onClick={addOption} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-2">
                  <Plus className="h-4 w-4" /> Añadir Opción
                </button>
              )}
            </div>
            {/* Hidden field to pass options to server action */}
            <input type="hidden" name="pollOptions" value={JSON.stringify(pollOptions)} />
          </div>
        )}
      </div>

      {state?.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm font-semibold">
          Noticia creada correctamente.
        </div>
      )}

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full rounded-xl bg-[#D9F971] px-4 py-4 text-sm font-bold text-slate-900 hover:scale-[1.01] transition-transform disabled:opacity-50"
      >
        {isPending ? 'Publicando...' : 'Publicar Aviso'}
      </button>
    </form>
  );
}
