'use client';

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ExternalLink, ThumbsUp, Heart, Smile } from 'lucide-react';
import { toggleReaction, votePoll } from '@/actions/news';
import { useTransition } from 'react';

type PostProps = {
  post: any;
  currentUserId: number;
};

export default function PostItem({ post, currentUserId }: PostProps) {
  const [isPending, startTransition] = useTransition();

  const handleReaction = (type: string) => {
    startTransition(() => {
      toggleReaction(post.id, type);
    });
  };

  const handleVote = (optionId: number) => {
    if (post.poll.votes?.some((v: any) => v.userId === currentUserId)) return; // already voted
    startTransition(() => {
      votePoll(optionId, post.poll.id);
    });
  };

  // Reactions calculation
  const reactionCounts = post.reactions?.reduce((acc: any, r: any) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {}) || {};

  const userReaction = post.reactions?.find((r: any) => r.userId === currentUserId)?.type;

  // Poll calculation
  const hasVoted = post.poll?.votes?.some((v: any) => v.userId === currentUserId);
  const totalVotes = post.poll?.votes?.length || 0;

  return (
    <article className="relative flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-x-4">
        <div className="h-10 w-10 flex-none rounded-full bg-[#D9F971] flex items-center justify-center font-bold text-slate-900 text-sm shadow-sm">
          {post.author.name.charAt(0)}
        </div>
        <div className="text-sm leading-6">
          <p className="font-semibold text-slate-900">
            {post.author.name}
          </p>
          <p className="text-slate-500">
            {post.author.role} • {post.author.department} •{' '}
            {formatDistanceToNow(post.createdAt, { addSuffix: true, locale: es })}
          </p>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {post.title}
        </h3>
        <p className="text-sm leading-6 text-slate-700 whitespace-pre-line mb-4">
          {post.content}
        </p>

        {post.linkUrl && (
          <a 
            href={post.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition-colors mb-4 text-sm"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir Enlace Adjunto
          </a>
        )}

        {post.imageUrl && (
          <div className="rounded-2xl overflow-hidden shadow-sm ring-1 ring-slate-200 mb-4 bg-slate-100">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-auto max-h-[800px] object-cover object-top" 
            />
          </div>
        )}

        {post.poll && (
          <div className="bg-slate-50 rounded-2xl p-5 mb-4 ring-1 ring-slate-200">
            <h4 className="font-bold text-slate-900 mb-4 text-lg">📊 {post.poll.question}</h4>
            <div className="space-y-3">
              {post.poll.options.map((opt: any) => {
                const optVotes = post.poll.votes?.filter((v: any) => v.pollOptionId === opt.id).length || 0;
                const percentage = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
                const isSelected = post.poll.votes?.some((v: any) => v.userId === currentUserId && v.pollOptionId === opt.id);

                return (
                  <div key={opt.id} className="relative">
                    {hasVoted ? (
                      <div className="relative overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 p-3">
                        <div 
                          className="absolute inset-y-0 left-0 bg-[#D9F971]/30 transition-all duration-1000" 
                          style={{ width: `${percentage}%` }}
                        />
                        <div className="relative flex justify-between text-sm font-semibold text-slate-900">
                          <span className="flex items-center gap-2">
                            {opt.text} {isSelected && '✅'}
                          </span>
                          <span>{percentage}% ({optVotes})</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleVote(opt.id)}
                        disabled={isPending}
                        className="w-full text-left rounded-xl bg-white hover:bg-slate-100 ring-1 ring-slate-200 p-3 text-sm font-semibold text-slate-700 transition-colors"
                      >
                        {opt.text}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 mt-4 text-right">{totalVotes} votos totales</p>
          </div>
        )}
      </div>

      {post.allowReactions && (
        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 mt-2">
          <button 
            onClick={() => handleReaction('LIKE')}
            disabled={isPending}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${userReaction === 'LIKE' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 ring-1 ring-slate-200'}`}
          >
            <ThumbsUp className="h-4 w-4" /> 
            {reactionCounts['LIKE'] || 0}
          </button>
          
          <button 
            onClick={() => handleReaction('HEART')}
            disabled={isPending}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${userReaction === 'HEART' ? 'bg-red-100 text-red-600 ring-1 ring-red-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 ring-1 ring-slate-200'}`}
          >
            <Heart className="h-4 w-4" /> 
            {reactionCounts['HEART'] || 0}
          </button>

          <button 
            onClick={() => handleReaction('SMILE')}
            disabled={isPending}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${userReaction === 'SMILE' ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 ring-1 ring-slate-200'}`}
          >
            <Smile className="h-4 w-4" /> 
            {reactionCounts['SMILE'] || 0}
          </button>
        </div>
      )}
    </article>
  );
}
