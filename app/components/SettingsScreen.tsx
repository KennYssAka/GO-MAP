import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, User, MessageSquare, Shield, Bell, Database, FolderOpen,
  Smartphone, BatteryMedium, Globe, Crown, ChevronRight, Camera, Edit3,
  Palette, Sparkles, Moon, Sun, Volume2, VolumeX, Eye, EyeOff,
  Lock, Fingerprint, Clock, Users, Trash2, HelpCircle, Info, Heart,
  LogOut, QrCode, Wifi, Download, Image, Zap, X, Check
} from 'lucide-react';
import { useUser } from './UserContext';
import { useKarma } from './KarmaContext';
import { useTheme, CHAT_THEMES, APP_THEMES } from './ThemeContext';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { useFriends } from './FriendsContext';

interface SettingsScreenProps {
  onBack: () => void;
  onOpenAppearance: () => void;
  onOpenSubscription?: () => void;
  onLogout: () => void;
}

export function SettingsScreen({ onBack, onOpenAppearance, onOpenSubscription, onLogout }: SettingsScreenProps) {
  const { user, updateProfile, toggleGhostMode, togglePrivateAccount, hideFromUser, unhideFromUser } = useUser();
  const { friends } = useFriends();
  const { rank } = useKarma();
  const { settings, chatTheme, appTheme, updateSettings } = useTheme();
  const [subPage, setSubPage] = useState<'main' | 'account' | 'chatSettings' | 'privacy' | 'notifications' | 'dataStorage' | 'devices' | 'language' | 'ghostSettings'>('main');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate file type and size
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB max

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        updateProfile({ avatarUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
    setShowPhotoOptions(false);
  };

  const handleRemovePhoto = () => {
    updateProfile({ avatarUrl: '' });
    setShowPhotoOptions(false);
  };

  // Local settings state
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifGroups, setNotifGroups] = useState(true);
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifSounds, setNotifSounds] = useState(true);
  const [notifVibrate, setNotifVibrate] = useState(true);
  const [notifBadges, setNotifBadges] = useState(true);
  const [privacyLastSeen, setPrivacyLastSeen] = useState<'everyone' | 'contacts' | 'nobody'>('everyone');
  const [privacyPhoto, setPrivacyPhoto] = useState<'everyone' | 'contacts' | 'nobody'>('everyone');
  const [privacyOnline, setPrivacyOnline] = useState(true);
  const [privacyReadReceipts, setPrivacyReadReceipts] = useState(true);
  const [privacyTyping, setPrivacyTyping] = useState(true);
  const [autoDownloadWifi, setAutoDownloadWifi] = useState(true);
  const [autoDownloadMobile, setAutoDownloadMobile] = useState(false);
  const [saveToGallery, setSaveToGallery] = useState(false);
  const [dataUsageStats] = useState({ photos: '12.4 МБ', voice: '3.2 МБ', other: '1.8 МБ', total: '17.4 МБ' });
  const [lang, setLang] = useState('ru');

  if (!user) return null;

  /* ─── Account Sub-page ─── */
  if (subPage === 'account') {
    return (
      <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden">
        <div className="bg-gray-900 border-b border-gray-800 px-4 pt-12 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSubPage('main')} className="p-1.5 rounded-full hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-white font-bold text-lg">Аккаунт</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-1">
            <InfoRow label="Имя" value={user.name} />
            <InfoRow label="Никнейм" value={`@${user.username}`} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Телефон" value={user.phone || 'Не указан'} />
            <InfoRow label="Город" value={user.city} />
            <InfoRow label="Авторизация" value={user.authProvider === 'google' ? 'Google' : user.authProvider === 'apple' ? 'Apple' : 'Email'} />
          </div>

          <div className="px-5 pt-2 pb-1">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Био</h4>
          </div>
          <div className="px-5 pb-4">
            <p className="text-gray-300 text-sm">{user.bio || 'Не указано'}</p>
          </div>

          <div className="px-5 pt-2 pb-1">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Соцсети</h4>
          </div>
          <div className="px-5 pb-4 space-y-2">
            {user.socialLinks.instagram && <p className="text-gray-300 text-sm">Instagram: @{user.socialLinks.instagram}</p>}
            {user.socialLinks.telegram && <p className="text-gray-300 text-sm">Telegram: @{user.socialLinks.telegram}</p>}
            {user.socialLinks.twitter && <p className="text-gray-300 text-sm">X/Twitter: @{user.socialLinks.twitter}</p>}
            {!user.socialLinks.instagram && !user.socialLinks.telegram && !user.socialLinks.twitter && (
              <p className="text-gray-500 text-sm">Не привязаны</p>
            )}
          </div>

          <div className="border-t border-gray-800 mx-5" />
          <div className="px-5 py-4">
            <p className="text-gray-500 text-xs">
              Аккаунт создан: {new Date(user.joinedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Chat Settings Sub-page ─── */
  if (subPage === 'chatSettings') {
    return (
      <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden">
        <div className="bg-gray-900 border-b border-gray-800 px-4 pt-12 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSubPage('main')} className="p-1.5 rounded-full hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-white font-bold text-lg">Настройки чатов</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Preview */}
          <div className="p-4">
            <div className={`${chatTheme.wallpaper} rounded-2xl border border-gray-800 p-4 space-y-2`}>
              <div className="flex justify-start">
                <div className={`${chatTheme.otherBubble} rounded-2xl rounded-bl-md px-3.5 py-2 max-w-[70%]`}>
                  <p className={`${chatTheme.otherBubbleText} text-[13px]`}>Привет! 👋</p>
                  <p className={`${chatTheme.timestampOther} text-[9px] text-right mt-0.5`}>14:20</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className={`${chatTheme.myBubble} rounded-2xl rounded-br-md px-3.5 py-2 max-w-[70%]`}>
                  <p className={`${chatTheme.myBubbleText} text-[13px]`}>Как дела? 😊</p>
                  <p className={`${chatTheme.timestampMy} text-[9px] text-right mt-0.5`}>14:21</p>
                </div>
              </div>
            </div>
          </div>

          <SettingsRow icon={Palette} iconColor="text-purple-400" iconBg="bg-purple-500/15"
            label="Тема чата" subtitle={chatTheme.name}
            right={<div className={`w-5 h-5 rounded-full bg-gradient-to-r ${chatTheme.accent}`} />}
            onClick={onOpenAppearance} />
          <SettingsRow icon={Image} iconColor="text-blue-400" iconBg="bg-blue-500/15"
            label="Обои и оформление" subtitle="Цвета, шрифт, углы"
            onClick={onOpenAppearance} />

          <div className="h-2" />
          <div className="px-5 pb-1 pt-3">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Поведение</h4>
          </div>

          <ToggleRow label="Анимация пузырей" desc="Плавное появление сообщений"
            value={settings.animatedBubbles} onChange={v => updateSettings({ animatedBubbles: v })} />
          <ToggleRow label="Галочки прочтения" desc="Показывать статус ✓✓"
            value={settings.showReadStatus} onChange={v => updateSettings({ showReadStatus: v })} />
          <ToggleRow label="Компактный режим" desc="Меньше отступов в списке"
            value={settings.compactMode} onChange={v => updateSettings({ compactMode: v })} />

          <div className="h-2" />
          <div className="px-5 pb-1 pt-3">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Карта</h4>
          </div>

          <ToggleRow label="Неоновые зоны" desc="Подсветка активности на карте"
            value={settings.neonMapEnabled} onChange={v => updateSettings({ neonMapEnabled: v })} />

          {settings.neonMapEnabled && (
            <div className="px-5 py-3 flex items-center gap-3">
              <span className="text-gray-500 text-xs">Яркость</span>
              <div className="flex-1 relative h-8 flex items-center">
                <input type="range" min={30} max={100} value={settings.neonIntensity * 100}
                  onChange={e => updateSettings({ neonIntensity: parseInt(e.target.value) / 100 })}
                  className="w-full accent-purple-500 h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:shadow-lg" />
              </div>
              <span className="text-purple-400 text-xs font-bold w-8 text-right">{Math.round(settings.neonIntensity * 100)}%</span>
            </div>
          )}

          <div className="h-20" />
        </div>
      </div>
    );
  }

  /* ─── Privacy Sub-page ─── */
  if (subPage === 'privacy') {
    return (
      <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden">
        <div className="bg-gray-900 border-b border-gray-800 px-4 pt-12 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSubPage('main')} className="p-1.5 rounded-full hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-white font-bold text-lg">Конфиденциальность</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">

          {/* Ghost Mode */}
          <div className="px-5 pb-1 pt-5">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Статус</h4>
          </div>
          <div className="mx-5 my-2 bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <button onClick={toggleGhostMode} className="w-full px-4 py-4 flex items-center gap-3 hover:bg-gray-800/40 transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user.ghostMode ? 'bg-purple-500/20' : 'bg-gray-700/40'}`}>
                <EyeOff className={`w-5 h-5 ${user.ghostMode ? 'text-purple-300' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white text-sm font-medium">Ghost Mode</p>
                <p className="text-gray-500 text-[11px]">
                  {user.ghostMode ? 'Ты невидим на карте и в списках' : 'Твоя геолокация видна друзьям'}
                </p>
              </div>
              <div className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${user.ghostMode ? 'bg-purple-500' : 'bg-gray-700'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${user.ghostMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>
            {user.ghostMode && (
              <div className="px-4 py-3 bg-purple-500/8 border-t border-purple-500/15">
                <p className="text-purple-300 text-[12px]">
                  Ты скрыт с карты. Чекины не видят другие пользователи.
                </p>
              </div>
            )}
          </div>

          {/* Private account */}
          <div className="px-5 pb-1 pt-4">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Аккаунт</h4>
          </div>
          <ToggleRow
            label="Приватный аккаунт"
            desc="Только друзья видят твои посты и профиль"
            value={user.isPrivate}
            onChange={togglePrivateAccount}
          />
          <ToggleRow
            label="Скрыть историю чекинов"
            desc="Другие не видят где ты бывал"
            value={user.hideCheckinHistory}
            onChange={(v) => updateProfile({ hideCheckinHistory: v })}
          />

          {/* Hide from specific users */}
          <div className="px-5 pb-1 pt-4">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Скрыться от конкретных людей</h4>
          </div>
          <div className="px-5 pb-3">
            <p className="text-gray-500 text-[11px] mb-3">
              Выбранные люди не будут видеть тебя на карте и в рекомендациях.
            </p>
            {friends.filter(f => user.hiddenFromUsers.includes(f.id)).length > 0 && (
              <div className="space-y-2 mb-3">
                {friends.filter(f => user.hiddenFromUsers.includes(f.id)).map(f => (
                  <div key={f.id} className="flex items-center gap-3 bg-gray-900 rounded-xl px-3 py-2.5 border border-gray-800">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${f.avatarGradient} flex items-center justify-center text-white text-xs font-bold`}>
                      {f.avatarInitial}
                    </div>
                    <span className="flex-1 text-white text-sm">{f.name}</span>
                    <button
                      onClick={() => unhideFromUser(f.id)}
                      className="text-red-400 text-[11px] font-medium px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
                    >
                      Снять
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-2">
              {friends.filter(f => !user.hiddenFromUsers.includes(f.id)).slice(0, 6).map(f => (
                <div key={f.id} className="flex items-center gap-3 bg-gray-900/50 rounded-xl px-3 py-2 border border-gray-800/50">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${f.avatarGradient} flex items-center justify-center text-white text-xs font-bold`}>
                    {f.avatarInitial}
                  </div>
                  <span className="flex-1 text-gray-300 text-sm">{f.name}</span>
                  <button
                    onClick={() => hideFromUser(f.id)}
                    className="text-gray-500 text-[11px] font-medium px-2 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    Скрыть
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Who sees */}
          <div className="px-5 pb-1 pt-4">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Кто видит</h4>
          </div>
          <PrivacyRow label="Последний визит" value={privacyLastSeen}
            options={[{ id: 'everyone', label: 'Все' }, { id: 'contacts', label: 'Только друзья' }, { id: 'nobody', label: 'Никто' }]}
            onChange={v => setPrivacyLastSeen(v as any)} />
          <PrivacyRow label="Фото профиля" value={privacyPhoto}
            options={[{ id: 'everyone', label: 'Все' }, { id: 'contacts', label: 'Только друзья' }, { id: 'nobody', label: 'Никто' }]}
            onChange={v => setPrivacyPhoto(v as any)} />

          <div className="h-2" />
          <div className="px-5 pb-1 pt-3">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Активность</h4>
          </div>
          <ToggleRow label="Показывать онлайн" desc="Отображать статус в сети" value={privacyOnline} onChange={setPrivacyOnline} />
          <ToggleRow label="Отчёты о прочтении" desc="Отправлять галочки ✓✓" value={privacyReadReceipts} onChange={setPrivacyReadReceipts} />
          <ToggleRow label="Индикатор набора" desc="Показывать 'печатает...'" value={privacyTyping} onChange={setPrivacyTyping} />

          <div className="h-2" />
          <div className="px-5 pb-1 pt-3">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Безопасность</h4>
          </div>
          <SettingsRow icon={Lock} iconColor="text-green-400" iconBg="bg-green-500/15" label="Пароль блокировки" subtitle="Не установлен" />
          <SettingsRow icon={Fingerprint} iconColor="text-blue-400" iconBg="bg-blue-500/15" label="Face ID / Touch ID" subtitle="Выключено" />
          <SettingsRow icon={QrCode} iconColor="text-amber-400" iconBg="bg-amber-500/15" label="Активные сессии" subtitle="1 устройство" />

          <div className="h-2" />
          <div className="px-5 pb-1 pt-3">
            <h4 className="text-red-500/60 text-[10px] font-bold uppercase tracking-wider">Опасная зона</h4>
          </div>
          <SettingsRow icon={Trash2} iconColor="text-red-400" iconBg="bg-red-500/15" label="Удалить аккаунт" subtitle="Безвозвратно удалить все данные" />

          <div className="h-20" />
        </div>
      </div>
    );
  }

  /* ─── Notifications Sub-page ─── */
  if (subPage === 'notifications') {
    return (
      <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden">
        <div className="bg-gray-900 border-b border-gray-800 px-4 pt-12 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSubPage('main')} className="p-1.5 rounded-full hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-white font-bold text-lg">Уведомления</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pb-1 pt-5">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Типы уведомлений</h4>
          </div>

          <ToggleRow label="Личные сообщения" desc="Новые сообщения от друзей"
            value={notifMessages} onChange={setNotifMessages} />
          <ToggleRow label="Сообщества" desc="Новые сообщения в группах"
            value={notifGroups} onChange={setNotifGroups} />
          <ToggleRow label="События" desc="Напоминания о мероприятиях"
            value={notifEvents} onChange={setNotifEvents} />

          <div className="h-2" />
          <div className="px-5 pb-1 pt-3">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Стиль</h4>
          </div>

          <ToggleRow label="Звуки" desc="Звук при получении сообщений"
            value={notifSounds} onChange={setNotifSounds} />
          <ToggleRow label="Вибрация" desc="Вибрация при уведомлении"
            value={notifVibrate} onChange={setNotifVibrate} />
          <ToggleRow label="Значок на иконке" desc="Показывать счётчик непрочитанных"
            value={notifBadges} onChange={setNotifBadges} />

          <div className="h-20" />
        </div>
      </div>
    );
  }

  /* ─── Data & Storage Sub-page ─── */
  if (subPage === 'dataStorage') {
    return (
      <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden">
        <div className="bg-gray-900 border-b border-gray-800 px-4 pt-12 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSubPage('main')} className="p-1.5 rounded-full hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-white font-bold text-lg">Данные и хранилище</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pb-1 pt-5">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Использование</h4>
          </div>

          <div className="mx-5 mt-2 bg-gray-900 rounded-2xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white text-sm font-medium">Всего</span>
              <span className="text-purple-400 text-sm font-bold">{dataUsageStats.total}</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Фото', value: dataUsageStats.photos, color: 'bg-blue-500', pct: 71 },
                { label: 'Голосовые', value: dataUsageStats.voice, color: 'bg-green-500', pct: 18 },
                { label: 'Другое', value: dataUsageStats.other, color: 'bg-gray-500', pct: 11 },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-gray-400 text-xs w-20">{item.label}</span>
                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="text-gray-500 text-xs w-16 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-4" />
          <div className="px-5 pb-1">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Автозагрузка медиа</h4>
          </div>

          <ToggleRow label="По Wi-Fi" desc="Автоматически загружать фото и видео"
            value={autoDownloadWifi} onChange={setAutoDownloadWifi} />
          <ToggleRow label="Мобильные данные" desc="Автозагрузка через мобильную сеть"
            value={autoDownloadMobile} onChange={setAutoDownloadMobile} />
          <ToggleRow label="Сохранять в галерею" desc="Автосохранение полученных фото"
            value={saveToGallery} onChange={setSaveToGallery} />

          <div className="h-4" />
          <button className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-gray-800/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-red-400 text-sm font-medium">Очистить кэш</p>
              <p className="text-gray-500 text-[11px]">Освободить {dataUsageStats.total}</p>
            </div>
          </button>

          <div className="h-20" />
        </div>
      </div>
    );
  }

  /* ─── Devices Sub-page ─── */
  if (subPage === 'devices') {
    return (
      <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden">
        <div className="bg-gray-900 border-b border-gray-800 px-4 pt-12 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSubPage('main')} className="p-1.5 rounded-full hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-white font-bold text-lg">Устройства</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Это устройство</p>
                <p className="text-green-400 text-[11px]">Активно сейчас</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <p>AI Reality Map Web App</p>
              <p>Браузер · {navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Браузер'}</p>
              <p>Последняя активность: Сейчас</p>
            </div>
          </div>
          <p className="text-gray-600 text-xs text-center">
            Здесь будут отображаться все активные сессии.
            Вы можете завершить сеанс на любом устройстве.
          </p>
        </div>
      </div>
    );
  }

  /* ─── Language Sub-page ─── */
  if (subPage === 'language') {
    const languages = [
      { id: 'ru', name: 'Русский', native: 'Русский', flag: '🇷🇺' },
      { id: 'kk', name: 'Казахский', native: 'Қазақша', flag: '🇰🇿' },
      { id: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
      { id: 'tr', name: 'Турецкий', native: 'Türkçe', flag: '🇹🇷' },
      { id: 'uz', name: 'Узбекский', native: "O'zbek", flag: '🇺🇿' },
      { id: 'ky', name: 'Кыргызский', native: 'Кыргызча', flag: '🇰🇬' },
    ];

    return (
      <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden">
        <div className="bg-gray-900 border-b border-gray-800 px-4 pt-12 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSubPage('main')} className="p-1.5 rounded-full hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-white font-bold text-lg">Язык</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {languages.map(l => (
            <button key={l.id} onClick={() => setLang(l.id)}
              className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-gray-800/40 transition-colors">
              <span className="text-xl">{l.flag}</span>
              <div className="flex-1 text-left">
                <p className="text-white text-sm font-medium">{l.name}</p>
                <p className="text-gray-500 text-[11px]">{l.native}</p>
              </div>
              {lang === l.id && <Check className="w-5 h-5 text-purple-400" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     MAIN SETTINGS PAGE (Telegram Style)
     ═══════════════════════════════════════════ */
  return (
    <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden">
      {/* Header with avatar */}
      <div className="bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="px-4 pt-12 pb-5">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={onBack} className="p-1.5 rounded-full hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-white font-bold text-lg">Настройки</h2>
          </div>

          {/* Profile card (TG style) */}
          <div className="flex flex-col items-center">
            {/* Hidden file input */}
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <button onClick={() => setShowPhotoOptions(true)} className="relative group mb-3">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-700 group-hover:border-purple-500 transition-colors"
                />
              ) : (
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${user.avatarGradient} flex items-center justify-center text-white text-3xl font-bold border-2 border-gray-700 group-hover:border-purple-500 transition-colors`}>
                  {user.avatarInitial}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-purple-500 border-3 border-gray-900 flex items-center justify-center shadow-lg group-hover:bg-purple-400 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </button>
            <h3 className="text-white font-bold text-xl">{user.name}</h3>
            <p className="text-gray-400 text-sm mt-0.5">@{user.username}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm">{rank.emoji}</span>
              <span className={`text-xs ${rank.color}`}>{rank.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings list */}
      <div className="flex-1 overflow-y-auto">

        {/* Section 1: Account & Chat */}
        <div className="pt-3">
          <SettingsRow icon={User} iconColor="text-purple-400" iconBg="bg-purple-500/15"
            label="Аккаунт" subtitle="Номер, никнейм, био"
            onClick={() => setSubPage('account')} />
          <SettingsRow icon={MessageSquare} iconColor="text-green-400" iconBg="bg-green-500/15"
            label="Настройки чатов" subtitle="Обои, тема, анимации"
            onClick={() => setSubPage('chatSettings')} />
          <SettingsRow icon={Shield} iconColor="text-red-400" iconBg="bg-red-500/15"
            label="Конфиденциальность" subtitle="Последний визит, устройства"
            onClick={() => setSubPage('privacy')} />
          <SettingsRow icon={Bell} iconColor="text-orange-400" iconBg="bg-orange-500/15"
            label="Уведомления" subtitle="Звуки, вибрация, значки"
            onClick={() => setSubPage('notifications')} />
        </div>

        <div className="h-2 bg-gray-900/50" />

        {/* Section 2: Data, Folders, Devices */}
        <div>
          <SettingsRow icon={Database} iconColor="text-cyan-400" iconBg="bg-cyan-500/15"
            label="Данные и хранилище" subtitle="Использование, автозагрузка"
            onClick={() => setSubPage('dataStorage')} />
          <SettingsRow icon={FolderOpen} iconColor="text-blue-400" iconBg="bg-blue-500/15"
            label="Папки чатов" subtitle="Сортировка по группам" />
          <SettingsRow icon={Smartphone} iconColor="text-gray-400" iconBg="bg-gray-500/15"
            label="Устройства" subtitle="Управление сессиями"
            onClick={() => setSubPage('devices')} />
        </div>

        <div className="h-2 bg-gray-900/50" />

        {/* Section 3: Appearance, Language */}
        <div>
          <SettingsRow icon={Palette} iconColor="text-fuchsia-400" iconBg="bg-fuchsia-500/15"
            label="Внешний вид" subtitle="Темы, цвета, неон на карте"
            onClick={onOpenAppearance} />
          <SettingsRow icon={BatteryMedium} iconColor="text-yellow-400" iconBg="bg-yellow-500/15"
            label="Энергосбережение" subtitle="Снизить анимации" />
          <SettingsRow icon={Globe} iconColor="text-violet-400" iconBg="bg-violet-500/15"
            label="Язык" subtitle={lang === 'ru' ? 'Русский' : lang === 'kk' ? 'Қазақша' : 'English'}
            onClick={() => setSubPage('language')} />
        </div>

        <div className="h-2 bg-gray-900/50" />

        {/* Section 4: Premium */}
        {onOpenSubscription && (
          <div>
            <button onClick={onOpenSubscription}
              className="w-full px-5 py-4 flex items-center gap-3 hover:bg-gray-800/40 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Crown className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white text-sm font-medium">Go+</p>
                <p className="text-violet-400/70 text-[11px]">Ghost Mode, Karma ×2, Premium Visual</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}

        <div className="h-2 bg-gray-900/50" />

        {/* Section 5: Help, About */}
        <div>
          <SettingsRow icon={HelpCircle} iconColor="text-sky-400" iconBg="bg-sky-500/15"
            label="Помощь" subtitle="Частые вопросы" />
          <SettingsRow icon={Info} iconColor="text-gray-400" iconBg="bg-gray-500/15"
            label="О приложении" subtitle="AI Reality Map v1.0" />
        </div>

        <div className="h-2 bg-gray-900/50" />

        {/* Logout */}
        <button onClick={() => setShowLogoutConfirm(true)}
          className="w-full px-5 py-4 flex items-center gap-3 hover:bg-red-500/5 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center">
            <LogOut className="w-4.5 h-4.5 text-red-400" />
          </div>
          <p className="text-red-400 text-sm font-medium">Выйти из аккаунта</p>
        </button>

        <div className="h-24" />
      </div>

      {/* Photo options bottom sheet */}
      <AnimatePresence>
        {showPhotoOptions && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center"
            onClick={() => setShowPhotoOptions(false)}>
            <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 200, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-800 rounded-t-3xl w-full max-w-lg p-5 pb-8 border-t border-gray-700">
              <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-5" />
              <h3 className="text-white font-bold text-lg text-center mb-4">Фото профиля</h3>
              <div className="space-y-1">
                <label htmlFor="avatar-upload"
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
                    <Camera className="w-4.5 h-4.5 text-purple-400" />
                  </div>
                  <span className="text-white text-sm font-medium">Выбрать фото</span>
                </label>
                {user.avatarUrl && (
                  <button onClick={handleRemovePhoto}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-gray-700 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center">
                      <Trash2 className="w-4.5 h-4.5 text-red-400" />
                    </div>
                    <span className="text-red-400 text-sm font-medium">Удалить фото</span>
                  </button>
                )}
                <button onClick={() => setShowPhotoOptions(false)}
                  className="w-full py-3 rounded-xl text-gray-400 text-sm font-medium hover:bg-gray-700 transition-colors mt-2">
                  Отмена
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout confirmation modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6"
            onClick={() => setShowLogoutConfirm(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-800 rounded-3xl p-6 w-full max-w-sm border border-gray-700">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Выйти из аккаунта?</h3>
                <p className="text-gray-400 text-sm">Данные профиля будут сохранены.</p>
              </div>
              <div className="space-y-2">
                <button onClick={() => { setShowLogoutConfirm(false); onLogout(); }}
                  className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors">
                  Да, выйти
                </button>
                <button onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-3.5 rounded-2xl bg-gray-700 hover:bg-gray-600 text-white font-semibold text-sm transition-colors">
                  Отмена
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Reusable Row Components ─── */

function SettingsRow({ icon: Icon, iconColor, iconBg, label, subtitle, right, onClick }: {
  icon: any; iconColor: string; iconBg: string; label: string; subtitle?: string; right?: React.ReactNode; onClick?: () => void;
}) {
  return (
    <button onClick={onClick}
      className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-gray-800/40 transition-colors active:bg-gray-800/60">
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="text-white text-sm font-medium">{label}</p>
        {subtitle && <p className="text-gray-500 text-[11px] truncate">{subtitle}</p>}
      </div>
      {right}
      <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
    </button>
  );
}

function ToggleRow({ label, desc, value, onChange }: {
  label: string; desc: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button onClick={() => onChange(!value)}
      className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-gray-800/40 transition-colors">
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-800/50">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-white text-sm font-medium">{value}</span>
    </div>
  );
}

function PrivacyRow({ label, value, options, onChange }: {
  label: string; value: string;
  options: { id: string; label: string }[];
  onChange: (id: string) => void;
}) {
  const current = options.find(o => o.id === value);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(!open)}
        className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-gray-800/40 transition-colors">
        <div className="flex-1 text-left">
          <p className="text-white text-sm font-medium">{label}</p>
          <p className="text-gray-500 text-[11px]">{current?.label}</p>
        </div>
        <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="px-5 pb-2 space-y-1">
              {options.map(opt => (
                <button key={opt.id} onClick={() => { onChange(opt.id); setOpen(false); }}
                  className={`w-full py-2.5 px-4 rounded-xl text-sm text-left transition-colors ${
                    value === opt.id ? 'bg-purple-500/15 text-purple-300' : 'text-gray-400 hover:bg-gray-800'
                  }`}>
                  {opt.label}
                  {value === opt.id && <Check className="w-4 h-4 inline ml-2 text-purple-400" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}