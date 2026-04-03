import { motion } from 'motion/react';
import { CheckCheck, Music, MessageSquare } from 'lucide-react';
import type { Person } from '@/app/components/FriendsContext';

export interface NoteItem {
  type: 'note' | 'song';
  text?: string;
  songTitle?: string;
  songArtist?: string;
  emoji?: string;
}

interface ChatItemProps {
  person: Person;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
  isFromMe: boolean;
  note: NoteItem | null;
  onClick: () => void;
}

function formatTime(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60_000) return 'сейчас';
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}м`;
  if (diff < 86400_000) {
    const d = new Date(ts);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  const d = new Date(ts);
  return `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function ChatItem({ person, lastMessage, lastMessageTime, unreadCount, isFromMe, note, onClick }: ChatItemProps) {
  const hasUnread = unreadCount > 0;

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-end gap-3 px-4 py-2.5 active:bg-white/[0.04] transition-colors text-left"
    >
      {/* Avatar + Note column */}
      <div className="relative flex flex-col items-center shrink-0" style={{ width: 52 }}>
        {/* Note bubble above avatar */}
        {note && (
          <div className="mb-1 max-w-[80px] bg-[#1a1a2e] border border-white/[0.10] rounded-2xl rounded-bl-sm px-2 py-1 flex items-center gap-1 min-w-0">
            {note.type === 'song' ? (
              <>
                <Music className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                <span className="text-[10px] text-white/80 truncate leading-tight">
                  {note.songTitle}
                </span>
              </>
            ) : (
              <>
                {note.emoji && <span className="text-[10px] shrink-0">{note.emoji}</span>}
                <span className="text-[10px] text-white/80 truncate leading-tight">
                  {note.text}
                </span>
              </>
            )}
          </div>
        )}

        {/* Avatar */}
        <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 bg-gradient-to-br ${person.avatarGradient || 'from-violet-500 to-pink-500'} relative`}>
          {person.avatarUrl ? (
            <img src={person.avatarUrl} alt={person.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span>{person.name.charAt(0).toUpperCase()}</span>
          )}
          {/* Online dot */}
          {person.status === 'online' && (
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-0.5">
        <div className="flex items-baseline justify-between mb-0.5">
          <span className={`text-[15px] font-semibold truncate ${hasUnread ? 'text-white' : 'text-gray-300'}`}>
            {person.name}
          </span>
          <span className={`text-[11px] ml-2 shrink-0 ${hasUnread ? 'text-cyan-400' : 'text-gray-600'}`}>
            {lastMessageTime ? formatTime(lastMessageTime) : ''}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[13px] truncate flex items-center gap-1 ${hasUnread ? 'text-gray-200' : 'text-gray-500'}`}>
            {isFromMe && <CheckCheck className="w-3.5 h-3.5 text-cyan-500 shrink-0" />}
            {lastMessage || <span className="text-gray-600 italic">Начни общение</span>}
          </span>
          {hasUnread && (
            <span className="w-5 h-5 rounded-full bg-cyan-500 text-black text-[10px] font-black flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.6)]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
