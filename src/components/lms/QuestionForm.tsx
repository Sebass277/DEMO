'use client';

import { useState } from 'react';
import { addQuestion } from '@/actions/lms';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QuestionForm({ examId }: { examId: number }) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [options, setOptions] = useState([{ text: '', isCorrect: true }, { text: '', isCorrect: false }]);
  const [loading, setLoading] = useState(false);

  const handleAddOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleChangeOption = (index: number, val: string) => {
    const newOptions = [...options];
    newOptions[index].text = val;
    setOptions(newOptions);
  };

  const handleSetCorrect = (index: number) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index
    }));
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await addQuestion(examId, text, options);
    setText('');
    setOptions([{ text: '', isCorrect: true }, { text: '', isCorrect: false }]);
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-6 space-y-4">
      <h3 className="font-bold text-slate-900">Añadir Pregunta</h3>
      
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Enunciado de la pregunta</label>
        <input 
          type="text" 
          required 
          value={text} 
          onChange={e => setText(e.target.value)} 
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
          placeholder="Ej. ¿Qué hacer en caso de incendio?" 
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">Opciones (Marca la correcta)</label>
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={() => handleSetCorrect(i)}
              className={`p-2 rounded-lg transition-colors ${opt.isCorrect ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              <CheckCircle className="h-5 w-5" />
            </button>
            <input 
              type="text" 
              required 
              value={opt.text}
              onChange={e => handleChangeOption(i, e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder={`Opción ${i + 1}`} 
            />
            {options.length > 2 && (
              <button type="button" onClick={() => handleRemoveOption(i)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        
        <button type="button" onClick={handleAddOption} className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 mt-2 flex items-center gap-1">
          <Plus className="h-4 w-4" /> Añadir Opción
        </button>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button disabled={loading} type="submit" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-50">
          Guardar Pregunta
        </button>
      </div>
    </form>
  );
}
