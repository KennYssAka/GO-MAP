import { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft, Send, Search, Phone, Video, MoreVertical,
  Check, CheckCheck, X, MessageCircle, Music, Pencil,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from './UserContext';
import { useFriends, type Person } from './FriendsContext';
import { useTheme } from './ThemeContext';

/* ─── Types ─── */

interface LocalMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  read: boolean;
}

interface ChatData {
  personId: string;
  messages: LocalMessage[];
  lastMessageTime: number;
}

// Instagram Notes: simple text note displayed above avatar
export interface Note {
  personId: string;
  text: string;
  emoji?: string;
  songTitle?: string;    // optional, for future
  songArtist?: string;   // optional, for future
  isSong: boolean;
  timestamp: number;
}

/* ─── Notes: static mock data (no status system) ─── */

const MOCK_NOTES: Record<string, Note> = {
  p1: { personId: 'p1', text: 'Narkotik Kal 🔥', emoji: '🎧', isSong: true, songTitle: 'Narkotik Kal', songArtist: 'Hard Bass School', timestamp: Date.now() - 3_600_000 },
  p3: { personId: 'p3', text: 'Рисую мурал на Тулебаева!', emoji: '🎨', isSong: false, timestamp: Date.now() - 7_200_000 },
  p5: { personId: 'p5', text: 'Shopping day!', emoji: '🛍️', isSong: false, timestamp: Date.now() - 1_800_000 },
  p6: { personId: 'p6', text: 'Take Five 🎶', emoji: '🎷', isSong: true, songTitle: 'Take Five', songArtist: 'Dave Brubeck', timestamp: Date.now() - 5_400_000 },
  p4: { personId: 'p4', text: '10 км за 48 мин!', emoji: '🏃', isSong: false, timestamp: Date.now() - 9_000_000 },
};

const NOTE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

function isNoteActive(note: Note): boolean {
  return Date.now() - note.timestamp < NOTE_EXPIRY_MS;
}

/* ─── Storage helpers ─── */

function loadChats(): Record<string, ChatData> {
  try {
    const stored = localStorage.getItem('app_chats');
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

function saveChats(chats: Record<string, ChatData>) {
  localStorage.setItem('app_chats', JSON.stringify(chats));
}

function loadMyNote(): Note | null {
  try {
    const s = localStorage.getItem('my_note');
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

function saveMyNote(n: Note | null) {
  if (n) localStorage.setItem('my_note', JSON.stringify(n));
  else localStorage.removeItem('my_note');
}

/* ─── Auto-replies ─── */

const AUTO_REPLIES_DEFAULT = [
  'Привет! 👋', 'О, круто! 😄', 'Да, давай! 🔥',
  'Напиши позже, я занят(а) 😊', 'Интересно, расскажи!',
  'Ахаха 😂', 'Окей, договорились 👍',
];

const AUTO_REPLIES_GREETING = [
  'Привет! Рада знакомству! 😊', 'Хей! Как дела? 👋',
  'Привет! 🙌', 'О, привет!',
];

const AUTO_REPLIES_QUESTION = [
  'Хмм, надо подумать 🤔', 'Да, конечно! А ты?',
  'Не уверен(а), давай обсудим?', 'О, хороший вопрос!',
];

function getAutoReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.match(/привет|здравствуй|хей|йо/)) {
    return AUTO_REPLIES_GREETING[Math.floor(Math.random() * AUTO_REPLIES_GREETING.length)];
  }
  if (lower.includes('?')) {
    return AUTO_REPLIES_QUESTION[Math.floor(Math.random() * AUTO_REPLIES_QUESTION.length)];
  }
  return AUTO_REPLIES_DEFAULT[Math.floor(Math.random() * AUTO_REPLIES_DEFAULT.length)];
}

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return 'сейчас';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}м`;
  const d = new Date(ts);
  if (diff < 86_400_000) return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/* ─── Props ─── */

interface MessagesScreenProps {
  initialChatPerson?: Person | null;
  onClearInitialChat?: () => void;
}

/* ─── Component ─── */

export function MessagesScreen({ initialChatPerson, onClearInitialChat }: MessagesScreenProps) {
  const { user } = useUser();
  const { friends } = useFriends();
  const { getBubbleRadius, getFontSize } = useTheme();

  const [chats, setChats] = useState<Record<string, ChatData>>(loadChats);
  const [activeChatPersonId, setActiveChatPersonId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typing, setTyping] = useState(false);

  // My own note
  const [myNote, setMyNote] = useState<Note | null>(loadMyNote);
  const [showNoteCompose, setShowNoteCompose] = useState(false);
  const [noteText, setNoteText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  /* ── Note publish/clear ── */
  const publishNote = () => {
    if (!noteText.trim() || !user) return;
    const note: Note = {
      personId: 'me',
      text: noteText.trim(),
      isSong: false,
      timestamp: Date.now(),
    };
    setMyNote(note);
    saveMyNote(note);
    setNoteText('');
    setShowNoteCompose(false);
  };

  const clearMyNote = () => {
    setMyNote(null);
    saveMyNote(null);
  };

  /* ── Initial chat ── */
  useEffect(() => {
    if (initialChatPerson) {
      openChatWith(initialChatPerson.id);
      onClearInitialChat?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialChatPerson]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChatPersonId]);

  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  const openChatWith = (personId: string) => {
    setActiveChatPersonId(personId);
    setChats(prev => {
      if (!prev[personId]) {
        return { ...prev, [personId]: { personId, messages: [], lastMessageTime: Date.now() } };
      }
      const chat = prev[personId];
      return {
        ...prev,
        [personId]: {
          ...chat,
          messages: chat.messages.map(m => ({ ...m, read: true })),
        },
      };
    });
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const sendMessage = () => {
    if (!messageText.trim() || !activeChatPersonId || !user) return;

    const newMsg: LocalMessage = {
      id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      senderId: user.id,
      text: messageText.trim(),
      timestamp: Date.now(),
      read: false,
    };

    setChats(prev => {
      const chat = prev[activeChatPersonId] || { personId: activeChatPersonId, messages: [], lastMessageTime: 0 };
      return {
        ...prev,
        [activeChatPersonId]: {
          ...chat,
          messages: [...chat.messages, newMsg],
          lastMessageTime: Date.now(),
        },
      };
    });

    setMessageText('');

    // Auto-reply
    setTyping(true);
    const delay = 800 + Math.random() * 1200;
    const replyText = getAutoReply(newMsg.text);
    setTimeout(() => {
      setTyping(false);
      const reply: LocalMessage = {
        id: `m_${Date.now()}_reply`,
        senderId: activeChatPersonId,
        text: replyText,
        timestamp: Date.now(),
        read: true,
      };
      setChats(prev => {
        const chat = prev[activeChatPersonId];
        if (!chat) return prev;
        return {
          ...prev,
          [activeChatPersonId]: {
            ...chat,
            messages: [...chat.messages, reply],
            lastMessageTime: Date.now(),
          },
        };
      });
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  /* ── Sorted chat list (by most recent message) ── */
  const sortedFriends = useMemo(() => {
    return [...friends].sort((a, b) => {
      const ta = chats[a.id]?.lastMessageTime ?? 0;
      const tb = chats[b.id]?.lastMessageTime ?? 0;
      return tb - ta;
    });
  }, [friends, chats]);

  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return sortedFriends;
    const q = searchQuery.toLowerCase();
    return sortedFriends.filter(p =>
      p.name.toLowerCase().includes(q) || p.bio?.toLowerCase().includes(q)
    );
  }, [sortedFriends, searchQuery]);

  const activePerson = activeChatPersonId ? friends.find(f => f.id === activeChatPersonId) : null;
  const activeChat = activeChatPersonId ? chats[activeChatPersonId] : null;

  /* ── Active chat view ── */
  if (activePerson) {
    const messages = activeChat?.messages ?? [];

    return (
      <div className="flex-1 flex flex-col bg-black overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 pt-12 pb-3 border-b border-white/[0.06] bg-black shrink-0">
          <button onClick={() => setActiveChatPersonId(null)} className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${activePerson.avatarGradient || 'from-violet-500 to-pink-500'} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
            {activePerson.avatarUrl
              ? <img src={activePerson.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
              : activePerson.name.charAt(0).toUpperCase()
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-[15px] truncate">{activePerson.name}</p>
            <p className="text-gray-500 text-[11px]">
              {typing ? 'печатает...' : activePerson.status === 'online' ? 'онлайн' : 'был(а) недавно'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center">
              <Phone className="w-4.5 h-4.5 text-gray-400" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center">
              <Video className="w-4.5 h-4.5 text-gray-400" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center">
              <MoreVertical className="w-4.5 h-4.5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${activePerson.avatarGradient || 'from-violet-500 to-pink-500'} flex items-center justify-center text-white text-2xl font-bold`}>
                {activePerson.name.charAt(0)}
              </div>
              <p className="text-white font-semibold">{activePerson.name}</p>
              <p className="text-gray-500 text-sm">Начни разговор! 👋</p>
            </div>
          )}

          {messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[14px] leading-snug ${
                    isMe
                      ? 'bg-violet-600 text-white rounded-br-md'
                      : 'bg-white/[0.07] text-white rounded-bl-md'
                  }`}
                  style={{
                    borderRadius: getBubbleRadius(),
                    fontSize: getFontSize(),
                  }}
                >
                  {msg.text}
                  <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] opacity-50">{formatTime(msg.timestamp)}</span>
                    {isMe && (
                      <CheckCheck className="w-3 h-3 opacity-50" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-white/[0.07] rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-gray-400"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 px-4 py-3 border-t border-white/[0.06] bg-black flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Сообщение..."
            className="flex-1 bg-white/[0.07] border border-white/[0.08] rounded-2xl px-4 py-2.5 text-white text-[14px] placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={!messageText.trim()}
            className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shadow-[0_0_12px_rgba(139,92,246,0.4)]"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    );
  }

  /* ── Chat list view ── */
  return (
    <div className="flex-1 flex flex-col bg-black overflow-hidden">

      {/* ── Header ── */}
      <div className="shrink-0 px-4 pt-12 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white font-black text-2xl">Сообщения</h1>
          <button
            onClick={() => setShowNoteCompose(true)}
            className="w-8 h-8 rounded-full bg-white/[0.07] flex items-center justify-center"
          >
            <Pencil className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Sticky search */}
        <div className="flex items-center gap-2 bg-white/[0.07] border border-white/[0.06] rounded-xl px-3 py-2.5 mb-3">
          <Search className="w-4 h-4 text-gray-500 shrink-0" />
          <input
            ref={searchRef}
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Поиск..."
            className="flex-1 bg-transparent text-white text-[14px] placeholder-gray-600 outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}>
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* ── Notes row (my note + friends with active notes) ── */}
      {!searchQuery && (
        <div className="shrink-0 flex gap-4 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {/* My note */}
          <div className="flex flex-col items-center shrink-0 gap-1" style={{ width: 56 }}>
            <button
              onClick={() => setShowNoteCompose(true)}
              className="relative"
            >
              {myNote && isNoteActive(myNote) && (
                <div className="mb-1 bg-[#1a1a2e] border border-white/[0.12] rounded-2xl rounded-bl-sm px-2 py-1 max-w-[72px]">
                  <p className="text-[10px] text-white/80 truncate leading-tight">{myNote.text}</p>
                </div>
              )}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg border-2 border-black">
                {user?.avatarInitial ?? '?'}
              </div>
              {!myNote && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-violet-500 rounded-full border-2 border-black flex items-center justify-center">
                  <span className="text-white text-xs leading-none">+</span>
                </div>
              )}
            </button>
            <span className="text-gray-500 text-[10px]">Ты</span>
          </div>

          {/* Friends with active notes */}
          {friends
            .filter(f => {
              const note = MOCK_NOTES[f.id];
              return note && isNoteActive(note);
            })
            .slice(0, 8)
            .map(f => {
              const note = MOCK_NOTES[f.id]!;
              return (
                <button
                  key={f.id}
                  onClick={() => openChatWith(f.id)}
                  className="flex flex-col items-center shrink-0 gap-1"
                  style={{ width: 56 }}
                >
                  <div className="mb-1 bg-[#1a1a2e] border border-white/[0.12] rounded-2xl rounded-bl-sm px-2 py-1 max-w-[72px] flex items-center gap-1">
                    {note.isSong && <Music className="w-2.5 h-2.5 text-cyan-400 shrink-0" />}
                    {note.emoji && !note.isSong && <span className="text-[9px] shrink-0">{note.emoji}</span>}
                    <p className="text-[10px] text-white/80 truncate leading-tight">{note.text}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${f.avatarGradient || 'from-violet-500 to-pink-500'} flex items-center justify-center text-white font-bold text-lg border-2 border-black`}>
                    {f.name.charAt(0)}
                  </div>
                  <span className="text-gray-500 text-[10px] truncate w-full text-center">{f.name.split(' ')[0]}</span>
                </button>
              );
            })}
        </div>
      )}

      {/* ── Divider ── */}
      {!searchQuery && <div className="h-px bg-white/[0.06] mx-4 mb-2" />}

      {/* ── Chat list ── */}
      <div className="flex-1 overflow-y-auto">
        {filteredFriends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <MessageCircle className="w-10 h-10 text-gray-700" />
            <p className="text-gray-600 text-sm">
              {searchQuery ? 'Никого не найдено' : 'Добавь друзей, чтобы начать общение'}
            </p>
          </div>
        ) : (
          filteredFriends.map((person) => {
            const chat = chats[person.id];
            const messages = chat?.messages ?? [];
            const lastMsg = messages[messages.length - 1];
            const unreadCount = messages.filter(m => !m.read && m.senderId !== user?.id).length;
            const note = MOCK_NOTES[person.id];
            const activeNote = note && isNoteActive(note) ? note : null;

            return (
              <button
                key={person.id}
                onClick={() => openChatWith(person.id)}
                className="w-full flex items-end gap-3 px-4 py-2.5 active:bg-white/[0.04] transition-colors text-left"
              >
                {/* Avatar + Note */}
                <div className="relative flex flex-col items-center shrink-0" style={{ width: 52 }}>
                  {activeNote && (
                    <div className="mb-1 max-w-[80px] bg-[#1a1a2e] border border-white/[0.10] rounded-2xl rounded-bl-sm px-2 py-1 flex items-center gap-1">
                      {activeNote.isSong && <Music className="w-2.5 h-2.5 text-cyan-400 shrink-0" />}
                      {activeNote.emoji && !activeNote.isSong && <span className="text-[9px] shrink-0">{activeNote.emoji}</span>}
                      <span className="text-[10px] text-white/80 truncate leading-tight">{activeNote.text}</span>
                    </div>
                  )}
                  <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 bg-gradient-to-br ${person.avatarGradient || 'from-violet-500 to-pink-500'} relative`}>
                    {person.avatarUrl
                      ? <img src={person.avatarUrl} alt={person.name} className="w-full h-full rounded-full object-cover" />
                      : person.name.charAt(0).toUpperCase()
                    }
                    {person.status === 'online' && (
                      <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-0.5">
                  <div className="flex items-baseline justify-between mb-0.5">
                    <span className={`text-[15px] font-semibold truncate ${unreadCount > 0 ? 'text-white' : 'text-gray-300'}`}>
                      {person.name}
                    </span>
                    {lastMsg && (
                      <span className={`text-[11px] ml-2 shrink-0 ${unreadCount > 0 ? 'text-cyan-400' : 'text-gray-600'}`}>
                        {formatTime(lastMsg.timestamp)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[13px] truncate flex items-center gap-1 ${unreadCount > 0 ? 'text-gray-200' : 'text-gray-500'}`}>
                      {lastMsg?.senderId === user?.id && <CheckCheck className="w-3.5 h-3.5 text-cyan-500 shrink-0" />}
                      {lastMsg ? lastMsg.text : <span className="text-gray-600 italic">Начни общение</span>}
                    </span>
                    {unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-cyan-500 text-black text-[10px] font-black flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* ── Note compose sheet ── */}
      <AnimatePresence>
        {showNoteCompose && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowNoteCompose(false)}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-[#0d0d0d] rounded-t-3xl border-t border-white/[0.06] max-w-md mx-auto"
            >
              <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mt-3 mb-4" />
              <div className="px-5 pb-10">
                <p className="text-white font-bold text-lg mb-1">Моя заметка</p>
                <p className="text-gray-500 text-sm mb-4">Видна друзьям 24 часа</p>

                {myNote && isNoteActive(myNote) && (
                  <div className="flex items-center justify-between mb-3 bg-white/[0.05] rounded-xl px-4 py-2.5">
                    <span className="text-gray-300 text-sm truncate">{myNote.text}</span>
                    <button onClick={clearMyNote} className="ml-2 shrink-0">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                )}

                <input
                  autoFocus
                  type="text"
                  value={noteText}
                  onChange={e => setNoteText(e.target.value.slice(0, 60))}
                  onKeyDown={e => e.key === 'Enter' && publishNote()}
                  placeholder="Что сейчас происходит? (до 60 символов)"
                  className="w-full bg-white/[0.07] border border-white/[0.08] rounded-2xl px-4 py-3 text-white text-[14px] placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors mb-1"
                />
                <p className="text-gray-600 text-[11px] text-right mb-4">{noteText.length}/60</p>

                <button
                  onClick={publishNote}
                  disabled={!noteText.trim()}
                  className="w-full py-3.5 rounded-2xl bg-violet-600 text-white font-bold text-[14px] disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_16px_rgba(139,92,246,0.4)]"
                >
                  Опубликовать
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
