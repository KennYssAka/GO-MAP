import { motion, AnimatePresence } from 'motion/react';
import {
  X, Bookmark, History, Moon, Sun, Bell, Shield, HelpCircle,
  Info, MapPin, Star, MessageSquare, Award, Crown, ChevronRight,
  Layers, Navigation, Volume2, VolumeX, Globe, User
} from 'lucide-react';
import { useState } from 'react';
import { useUser } from './UserContext';
import { useKarma } from './KarmaContext';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProfile?: () => void;
  onOpenO2O?: () => void;
  onOpenAchievements?: () => void;
  onOpenSubscription?: () => void;
  onOpenKarma?: () => void;
  favoritesCount?: number;
  recentSearches?: string[];
  onClearRecentSearches?: () => void;
}

export function SideDrawer({
  isOpen,
  onClose,
  onNavigateToProfile,
  onOpenO2O,
  onOpenAchievements,
  onOpenSubscription,
  onOpenKarma,
  favoritesCount = 0,
  recentSearches = [],
  onClearRecentSearches,
}: SideDrawerProps) {
  const { user } = useUser();
  const { state: karmaState, rank } = useKarma();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const menuSections = [
    {
      title: 'Навигация',
      items: [
        { icon: User, label: 'Мой профиль', color: 'text-purple-400', bg: 'bg-purple-500/15', action: () => { onNavigateToProfile?.(); onClose(); } },
        { icon: Award, label: 'Достижения', color: 'text-amber-400', bg: 'bg-amber-500/15', badge: karmaState?.unlockedAchievements?.length || 0, action: () => { onOpenAchievements?.(); onClose(); } },
        { icon: Star, label: 'Карма', color: 'text-yellow-400', bg: 'bg-yellow-500/15', badge: karmaState?.totalKarma || 0, action: () => { onOpenKarma?.(); onClose(); } },
        { icon: Crown, label: 'Подписка', color: 'text-pink-400', bg: 'bg-pink-500/15', subtitle: 'O2O Pass и другие', action: () => { onOpenSubscription?.(); onClose(); } },
        { icon: MapPin, label: 'O2O Скидки', color: 'text-green-400', bg: 'bg-green-500/15', subtitle: 'Партнёрские предложения', action: () => { onOpenO2O?.(); onClose(); } },
      ],
    },
    {
      title: 'Избранное и история',
      items: [
        { icon: Bookmark, label: 'Избранные места', color: 'text-blue-400', bg: 'bg-blue-500/15', badge: favoritesCount },
        { icon: History, label: 'Недавние поиски', color: 'text-gray-400', bg: 'bg-gray-500/15', badge: recentSearches.length, action: onClearRecentSearches ? () => {} : undefined },
        { icon: Navigation, label: 'История маршрутов', color: 'text-cyan-400', bg: 'bg-cyan-500/15' },
      ],
    },
    {
      title: 'Настройки',
      items: [
        { icon: darkMode ? Moon : Sun, label: 'Тёмная тема', color: 'text-indigo-400', bg: 'bg-indigo-500/15', toggle: true, toggleValue: darkMode, onToggle: () => setDarkMode(!darkMode) },
        { icon: Bell, label: 'Уведомления', color: 'text-orange-400', bg: 'bg-orange-500/15', toggle: true, toggleValue: notifications, onToggle: () => setNotifications(!notifications) },
        { icon: soundEffects ? Volume2 : VolumeX, label: 'Звуки', color: 'text-teal-400', bg: 'bg-teal-500/15', toggle: true, toggleValue: soundEffects, onToggle: () => setSoundEffects(!soundEffects) },
        { icon: Layers, label: 'Слои карты', color: 'text-emerald-400', bg: 'bg-emerald-500/15', subtitle: 'OpenStreetMap' },
        { icon: Globe, label: 'Язык', color: 'text-violet-400', bg: 'bg-violet-500/15', subtitle: 'Русский' },
        { icon: Shield, label: 'Конфиденциальность', color: 'text-red-400', bg: 'bg-red-500/15' },
      ],
    },
    {
      title: 'Информация',
      items: [
        { icon: HelpCircle, label: 'Помощь', color: 'text-sky-400', bg: 'bg-sky-500/15' },
        { icon: MessageSquare, label: 'Обратная связь', color: 'text-lime-400', bg: 'bg-lime-500/15' },
        { icon: Info, label: 'О приложении', color: 'text-gray-400', bg: 'bg-gray-500/15', subtitle: 'v1.0 AI Reality Map' },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[2000]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[340px] bg-gray-900 z-[2001] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="relative px-5 pt-[max(20px,env(safe-area-inset-top))] pb-4 bg-gradient-to-br from-purple-900/60 to-gray-900 border-b border-gray-800/50">
              <button
                onClick={onClose}
                className="absolute top-[max(16px,env(safe-area-inset-top))] right-4 w-9 h-9 rounded-full bg-gray-800/80 flex items-center justify-center hover:bg-gray-700 active:scale-90 transition-all"
                aria-label="Закрыть меню"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              {/* User info */}
              <div className="flex items-center gap-3 mt-2">
                <div
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white/20 cursor-pointer active:scale-95 transition-transform"
                  onClick={() => { onNavigateToProfile?.(); onClose(); }}
                >
                  {user?.avatarInitial || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-white font-bold text-lg truncate">{user?.name || 'Пользователь'}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-purple-400 text-xs font-semibold">
                      Уровень {user?.level || 1}
                    </span>
                    <span className="text-gray-600">·</span>
                    <span className="text-yellow-400 text-xs font-semibold flex items-center gap-1">
                      ⭐ {karmaState?.totalKarma || 0} кармы
                    </span>
                  </div>
                  {rank && (
                    <p className="text-gray-500 text-[11px] mt-0.5 truncate">
                      {rank.emoji} {rank.title}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex gap-2 mt-3">
                <div className="flex-1 bg-gray-800/60 rounded-xl px-3 py-2 text-center">
                  <p className="text-white font-bold text-sm">{karmaState?.totalKarma || 0}</p>
                  <p className="text-gray-500 text-[10px]">Карма</p>
                </div>
                <div className="flex-1 bg-gray-800/60 rounded-xl px-3 py-2 text-center">
                  <p className="text-white font-bold text-sm">{karmaState?.unlockedAchievements?.length || 0}</p>
                  <p className="text-gray-500 text-[10px]">Ачивки</p>
                </div>
                <div className="flex-1 bg-gray-800/60 rounded-xl px-3 py-2 text-center">
                  <p className="text-white font-bold text-sm">{favoritesCount}</p>
                  <p className="text-gray-500 text-[10px]">Избранное</p>
                </div>
              </div>
            </div>

            {/* Menu sections */}
            <div className="flex-1 overflow-y-auto">
              {menuSections.map((section, si) => (
                <div key={si} className="py-2">
                  <h3 className="px-5 py-2 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                    {section.title}
                  </h3>
                  {section.items.map((item, ii) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={ii}
                        onClick={item.toggle ? item.onToggle : item.action}
                        className="w-full px-5 py-3 flex items-center gap-3 hover:bg-gray-800/60 active:bg-gray-800 transition-colors"
                      >
                        <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-[18px] h-[18px] ${item.color}`} />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.label}</p>
                          {item.subtitle && (
                            <p className="text-gray-500 text-[11px] truncate">{item.subtitle}</p>
                          )}
                        </div>
                        {item.toggle ? (
                          <div
                            className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${
                              item.toggleValue ? 'bg-purple-500' : 'bg-gray-700'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                                item.toggleValue ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </div>
                        ) : item.badge !== undefined && item.badge > 0 ? (
                          <span className="text-gray-500 text-xs font-semibold bg-gray-800 px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-800/50" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
              <p className="text-gray-600 text-[10px] text-center">
                AI Reality Map v1.0 · Made with ❤️ in Kazakhstan
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}