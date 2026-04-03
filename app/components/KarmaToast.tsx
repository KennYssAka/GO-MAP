import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useKarma, KARMA_ACTIONS, ACHIEVEMENTS, type KarmaAction, type Achievement } from './KarmaContext';

interface ToastItem {
  id: string;
  type: 'karma' | 'achievement' | 'levelup' | 'streak';
  title: string;
  subtitle?: string;
  emoji: string;
  points?: number;
  karma?: number;
  multiplier?: number;
  gradient: string;
}

let addToastExternal: ((toast: ToastItem) => void) | null = null;

export function showKarmaToast(action: KarmaAction, result: { points: number; karma: number; newAchievements: Achievement[] } | null) {
  if (!result || !addToastExternal) return;
  
  const config = KARMA_ACTIONS[action];
  
  addToastExternal({
    id: Date.now().toString(),
    type: 'karma',
    title: config.label,
    subtitle: config.description,
    emoji: config.emoji,
    points: result.points,
    karma: result.karma,
    multiplier: result.points > config.points ? result.points / config.points : undefined,
    gradient: 'from-purple-600 to-pink-600',
  });

  // Show achievement toasts
  for (const ach of result.newAchievements) {
    setTimeout(() => {
      addToastExternal?.({
        id: `ach_${ach.id}_${Date.now()}`,
        type: 'achievement',
        title: '🏅 Достижение!',
        subtitle: `${ach.title}: ${ach.description}`,
        emoji: ach.emoji,
        gradient: ach.gradient,
      });
    }, 800);
  }
}

export function KarmaToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toast: ToastItem) => {
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 3000);
  }, []);

  useEffect(() => {
    addToastExternal = addToast;
    return () => { addToastExternal = null; };
  }, [addToast]);

  return (
    <div className="fixed top-4 left-4 right-4 z-[9999] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            layout
            className="pointer-events-auto w-full max-w-sm"
          >
            <div className={`bg-gradient-to-r ${toast.gradient} rounded-2xl p-3 shadow-2xl border border-white/20 backdrop-blur-xl`}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                  {toast.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">{toast.title}</p>
                  {toast.subtitle && (
                    <p className="text-white/70 text-xs truncate">{toast.subtitle}</p>
                  )}
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  {toast.points != null && (
                    <span className="text-yellow-300 font-bold text-sm">+{toast.points} ⚡</span>
                  )}
                  {toast.karma != null && (
                    <span className="text-white/80 text-xs">+{toast.karma} ✨</span>
                  )}
                  {toast.multiplier != null && toast.multiplier > 1 && (
                    <span className="text-orange-300 text-[10px] font-bold">×{toast.multiplier.toFixed(1)} 🔥</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
