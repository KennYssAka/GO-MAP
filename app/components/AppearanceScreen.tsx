import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Palette, MessageSquare, Type, Circle, Square, RectangleHorizontal,
  Sparkles, Eye, EyeOff, ChevronRight, Check, CheckCheck, Sun, Moon,
  Zap, Image, LayoutGrid, Minus, Plus, Monitor
} from 'lucide-react';
import {
  useTheme, CHAT_THEMES, APP_THEMES, WALLPAPERS,
  type ChatTheme, type BubbleCorners, type FontSizePreset
} from './ThemeContext';
import { useUser } from './UserContext';

interface AppearanceScreenProps {
  onBack: () => void;
}

export function AppearanceScreen({ onBack }: AppearanceScreenProps) {
  const { settings, chatTheme, appTheme, updateSettings, getBubbleRadius, getFontSize } = useTheme();
  const { user } = useUser();
  const [section, setSection] = useState<'main' | 'chatTheme' | 'appTheme' | 'wallpaper'>('main');
  const [previewWallpaper, setPreviewWallpaper] = useState<string | null>(null);

  const bubbleCornerOptions: { id: BubbleCorners; label: string; icon: any; preview: string }[] = [
    { id: 'round', label: 'Круглые', icon: Circle, preview: 'rounded-2xl' },
    { id: 'soft', label: 'Мягкие', icon: RectangleHorizontal, preview: 'rounded-xl' },
    { id: 'sharp', label: 'Острые', icon: Square, preview: 'rounded-lg' },
  ];

  const fontSizeOptions: { id: FontSizePreset; label: string; size: string }[] = [
    { id: 'small', label: 'Мелкий', size: 'text-[13px]' },
    { id: 'normal', label: 'Обычный', size: 'text-[14px]' },
    { id: 'large', label: 'Крупный', size: 'text-[16px]' },
  ];

  /* ─── Chat Theme Picker ─── */
  if (section === 'chatTheme') {
    return (
      <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden">
        <div className="bg-gray-900 border-b border-gray-800 px-4 pt-12 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSection('main')} className="p-1.5 rounded-full hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-white font-bold text-lg">Тема чата</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {CHAT_THEMES.map(theme => {
            const active = settings.chatThemeId === theme.id;
            return (
              <button key={theme.id} onClick={() => updateSettings({ chatThemeId: theme.id })}
                className={`w-full rounded-2xl overflow-hidden border transition-all ${active ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-gray-800 hover:border-gray-700'}`}>
                {/* Preview */}
                <div className={`${theme.wallpaper} p-4 space-y-2`}>
                  {/* Other's message */}
                  <div className="flex justify-start">
                    <div className={`${theme.otherBubble} ${getBubbleRadius()} ${getBubbleRadius()} px-3.5 py-2 max-w-[70%]`}>
                      <p className={`${theme.otherBubbleText} text-[13px]`}>Привет! Как дела? 👋</p>
                      <p className={`${theme.timestampOther} text-[9px] text-right mt-0.5`}>14:20</p>
                    </div>
                  </div>
                  {/* My message */}
                  <div className="flex justify-end">
                    <div className={`${theme.myBubble} ${getBubbleRadius()} px-3.5 py-2 max-w-[70%]`}>
                      <p className={`${theme.myBubbleText} text-[13px]`}>Отлично! Идём гулять? 🌃</p>
                      <div className={`flex items-center gap-1 justify-end mt-0.5 ${theme.timestampMy}`}>
                        <span className="text-[9px]">14:21</span>
                        <CheckCheck className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Label */}
                <div className={`px-4 py-3 flex items-center justify-between ${active ? 'bg-purple-500/10' : 'bg-gray-900'}`}>
                  <span className={`font-semibold text-sm ${active ? 'text-purple-300' : 'text-gray-300'}`}>{theme.name}</span>
                  {active && <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ─── App Theme Picker ─── */
  if (section === 'appTheme') {
    return (
      <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden">
        <div className="bg-gray-900 border-b border-gray-800 px-4 pt-12 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSection('main')} className="p-1.5 rounded-full hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-white font-bold text-lg">Тема приложения</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {APP_THEMES.map(theme => {
            const active = settings.appThemeId === theme.id;
            return (
              <button key={theme.id} onClick={() => updateSettings({ appThemeId: theme.id })}
                className={`w-full rounded-2xl overflow-hidden border transition-all ${active ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-gray-800 hover:border-gray-700'}`}>
                <div className={`${theme.surfaceBg} p-4`}>
                  {/* Mini app preview */}
                  <div className={`${theme.headerBg} rounded-t-xl p-3 flex items-center gap-2 border-b ${theme.borderColor}`}>
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${theme.accentGradient}`} />
                    <div className="flex-1">
                      <div className={`h-2 w-20 ${theme.cardBg} rounded-full`} />
                      <div className={`h-1.5 w-12 ${theme.cardBg} rounded-full mt-1 opacity-50`} />
                    </div>
                  </div>
                  <div className={`${theme.navBg} rounded-b-xl p-2 flex justify-around`}>
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`w-6 h-1.5 rounded-full ${i === 1 ? `bg-gradient-to-r ${theme.accentGradient}` : theme.cardBg}`} />
                    ))}
                  </div>
                  {/* Neon preview dot */}
                  <div className="flex items-center justify-center mt-3">
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.neonColor, boxShadow: `0 0 12px ${theme.neonColor}, 0 0 24px ${theme.neonColor}40` }} />
                    </div>
                    <span className="text-gray-500 text-[10px] ml-2">Неон: {theme.name}</span>
                  </div>
                </div>
                <div className={`px-4 py-3 flex items-center justify-between ${active ? 'bg-purple-500/10' : 'bg-gray-900'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{theme.emoji}</span>
                    <span className={`font-semibold text-sm ${active ? 'text-purple-300' : 'text-gray-300'}`}>{theme.name}</span>
                  </div>
                  {active && <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ─── Main Settings ─── */
  return (
    <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden">
      <div className="bg-gray-900 border-b border-gray-800 px-4 pt-12 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-full hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-white font-bold text-lg">Внешний вид</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Live chat preview */}
        <div className="p-4">
          <div className={`${chatTheme.wallpaper} rounded-2xl overflow-hidden border border-gray-800`}
            style={previewWallpaper ? { backgroundImage: previewWallpaper, backgroundSize: '20px 20px' } : {}}>
            <div className="p-4 space-y-2">
              <div className="flex justify-start">
                <div className={`${chatTheme.otherBubble} ${getBubbleRadius()} px-3.5 py-2 max-w-[75%]`}>
                  <p className={`${chatTheme.otherBubbleText} ${getFontSize()}`}>Привет! Как вайб сегодня? ✨</p>
                  <p className={`${chatTheme.timestampOther} text-[9px] text-right mt-0.5`}>14:20</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className={`${chatTheme.myBubble} ${getBubbleRadius()} px-3.5 py-2 max-w-[75%]`}>
                  <p className={`${chatTheme.myBubbleText} ${getFontSize()}`}>Топ! Идём на Reality Map митап? 🚀</p>
                  <div className={`flex items-center gap-1 justify-end mt-0.5 ${chatTheme.timestampMy}`}>
                    <span className="text-[9px]">14:21</span>
                    {settings.showReadStatus && <CheckCheck className="w-3 h-3" />}
                  </div>
                </div>
              </div>
              <div className="flex justify-start">
                <div className={`${chatTheme.otherBubble} ${getBubbleRadius()} px-3.5 py-2 max-w-[75%]`}>
                  <p className={`${chatTheme.otherBubbleText} ${getFontSize()}`}>Давай! В 18:00 на Арбате 🔥</p>
                  <p className={`${chatTheme.timestampOther} text-[9px] text-right mt-0.5`}>14:22</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Theme sections ─── */}

        {/* Chat Theme */}
        <div className="px-4 pb-2">
          <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Тема</h4>
        </div>

        <button onClick={() => setSection('chatTheme')} className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-gray-800/40 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center"><MessageSquare className="w-4.5 h-4.5 text-purple-400" /></div>
          <div className="flex-1 text-left"><p className="text-white text-sm font-medium">Тема чата</p><p className="text-gray-500 text-[11px]">{chatTheme.name}</p></div>
          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${chatTheme.accent}`} />
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>

        <button onClick={() => setSection('appTheme')} className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-gray-800/40 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center"><Palette className="w-4.5 h-4.5 text-blue-400" /></div>
          <div className="flex-1 text-left"><p className="text-white text-sm font-medium">Тема приложения</p><p className="text-gray-500 text-[11px]">{appTheme.name} {appTheme.emoji}</p></div>
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>

        {/* Wallpaper */}
        <div className="px-4 pt-4 pb-2">
          <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-3">Обои чата</h4>
          <div className="grid grid-cols-3 gap-2">
            {WALLPAPERS.map(wp => (
              <button key={wp.id} onClick={() => setPreviewWallpaper(wp.css || null)}
                className={`h-16 rounded-xl border transition-all overflow-hidden ${previewWallpaper === (wp.css || null) || (!previewWallpaper && wp.id === 'none') ? 'border-purple-500 ring-1 ring-purple-500/30' : 'border-gray-800'}`}>
                <div className="w-full h-full bg-gray-950 flex items-center justify-center"
                  style={wp.css ? { backgroundImage: wp.css, backgroundSize: '20px 20px' } : {}}>
                  <span className="text-gray-500 text-[9px] font-medium">{wp.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bubble Corners */}
        <div className="px-4 pt-5 pb-2">
          <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-3">Углы пузырей</h4>
          <div className="flex gap-2">
            {bubbleCornerOptions.map(opt => {
              const active = settings.bubbleCorners === opt.id;
              return (
                <button key={opt.id} onClick={() => updateSettings({ bubbleCorners: opt.id })}
                  className={`flex-1 py-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${active ? 'border-purple-500 bg-purple-500/10' : 'border-gray-800 bg-gray-900 hover:bg-gray-800'}`}>
                  <div className={`w-10 h-7 bg-gradient-to-r ${chatTheme.accent} ${opt.preview}`} />
                  <span className={`text-xs font-medium ${active ? 'text-purple-300' : 'text-gray-400'}`}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Size */}
        <div className="px-4 pt-5 pb-2">
          <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-3">Размер текста</h4>
          <div className="flex gap-2">
            {fontSizeOptions.map(opt => {
              const active = settings.fontSize === opt.id;
              return (
                <button key={opt.id} onClick={() => updateSettings({ fontSize: opt.id })}
                  className={`flex-1 py-3 rounded-xl border transition-all flex flex-col items-center gap-1.5 ${active ? 'border-purple-500 bg-purple-500/10' : 'border-gray-800 bg-gray-900 hover:bg-gray-800'}`}>
                  <Type className={`${opt.size === 'text-[13px]' ? 'w-4 h-4' : opt.size === 'text-[16px]' ? 'w-6 h-6' : 'w-5 h-5'} ${active ? 'text-purple-400' : 'text-gray-500'}`} />
                  <span className={`text-xs font-medium ${active ? 'text-purple-300' : 'text-gray-400'}`}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Neon Map */}
        <div className="px-4 pt-5 pb-2">
          <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Карта</h4>
        </div>

        <button onClick={() => updateSettings({ neonMapEnabled: !settings.neonMapEnabled })}
          className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-gray-800/40 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-fuchsia-500/15 flex items-center justify-center"><Sparkles className="w-4.5 h-4.5 text-fuchsia-400" /></div>
          <div className="flex-1 text-left">
            <p className="text-white text-sm font-medium">Неоновые зоны</p>
            <p className="text-gray-500 text-[11px]">Подсветка активности на карте</p>
          </div>
          <div className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${settings.neonMapEnabled ? 'bg-purple-500' : 'bg-gray-700'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${settings.neonMapEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </button>

        {settings.neonMapEnabled && (
          <div className="px-5 py-3 flex items-center gap-3">
            <span className="text-gray-500 text-xs">Яркость</span>
            <div className="flex-1 relative h-8 flex items-center">
              <input type="range" min={30} max={100} value={settings.neonIntensity * 100}
                onChange={e => updateSettings({ neonIntensity: parseInt(e.target.value) / 100 })}
                className="w-full accent-purple-500 h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:shadow-purple-500/40" />
            </div>
            <span className="text-purple-400 text-xs font-bold w-8 text-right">{Math.round(settings.neonIntensity * 100)}%</span>
          </div>
        )}

        {/* Misc toggles */}
        <div className="px-4 pt-5 pb-2">
          <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Прочее</h4>
        </div>

        <ToggleRow label="Анимация пузырей" desc="Плавное появление сообщений"
          value={settings.animatedBubbles} onChange={v => updateSettings({ animatedBubbles: v })} />
        <ToggleRow label="Статус прочтения" desc="Показывать галочки ✓✓"
          value={settings.showReadStatus} onChange={v => updateSettings({ showReadStatus: v })} />
        <ToggleRow label="Компактный режим" desc="Меньше отступов в списке чатов"
          value={settings.compactMode} onChange={v => updateSettings({ compactMode: v })} />

        <div className="h-20" />
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-gray-800/40 transition-colors">
      <div className="flex-1 text-left">
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-gray-500 text-[11px]">{desc}</p>
      </div>
      <div className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${value ? 'bg-purple-500' : 'bg-gray-700'}`}>
        <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </button>
  );
}
