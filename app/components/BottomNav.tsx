import { MapPin, User, Calendar, Zap, MessageCircle, Newspaper } from 'lucide-react';
import type { Screen } from '@/app/App';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const NAV_ITEMS: { id: Screen; icon: typeof MapPin; label: string }[] = [
  { id: 'map', icon: MapPin, label: 'Карта' },
  { id: 'feed', icon: Newspaper, label: 'Лента' },
  { id: 'events', icon: Calendar, label: 'События' },
  { id: 'match', icon: Zap, label: 'Match' },
  { id: 'messages', icon: MessageCircle, label: 'Чаты' },
  { id: 'profile', icon: User, label: 'Профиль' },
];

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  return (
    <div className="bg-black border-t border-white/[0.06] px-1 py-2 flex justify-around items-center safe-area-bottom">
      {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
        const isActive = currentScreen === id;
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-all relative ${
              isActive
                ? 'text-cyan-400'
                : 'text-gray-500'
            }`}
          >
            {isActive && (
              <span className="absolute inset-0 rounded-xl bg-cyan-400/10" />
            )}
            <Icon className="w-5 h-5" />
            <span className={`text-[9px] font-semibold ${isActive ? 'text-cyan-400' : 'text-gray-600'}`}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
