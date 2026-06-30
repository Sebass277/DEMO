'use client';

import { useRef } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { sendMessage } from '@/actions/messages';

interface ChatFormProps {
  receiverId: number;
  receiverName: string;
}

export function ChatForm({ receiverId, receiverName }: ChatFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="p-4 bg-white border-t border-slate-100">
      <form 
        ref={formRef}
        action={async (formData) => {
          await sendMessage(formData);
          formRef.current?.reset(); // Limpia el input tras enviar
        }} 
        className="flex gap-4"
      >
        <input type="hidden" name="receiverId" value={receiverId} />
        <div className="flex-1 relative">
          <input
            type="text"
            name="content"
            required
            autoComplete="off"
            placeholder={`Escribe un mensaje para ${receiverName}...`}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 group">
            <input 
              type="text" 
              name="fileUrl" 
              autoComplete="off"
              placeholder="URL Archivo..." 
              className="hidden group-hover:block absolute right-8 -top-8 bg-white border border-slate-200 shadow-lg rounded-lg px-2 py-1 text-xs w-32 outline-none" 
            />
            <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>
          </div>
        </div>

        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 flex items-center justify-center transition-colors">
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
