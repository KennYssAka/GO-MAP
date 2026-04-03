import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/* ─── Theme Types ─── */

export interface ChatTheme {
  id: string;
  name: string;
  myBubble: string;        // gradient or solid for "my" messages
  myBubbleText: string;
  otherBubble: string;
  otherBubbleText: string;
  wallpaper: string;        // CSS background
  accent: string;           // accent gradient
  accentSolid: string;      // single accent color
  timestampMy: string;
  timestampOther: string;
}

export interface AppTheme {
  id: string;
  name: string;
  emoji: string;
  headerBg: string;
  cardBg: string;
  surfaceBg: string;
  navBg: string;
  borderColor: string;
  accentGradient: string;
  accentColor: string;
  neonColor: string;       // for map glow
  neonColorRGB: string;    // rgb values for box-shadow
}

export type BubbleCorners = 'round' | 'soft' | 'sharp';
export type FontSizePreset = 'small' | 'normal' | 'large';

export interface ThemeSettings {
  chatThemeId: string;
  appThemeId: string;
  bubbleCorners: BubbleCorners;
  fontSize: FontSizePreset;
  neonMapEnabled: boolean;
  neonIntensity: number; // 0.3 - 1.0
  animatedBubbles: boolean;
  showReadStatus: boolean;
  compactMode: boolean;
}

/* ─── Presets ─── */

export const CHAT_THEMES: ChatTheme[] = [
  {
    id: 'default', name: 'Reality Map',
    myBubble: 'bg-gradient-to-br from-purple-600 to-pink-600',
    myBubbleText: 'text-white', otherBubble: 'bg-gray-800', otherBubbleText: 'text-white',
    wallpaper: 'bg-gray-950',
    accent: 'from-purple-600 to-pink-600', accentSolid: '#a855f7',
    timestampMy: 'text-purple-200/70', timestampOther: 'text-gray-500',
  },
  {
    id: 'ocean', name: 'Океан',
    myBubble: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    myBubbleText: 'text-white', otherBubble: 'bg-slate-800', otherBubbleText: 'text-white',
    wallpaper: 'bg-slate-950',
    accent: 'from-cyan-500 to-blue-600', accentSolid: '#06b6d4',
    timestampMy: 'text-cyan-200/70', timestampOther: 'text-slate-500',
  },
  {
    id: 'sunset', name: 'Закат',
    myBubble: 'bg-gradient-to-br from-orange-500 to-rose-600',
    myBubbleText: 'text-white', otherBubble: 'bg-zinc-800', otherBubbleText: 'text-white',
    wallpaper: 'bg-zinc-950',
    accent: 'from-orange-500 to-rose-600', accentSolid: '#f97316',
    timestampMy: 'text-orange-200/70', timestampOther: 'text-zinc-500',
  },
  {
    id: 'forest', name: 'Лес',
    myBubble: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    myBubbleText: 'text-white', otherBubble: 'bg-neutral-800', otherBubbleText: 'text-white',
    wallpaper: 'bg-neutral-950',
    accent: 'from-emerald-500 to-teal-600', accentSolid: '#10b981',
    timestampMy: 'text-emerald-200/70', timestampOther: 'text-neutral-500',
  },
  {
    id: 'neon', name: 'Неон',
    myBubble: 'bg-gradient-to-br from-fuchsia-500 to-violet-600',
    myBubbleText: 'text-white', otherBubble: 'bg-gray-900', otherBubbleText: 'text-white',
    wallpaper: 'bg-black',
    accent: 'from-fuchsia-500 to-violet-600', accentSolid: '#d946ef',
    timestampMy: 'text-fuchsia-200/70', timestampOther: 'text-gray-600',
  },
  {
    id: 'golden', name: 'Золото',
    myBubble: 'bg-gradient-to-br from-amber-500 to-yellow-600',
    myBubbleText: 'text-black', otherBubble: 'bg-stone-800', otherBubbleText: 'text-white',
    wallpaper: 'bg-stone-950',
    accent: 'from-amber-500 to-yellow-600', accentSolid: '#f59e0b',
    timestampMy: 'text-amber-800/70', timestampOther: 'text-stone-500',
  },
  {
    id: 'arctic', name: 'Арктика',
    myBubble: 'bg-gradient-to-br from-sky-400 to-indigo-500',
    myBubbleText: 'text-white', otherBubble: 'bg-slate-800/80', otherBubbleText: 'text-white',
    wallpaper: 'bg-slate-950',
    accent: 'from-sky-400 to-indigo-500', accentSolid: '#38bdf8',
    timestampMy: 'text-sky-200/70', timestampOther: 'text-slate-500',
  },
  {
    id: 'cherry', name: 'Вишня',
    myBubble: 'bg-gradient-to-br from-red-500 to-pink-600',
    myBubbleText: 'text-white', otherBubble: 'bg-gray-800', otherBubbleText: 'text-white',
    wallpaper: 'bg-gray-950',
    accent: 'from-red-500 to-pink-600', accentSolid: '#ef4444',
    timestampMy: 'text-red-200/70', timestampOther: 'text-gray-500',
  },
];

export const APP_THEMES: AppTheme[] = [
  {
    id: 'default', name: 'Reality Map', emoji: '🟣',
    headerBg: 'bg-gray-900', cardBg: 'bg-gray-800', surfaceBg: 'bg-gray-950', navBg: 'bg-gray-900',
    borderColor: 'border-gray-800', accentGradient: 'from-purple-500 to-pink-500', accentColor: '#a855f7',
    neonColor: '#a855f7', neonColorRGB: '168, 85, 247',
  },
  {
    id: 'midnight', name: 'Полночь', emoji: '🔵',
    headerBg: 'bg-slate-900', cardBg: 'bg-slate-800', surfaceBg: 'bg-slate-950', navBg: 'bg-slate-900',
    borderColor: 'border-slate-800', accentGradient: 'from-blue-500 to-cyan-500', accentColor: '#3b82f6',
    neonColor: '#3b82f6', neonColorRGB: '59, 130, 246',
  },
  {
    id: 'emerald', name: 'Изумруд', emoji: '🟢',
    headerBg: 'bg-neutral-900', cardBg: 'bg-neutral-800', surfaceBg: 'bg-neutral-950', navBg: 'bg-neutral-900',
    borderColor: 'border-neutral-800', accentGradient: 'from-emerald-500 to-teal-500', accentColor: '#10b981',
    neonColor: '#10b981', neonColorRGB: '16, 185, 129',
  },
  {
    id: 'sunset', name: 'Закат', emoji: '🟠',
    headerBg: 'bg-zinc-900', cardBg: 'bg-zinc-800', surfaceBg: 'bg-zinc-950', navBg: 'bg-zinc-900',
    borderColor: 'border-zinc-800', accentGradient: 'from-orange-500 to-rose-500', accentColor: '#f97316',
    neonColor: '#f97316', neonColorRGB: '249, 115, 22',
  },
  {
    id: 'cyber', name: 'Кибер', emoji: '🟡',
    headerBg: 'bg-gray-900', cardBg: 'bg-gray-800', surfaceBg: 'bg-black', navBg: 'bg-gray-900',
    borderColor: 'border-gray-800', accentGradient: 'from-yellow-400 to-lime-500', accentColor: '#eab308',
    neonColor: '#eab308', neonColorRGB: '234, 179, 8',
  },
  {
    id: 'sakura', name: 'Сакура', emoji: '🌸',
    headerBg: 'bg-gray-900', cardBg: 'bg-gray-800', surfaceBg: 'bg-gray-950', navBg: 'bg-gray-900',
    borderColor: 'border-gray-800', accentGradient: 'from-pink-400 to-rose-500', accentColor: '#f472b6',
    neonColor: '#f472b6', neonColorRGB: '244, 114, 182',
  },
];

export const WALLPAPERS = [
  { id: 'none', name: 'Без обоев', css: '' },
  { id: 'dots', name: 'Точки', css: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)' },
  { id: 'grid', name: 'Сетка', css: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)' },
  { id: 'diagonal', name: 'Диагональ', css: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.015) 10px, rgba(255,255,255,0.015) 11px)' },
  { id: 'stars', name: 'Звёзды', css: 'radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.05), transparent), radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.04), transparent), radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.06), transparent), radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.03), transparent)' },
  { id: 'waves', name: 'Волны', css: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.01) 20px, rgba(255,255,255,0.01) 21px)' },
];

const DEFAULT_SETTINGS: ThemeSettings = {
  chatThemeId: 'default',
  appThemeId: 'default',
  bubbleCorners: 'round',
  fontSize: 'normal',
  neonMapEnabled: true,
  neonIntensity: 0.7,
  animatedBubbles: true,
  showReadStatus: true,
  compactMode: false,
};

/* ─── Context ─── */

interface ThemeContextType {
  settings: ThemeSettings;
  chatTheme: ChatTheme;
  appTheme: AppTheme;
  updateSettings: (updates: Partial<ThemeSettings>) => void;
  getBubbleRadius: () => string;
  getFontSize: () => string;
  getWallpaperCSS: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function loadSettings(): ThemeSettings {
  try {
    const stored = localStorage.getItem('theme_settings');
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(loadSettings);

  useEffect(() => {
    localStorage.setItem('theme_settings', JSON.stringify(settings));
  }, [settings]);

  const chatTheme = CHAT_THEMES.find(t => t.id === settings.chatThemeId) || CHAT_THEMES[0];
  const appTheme = APP_THEMES.find(t => t.id === settings.appThemeId) || APP_THEMES[0];

  const updateSettings = (updates: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const getBubbleRadius = () => {
    switch (settings.bubbleCorners) {
      case 'round': return 'rounded-2xl';
      case 'soft': return 'rounded-xl';
      case 'sharp': return 'rounded-lg';
    }
  };

  const getFontSize = () => {
    switch (settings.fontSize) {
      case 'small': return 'text-[13px]';
      case 'normal': return 'text-[14px]';
      case 'large': return 'text-[16px]';
    }
  };

  const getWallpaperCSS = () => {
    const wp = WALLPAPERS.find(w => w.id === settings.chatThemeId);
    return wp?.css || '';
  };

  return (
    <ThemeContext.Provider value={{ settings, chatTheme, appTheme, updateSettings, getBubbleRadius, getFontSize, getWallpaperCSS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
