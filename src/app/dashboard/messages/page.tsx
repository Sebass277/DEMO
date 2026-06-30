import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Paperclip, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { AutoRefresh } from '@/components/chat/AutoRefresh';
import { ChatForm } from '@/components/chat/ChatForm';

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ chatId?: string }> }) {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get('auth_id')?.value;
  
  if (!userIdStr) redirect('/login');
  const userId = parseInt(userIdStr);

  const resolvedParams = await searchParams;
  const currentChatId = resolvedParams.chatId ? parseInt(resolvedParams.chatId) : null;

  // Obtener usuarios para el directorio izquierdo (excluyendo a mí mismo)
  const users = await prisma.user.findMany({
    where: { id: { not: userId } },
    orderBy: { name: 'asc' }
  });

  // Si hay un chat seleccionado, obtener sus mensajes
  let messages: any[] = [];
  let currentChatUser = null;

  if (currentChatId) {
    currentChatUser = users.find(u => u.id === currentChatId);
    
    // Marcar como leídos los mensajes que me enviaron en este chat
    await prisma.message.updateMany({
      where: {
        senderId: currentChatId,
        receiverId: userId,
        isRead: false
      },
      data: { isRead: true }
    });

    messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: currentChatId },
          { senderId: currentChatId, receiverId: userId }
        ]
      },
      include: {
        sender: true,
        receiver: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Panel Izquierdo: Lista de Usuarios para enviar */}
      <div className="w-80 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden flex flex-col hidden lg:flex">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-semibold text-slate-900">Directorio de Chat</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {users.map(u => {
            const isActive = u.id === currentChatId;
            return (
              <Link 
                href={`/dashboard/messages?chatId=${u.id}`} 
                key={u.id} 
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-slate-50 cursor-pointer'}`}
              >
                {u.avatarUrl ? (
                  <img src={u.avatarUrl} alt={u.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
                ) : (
                  <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold ring-2 ring-white shadow-sm">
                    {u.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className={`font-semibold text-sm ${isActive ? 'text-indigo-900' : 'text-slate-900'}`}>{u.name}</p>
                  <p className={`text-xs ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>{u.department}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Panel Derecho: Chat y Envío */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden flex flex-col">
        {currentChatUser ? (
          <>
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              {currentChatUser.avatarUrl ? (
                <img src={currentChatUser.avatarUrl} alt={currentChatUser.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
              ) : (
                <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                  {currentChatUser.name.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="font-semibold text-slate-900">{currentChatUser.name}</h2>
                <p className="text-xs text-slate-500">{currentChatUser.role} • {currentChatUser.department}</p>
              </div>
            </div>

            {/* Historial de Mensajes */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 flex flex-col">
              {messages.map((msg) => {
                const isMe = msg.senderId === userId;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      {msg.sender.avatarUrl ? (
                        <img src={msg.sender.avatarUrl} alt={msg.sender.name} className="h-8 w-8 rounded-full object-cover shrink-0 shadow-sm" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0 shadow-sm">
                          {msg.sender.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className={`text-xs text-slate-400 mb-1 px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                          {isMe ? 'Tú' : msg.sender.name} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        <div className={`rounded-2xl px-4 py-2 shadow-sm ${
                          isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-900 ring-1 ring-slate-200 rounded-bl-none'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          {msg.fileUrl && (
                            <a href={msg.fileUrl} target="_blank" rel="noreferrer" className={`mt-2 flex items-center gap-1 text-xs font-semibold hover:underline ${isMe ? 'text-indigo-200' : 'text-indigo-600'}`}>
                              <Paperclip className="h-3 w-3" />
                              Archivo Adjunto
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {messages.length === 0 && (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  Aún no hay mensajes con {currentChatUser.name}. ¡Inicia una conversación!
                </div>
              )}
            </div>

            {/* Formulario de Envío Extraído a Client Component */}
            <ChatForm receiverId={currentChatUser.id} receiverName={currentChatUser.name} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 ring-4 ring-white shadow-sm">
              <MessageSquare className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-600">Tus Mensajes</h3>
            <p className="text-sm mt-1">Selecciona un compañero en el panel izquierdo para chatear.</p>
          </div>
        )}
      </div>
    </div>
  );
}
