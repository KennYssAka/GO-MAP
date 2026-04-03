import { useState } from 'react';
import {
  Crown, LogOut, Ghost, Settings, Palette, Award, Tag,
  Flame, ChevronRight, UserPlus, Grid3x3, BookMarked,
  PlaySquare, Heart, MoreHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '@/app/components/UserContext';
import { EditProfileScreen } from '@/app/components/EditProfileScreen';
import { useFriends } from '@/app/components/FriendsContext';
import { useKarma } from '@/app/components/KarmaContext';
import { ProfileHeader } from './ProfileHeader';
import { ProfileStats } from './ProfileStats';
import { ProfileInterests } from './ProfileInterests';

interface ProfilePageProps {
  onLogout: () => void;
  onOpenFriends?: () => void;
  onOpenKarma?: () => void;
  onOpenO2O?: () => void;
  onOpenAchievements?: () => void;
  onOpenSubscription?: () => void;
  onOpenAppearance?: () => void;
  onOpenSettings?: () => void;
}

type ProfileTab = 'posts' | 'reels' | 'saved';

const MOCK_POSTS = [
  { id: 1, img: 'https://images.unsplash.com/photo-1689783101582-98feb9393a57?w=400&q=80', likes: 45 },
  { id: 2, img: 'https://images.unsplash.com/photo-1558966113-a817b7a17095?w=400&q=80', likes: 23 },
  { id: 3, img: 'https://images.unsplash.com/photo-1665482955116-8226c353a5f1?w=400&q=80', likes: 89 },
  { id: 4, img: 'https://images.unsplash.com/photo-1603475429038-44361bcde123?w=400&q=80', likes: 34 },
  { id: 5, img: 'https://images.unsplash.com/photo-1649473971841-75eea7a58afe?w=400&q=80', likes: 67 },
  { id: 6, img: 'https://images.unsplash.com/photo-1728219686377-509f37ff9cb9?w=400&q=80', likes: 12 },
];

export function ProfilePage({
  onLogout, onOpenFriends, onOpenKarma, onOpenO2O,
  onOpenAchievements, onOpenSubscription, onOpenAppearance, onOpenSettings,
}: ProfilePageProps) {
  const { user, toggleGhostMode } = useUser();
  const { friends, receivedRequests } = useFriends();
  const { state: karmaState, rank, todayPoints } = useKarma();
  const [showEdit, setShowEdit] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  const stats = [
    { label: 'Постов', value: MOCK_POSTS.length, onClick: undefined },
    { label: 'Друзей', value: friends.length, onClick: onOpenFriends },
    { label: 'Чек-инов', value: user.checkins, onClick: undefined },
  ];

  return (
    <>
      <div className="flex-1 bg-black overflow-y-auto pb-20">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-12 pb-3 pointer-events-none">
          <div />
          <div className="flex items-center gap-3 pointer-events-auto">
            {receivedRequests.length > 0 && (
              <button onClick={onOpenFriends} className="relative">
                <UserPlus className="w-6 h-6 text-white drop-shadow-lg" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                  {receivedRequests.length}
                </span>
              </button>
            )}
            <button onClick={() => setShowMenu(true)}>
              <MoreHorizontal className="w-6 h-6 text-white drop-shadow-lg" />
            </button>
          </div>
        </div>

        {/* VK-style header: cover + overlapping avatar */}
        <ProfileHeader
          user={user}
          rank={rank}
          friendCount={friends.length}
          onEditAvatar={() => setShowEdit(true)}
        />

        {/* Action buttons */}
        <div className="flex gap-2 px-4 mt-3 mb-1">
          <button
            onClick={() => setShowEdit(true)}
            className="flex-1 py-2 rounded-xl bg-white/[0.08] text-white text-[13px] font-semibold border border-white/[0.08] active:bg-white/[0.12] transition-colors"
          >
            Редактировать
          </button>
          <button
            onClick={onOpenSubscription}
            className="flex-1 py-2 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.4)] active:opacity-90 transition-opacity"
          >
            <Crown className="w-4 h-4" />
            Go+
          </button>
          <button
            onClick={onOpenFriends}
            className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/[0.08] flex items-center justify-center active:bg-white/[0.12] transition-colors"
          >
            <UserPlus className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Stats row */}
        <ProfileStats stats={stats} />

        {/* Karma bar */}
        <button
          onClick={onOpenKarma}
          className="mx-4 mb-3 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-2xl px-4 py-2.5 flex items-center gap-3 w-[calc(100%-2rem)] shadow-[0_0_20px_rgba(139,92,246,0.1)]"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white text-[13px] font-semibold">
              {rank.name} · {karmaState.totalKarma} karma
            </p>
            <p className="text-gray-500 text-[11px]">
              +{todayPoints} сегодня
              {karmaState.streak > 0 && ` · ${karmaState.streak} дн. стрик`}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>

        {/* Interests */}
        <ProfileInterests interests={user.interests} />

        {/* Tab bar */}
        <div className="flex border-t border-white/[0.07]">
          {([
            { id: 'posts' as ProfileTab, Icon: Grid3x3 },
            { id: 'reels' as ProfileTab, Icon: PlaySquare },
            { id: 'saved' as ProfileTab, Icon: BookMarked },
          ] as const).map(({ id, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 py-3 flex items-center justify-center transition-colors ${
                activeTab === id
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'posts' && (
            <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-3 gap-[1px]">
                {MOCK_POSTS.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="aspect-square relative overflow-hidden bg-gray-900"
                  >
                    <img src={post.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/0 active:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="flex items-center gap-1 text-white font-semibold text-xs opacity-0 active:opacity-100 transition-opacity">
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        {post.likes}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'reels' && (
            <motion.div
              key="reels"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-20 px-8 gap-4"
            >
              <div className="w-16 h-16 rounded-2xl border border-white/[0.08] flex items-center justify-center">
                <PlaySquare className="w-7 h-7 text-gray-600" />
              </div>
              <p className="text-white font-semibold text-[15px]">Нет Reels</p>
              <p className="text-gray-500 text-sm text-center">Снимай короткие видео о своём городе</p>
            </motion.div>
          )}

          {activeTab === 'saved' && (
            <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="p-4 space-y-3">
                <SavedCard
                  Icon={Award}
                  iconColor="text-violet-400"
                  iconBg="bg-violet-500/15"
                  glowColor="rgba(139,92,246,0.3)"
                  title="Достижения"
                  subtitle={`${karmaState.unlockedAchievements.length} разблокировано`}
                  onClick={onOpenAchievements}
                />
                <SavedCard
                  Icon={Tag}
                  iconColor="text-cyan-400"
                  iconBg="bg-cyan-500/15"
                  glowColor="rgba(34,211,238,0.3)"
                  title="Партнёрские предложения"
                  subtitle="7 офферов доступно"
                  onClick={onOpenO2O}
                />
                <SavedCard
                  Icon={Palette}
                  iconColor="text-fuchsia-400"
                  iconBg="bg-fuchsia-500/15"
                  glowColor="rgba(217,70,239,0.3)"
                  title="Внешний вид"
                  subtitle="Темы, цвета, стиль карты"
                  onClick={onOpenAppearance}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom sheet menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-[#0d0d0d] rounded-t-3xl max-w-md mx-auto border-t border-white/[0.06]"
            >
              <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mt-3 mb-2" />
              <div className="p-3 pb-10 space-y-1">
                <SheetBtn
                  Icon={Ghost}
                  label={user.ghostMode ? 'Выключить Ghost Mode' : 'Включить Ghost Mode'}
                  active={user.ghostMode}
                  onClick={() => { toggleGhostMode(); setShowMenu(false); }}
                />
                <SheetBtn Icon={Settings} label="Настройки" onClick={() => { onOpenSettings?.(); setShowMenu(false); }} />
                <SheetBtn Icon={Palette} label="Внешний вид" onClick={() => { onOpenAppearance?.(); setShowMenu(false); }} />
                <SheetBtn Icon={Crown} label="Go+" onClick={() => { onOpenSubscription?.(); setShowMenu(false); }} />
                <div className="h-px bg-white/[0.06] my-1" />
                <SheetBtn Icon={LogOut} label="Выйти" danger onClick={() => { setShowMenu(false); setShowLogoutConfirm(true); }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit profile */}
      <AnimatePresence>
        {showEdit && <EditProfileScreen onClose={() => setShowEdit(false)} />}
      </AnimatePresence>

      {/* Logout confirm */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#111] rounded-3xl p-6 w-full max-w-sm border border-white/[0.06]"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  <LogOut className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-white text-[17px] font-bold mb-1">Выйти?</h3>
                <p className="text-gray-500 text-[13px]">Данные профиля сохранятся.</p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => { setShowLogoutConfirm(false); onLogout(); }}
                  className="w-full py-3.5 rounded-2xl bg-red-600 text-white font-semibold text-[14px] shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                >
                  Выйти
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-3.5 rounded-2xl bg-white/[0.06] text-white font-semibold text-[14px]"
                >
                  Отмена
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Sub-components ── */

function SheetBtn({
  Icon, label, danger, active, onClick,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  danger?: boolean;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors ${
        danger  ? 'text-red-400 active:bg-red-500/10' :
        active  ? 'text-cyan-300 bg-cyan-500/10' :
                  'text-white active:bg-white/[0.06]'
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
        danger ? 'bg-red-500/15' : active ? 'bg-cyan-500/20' : 'bg-white/[0.06]'
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="font-medium text-[15px]">{label}</span>
    </button>
  );
}

function SavedCard({
  Icon, iconColor, iconBg, glowColor, title, subtitle, onClick,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  glowColor: string;
  title: string;
  subtitle: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-4 active:bg-white/[0.05] transition-colors"
    >
      <div
        className={`w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0`}
        style={{ boxShadow: `0 0 12px ${glowColor}` }}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="flex-1 text-left">
        <p className="text-white font-semibold text-[14px]">{title}</p>
        <p className="text-gray-500 text-[12px]">{subtitle}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-600" />
    </button>
  );
}
