import { useState, useCallback, useRef } from 'react';
import { Zap, RotateCcw, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MatchStack, type MatchStackHandle } from './MatchStack';
import { SwipeControls } from './SwipeControls';
import type { SwipeDir } from './MatchCard';
import type { MatchProfile } from './MatchCard';

const ALL_PROFILES: MatchProfile[] = [
  { id: 2,  name: 'Дмитрий',  age: 29, vibe: 'Креативный',      vibeEmoji: '💡', location: 'Startup Hub',    distance: '520м',  interests: ['Бизнес', 'AI', 'Кофе'],         bio: 'Founder AI стартапа, ищу co-founder',             match: 88, status: 'online', gradient: 'from-blue-600 to-indigo-600',   initial: 'Д' },
  { id: 3,  name: 'София',    age: 23, vibe: 'Вдохновлённая',   vibeEmoji: '✨', location: 'Coffee Hub',     distance: '1.2км', interests: ['Арт', 'Музыка', 'Йога'],        bio: 'Художник и диджей по выходным 🎨🎧',              match: 82, status: 'active', gradient: 'from-pink-600 to-rose-600',     initial: 'С' },
  { id: 4,  name: 'Артём',    age: 27, vibe: 'Спортивный',      vibeEmoji: '💪', location: 'CrossFit Almaty',distance: '800м',  interests: ['Спорт', 'Горы', 'Здоровье'],    bio: 'Бегу марафон в апреле, кто со мной? 🏃',          match: 79, status: 'online', gradient: 'from-emerald-600 to-teal-600',  initial: 'А' },
  { id: 5,  name: 'Камила',   age: 24, vibe: 'Тусовщица',       vibeEmoji: '🎉', location: 'Chillout Lounge',distance: '350м',  interests: ['Вечеринки', 'Мода', 'Путешествия'], bio: 'Жизнь слишком коротка для скучных мест ✈️',   match: 91, status: 'online', gradient: 'from-amber-600 to-orange-600',  initial: 'К' },
  { id: 6,  name: 'Данияр',   age: 26, vibe: 'Музыкальный',     vibeEmoji: '🎶', location: 'Jazz Bar',        distance: '600м',  interests: ['Джаз', 'Гитара', 'Вино'],       bio: 'Играю на гитаре, ищу людей для джема',            match: 85, status: 'active', gradient: 'from-violet-600 to-purple-600', initial: 'Д' },
  { id: 7,  name: 'Айгерим',  age: 22, vibe: 'Книжная',         vibeEmoji: '📚', location: 'Book House',      distance: '1.5км', interests: ['Книги', 'Кино', 'Философия'],   bio: 'Давай обсудим последнюю книгу за чаем 🍵',        match: 76, status: 'offline',gradient: 'from-cyan-600 to-blue-600',    initial: 'А' },
  { id: 8,  name: 'Руслан',   age: 30, vibe: 'Предприниматель', vibeEmoji: '🚀', location: 'WeWork Hub',      distance: '900м',  interests: ['Финтех', 'Крипто', 'Гольф'],    bio: 'Строю финтех продукт, открыт к нетворкингу',      match: 87, status: 'online', gradient: 'from-sky-600 to-indigo-600',    initial: 'Р' },
];

interface MatchToast {
  name: string;
  emoji: string;
}

export function MatchPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toast, setToast] = useState<MatchToast | null>(null);
  const stackRef = useRef<MatchStackHandle>(null);

  const handleSwiped = useCallback((dir: SwipeDir) => {
    const profile = ALL_PROFILES[currentIndex];
    if (!profile) return;

    if (dir === 'right' && Math.random() > 0.4) {
      setToast({ name: profile.name, emoji: profile.vibeEmoji });
      setTimeout(() => setToast(null), 2500);
    }

    setCurrentIndex(i => i + 1);
  }, [currentIndex]);

  const handleControlSwipe = useCallback((dir: SwipeDir) => {
    stackRef.current?.triggerSwipe(dir);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-black overflow-hidden pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3 shrink-0">
        <h1 className="text-white font-black text-2xl flex items-center gap-2">
          <Zap className="w-6 h-6 text-cyan-400" />
          Match
        </h1>
        {currentIndex > 0 && (
          <button
            onClick={() => setCurrentIndex(0)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-gray-400 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Сначала
          </button>
        )}
      </div>

      {/* Card stack */}
      <MatchStack
        ref={stackRef}
        profiles={ALL_PROFILES}
        currentIndex={currentIndex}
        onSwiped={handleSwiped}
      />

      {/* Controls */}
      <div className="py-5 shrink-0">
        <SwipeControls
          onSwipe={handleControlSwipe}
          disabled={currentIndex >= ALL_PROFILES.length}
        />
      </div>

      {/* Match toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-[0_0_30px_rgba(139,92,246,0.6)] whitespace-nowrap"
          >
            <MessageCircle className="w-5 h-5 text-white shrink-0" />
            <div>
              <p className="text-white font-bold text-sm">Это Match! {toast.emoji}</p>
              <p className="text-white/70 text-xs">{toast.name} тоже хочет познакомиться</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
