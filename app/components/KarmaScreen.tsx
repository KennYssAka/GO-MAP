import { useState } from 'react';
import { Trophy, Star, Flame, TrendingUp, ChevronRight, Clock, Zap, Gift, Shield, Crown, Award, Target, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Progress } from '@/app/components/ui/progress';
import { useKarma, KARMA_RANKS, ACHIEVEMENTS, KARMA_ACTIONS, getRank, type KarmaAction } from './KarmaContext';

type Tab = 'overview' | 'achievements' | 'history' | 'ranks';

export function KarmaScreen({ onBack }: { onBack?: () => void }) {
  const { state, level, rank, streakMultiplier, todayPoints, todayKarma, leaderboardPosition, getActionCount, isAchievementUnlocked, getRecentHistory, earnKarma } = useKarma();
  const [tab, setTab] = useState<Tab>('overview');

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'overview', label: 'Обзор', emoji: '⚡' },
    { id: 'achievements', label: 'Ачивки', emoji: '🏆' },
    { id: 'history', label: 'История', emoji: '📜' },
    { id: 'ranks', label: 'Ранги', emoji: '👑' },
  ];

  const unlockedCount = state.unlockedAchievements.length;
  const totalAchievements = ACHIEVEMENTS.length;

  const history = getRecentHistory(30);

  // Daily tasks
  const dailyTasks = [
    { action: 'daily_login' as KarmaAction, done: (state.dailyActions['daily_login']?.date === new Date().toISOString().split('T')[0]) },
    { action: 'checkin' as KarmaAction, done: (state.dailyActions['checkin']?.date === new Date().toISOString().split('T')[0] && (state.dailyActions['checkin']?.count || 0) >= 1) },
    { action: 'post_create' as KarmaAction, done: (state.dailyActions['post_create']?.date === new Date().toISOString().split('T')[0] && (state.dailyActions['post_create']?.count || 0) >= 1) },
    { action: 'post_like' as KarmaAction, done: (state.dailyActions['post_like']?.date === new Date().toISOString().split('T')[0] && (state.dailyActions['post_like']?.count || 0) >= 3) },
  ];
  const dailyDone = dailyTasks.filter(t => t.done).length;

  // Claim daily login if not done
  const handleClaimDaily = () => {
    const today = new Date().toISOString().split('T')[0];
    const daily = state.dailyActions['daily_login'];
    if (!daily || daily.date !== today) {
      earnKarma('daily_login', 'Ежедневный вход');
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-900 to-black overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-800 p-6 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="flex items-center gap-3 mb-1 relative z-10">
          {onBack && (
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <h1 className="text-3xl font-bold text-white">Карма & Очки</h1>
        </div>
        <p className="text-purple-200 mb-6 relative z-10">Расти, исследуй, получай награды</p>

        {/* Main stats row */}
        <div className="grid grid-cols-3 gap-3 relative z-10 mb-5">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
            <p className="text-3xl font-bold text-white">{state.totalPoints.toLocaleString()}</p>
            <p className="text-white/70 text-xs">⚡ Очки</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
            <p className="text-3xl font-bold text-white">{state.totalKarma.toLocaleString()}</p>
            <p className="text-white/70 text-xs">✨ Карма</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
            <p className="text-3xl font-bold text-white">#{leaderboardPosition}</p>
            <p className="text-white/70 text-xs">📊 Рейтинг</p>
          </div>
        </div>

        {/* Level & Rank */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{rank.emoji}</span>
              <div>
                <p className="text-white font-bold text-sm">Уровень {level.level} · {rank.name}</p>
                <p className="text-white/60 text-xs">{level.currentPoints} / {level.nextLevelPoints} до следующего</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-orange-500/30 rounded-full px-2.5 py-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-orange-300 text-xs font-bold">{state.streak}д</span>
            </div>
          </div>
          <Progress value={level.progress} className="h-2.5 bg-white/20" />
          {streakMultiplier > 1 && (
            <p className="text-orange-300 text-xs mt-2 text-center">
              🔥 Серия {state.streak} дней — множитель ×{streakMultiplier.toFixed(1)} ко всем наградам!
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex bg-gray-800/50 rounded-2xl p-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                tab === t.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-400'
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-6">
        {/* ─── OVERVIEW TAB ─────────────────────── */}
        {tab === 'overview' && (
          <div className="space-y-5 pt-2">
            {/* Today's stats */}
            <div className="bg-gray-800 rounded-2xl p-4">
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Сегодня
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-400">{todayPoints}</p>
                  <p className="text-gray-400 text-xs">очков</p>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-purple-400">{todayKarma}</p>
                  <p className="text-gray-400 text-xs">кармы</p>
                </div>
              </div>
            </div>

            {/* Daily tasks */}
            <div className="bg-gray-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  Ежедневные задания
                </h3>
                <span className="text-gray-500 text-xs">{dailyDone}/{dailyTasks.length}</span>
              </div>
              <div className="space-y-2">
                {dailyTasks.map((task, i) => {
                  const config = KARMA_ACTIONS[task.action];
                  return (
                    <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${task.done ? 'bg-green-500/10' : 'bg-gray-700/30'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${task.done ? 'bg-green-500' : 'bg-gray-700'}`}>
                        {task.done ? '✓' : ''}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${task.done ? 'text-green-400 line-through' : 'text-white'}`}>
                          {config.emoji} {config.label}
                        </p>
                      </div>
                      <span className="text-yellow-400 text-xs font-bold">+{config.points}⚡</span>
                    </div>
                  );
                })}
              </div>
              {!dailyTasks[0].done && (
                <button
                  onClick={handleClaimDaily}
                  className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm"
                >
                  Забрать дневной бонус 🎁
                </button>
              )}
              {dailyDone === dailyTasks.length && (
                <p className="text-green-400 text-center text-xs mt-3 font-medium">
                  ✅ Все задания выполнены! Отлично!
                </p>
              )}
            </div>

            {/* How to earn */}
            <div className="bg-gray-800 rounded-2xl p-4">
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Как заработать
              </h3>
              <div className="space-y-2">
                {([
                  'checkin', 'event_attend', 'event_create', 'post_create', 'friend_add',
                  'quest_complete', 'route_complete', 'explore_newplace', 'match_connect',
                ] as KarmaAction[]).map(action => {
                  const config = KARMA_ACTIONS[action];
                  const count = getActionCount(action);
                  return (
                    <div key={action} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/30 transition-colors">
                      <span className="text-xl w-8 text-center">{config.emoji}</span>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{config.label}</p>
                        <p className="text-gray-500 text-xs">{config.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 text-xs font-bold">+{config.points}⚡ +{config.karma}✨</p>
                        {count > 0 && <p className="text-gray-500 text-[10px]">×{count} раз</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Streak info */}
            <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-white font-bold text-lg">🔥 Серия: {state.streak} дней</h3>
                  <p className="text-white/80 text-sm">Множитель: ×{streakMultiplier.toFixed(1)}</p>
                </div>
                <div className="text-5xl">🔥</div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[3, 7, 14, 30].map(days => (
                  <div key={days} className={`text-center p-2 rounded-xl ${state.streak >= days ? 'bg-white/20' : 'bg-black/20'}`}>
                    <p className={`text-sm font-bold ${state.streak >= days ? 'text-white' : 'text-white/40'}`}>
                      {days}д
                    </p>
                    <p className={`text-xs ${state.streak >= days ? 'text-orange-200' : 'text-white/30'}`}>
                      ×{days >= 30 ? '3.0' : days >= 14 ? '2.5' : days >= 7 ? '2.0' : '1.5'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Perks */}
            <div className="bg-gray-800 rounded-2xl p-4">
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-400" />
                Ваши привилегии · {rank.emoji} {rank.name}
              </h3>
              <div className="space-y-2">
                {rank.perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">{perk}</span>
                  </div>
                ))}
                {/* Show next rank perks */}
                {(() => {
                  const nextIdx = KARMA_RANKS.findIndex(r => r.minKarma > state.totalKarma);
                  if (nextIdx < 0) return null;
                  const next = KARMA_RANKS[nextIdx];
                  const newPerks = next.perks.filter(p => !rank.perks.includes(p));
                  if (newPerks.length === 0) return null;
                  return (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <p className="text-gray-500 text-xs mb-1.5">
                        Следующий ранг: {next.emoji} {next.name} ({next.minKarma - state.totalKarma} кармы)
                      </p>
                      {newPerks.map((perk, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">🔒</span>
                          <span className="text-gray-500">{perk}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ─── ACHIEVEMENTS TAB ────────────────── */}
        {tab === 'achievements' && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">{unlockedCount} / {totalAchievements} разблокировано</p>
              <Progress value={(unlockedCount / totalAchievements) * 100} className="w-24 h-2 bg-gray-700" />
            </div>

            {ACHIEVEMENTS.map((ach) => {
              const unlocked = isAchievementUnlocked(ach.id);
              const count = ach.trackAction ? getActionCount(ach.trackAction) : 
                ach.condition === 'karma' ? state.totalKarma :
                ach.condition === 'streak' ? state.streak : 0;
              const progress = Math.min((count / ach.requiredCount) * 100, 100);

              return (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl overflow-hidden ${unlocked ? '' : 'opacity-70'}`}
                >
                  <div className={`p-4 ${unlocked ? `bg-gradient-to-r ${ach.gradient}` : 'bg-gray-800'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${unlocked ? 'bg-white/20' : 'bg-gray-700'}`}>
                        {unlocked ? ach.emoji : '🔒'}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${unlocked ? 'text-white' : 'text-gray-300'}`}>
                          {ach.title}
                        </p>
                        <p className={`text-xs ${unlocked ? 'text-white/80' : 'text-gray-500'}`}>
                          {ach.description}
                        </p>
                        {!unlocked && (
                          <div className="mt-1.5">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-500 text-[10px]">{count}/{ach.requiredCount}</span>
                            </div>
                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${ach.gradient}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      {unlocked && (
                        <div className="text-white/80">
                          <Award className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ─── HISTORY TAB ─────────────────────── */}
        {tab === 'history' && (
          <div className="space-y-2 pt-2">
            {history.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-3">📜</p>
                <p className="text-gray-400 text-sm">История пока пуста</p>
                <p className="text-gray-500 text-xs mt-1">Начните исследовать город и зарабатывать очки!</p>
              </div>
            ) : (
              history.map((entry) => {
                const config = KARMA_ACTIONS[entry.action];
                const time = new Date(entry.timestamp);
                const isToday = time.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
                const timeStr = isToday
                  ? time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                  : time.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + ' ' + time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={entry.id} className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-xl">
                      {config?.emoji || '⚡'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{config?.label || entry.action}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{timeStr}</span>
                        {entry.detail && <span>· {entry.detail}</span>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-yellow-400 text-xs font-bold">+{entry.points}⚡</p>
                      <p className="text-purple-400 text-[10px]">+{entry.karma}✨</p>
                      {entry.multiplier && entry.multiplier > 1 && (
                        <p className="text-orange-400 text-[10px]">×{entry.multiplier.toFixed(1)}🔥</p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ─── RANKS TAB ──────────────────────── */}
        {tab === 'ranks' && (
          <div className="space-y-3 pt-2">
            {KARMA_RANKS.map((r, i) => {
              const isCurrentRank = r === rank;
              const isUnlocked = state.totalKarma >= r.minKarma;
              const isNext = !isUnlocked && (i === 0 || state.totalKarma >= KARMA_RANKS[i - 1].minKarma);

              return (
                <div
                  key={r.name}
                  className={`rounded-2xl overflow-hidden transition-all ${
                    isCurrentRank ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/20' : ''
                  }`}
                >
                  <div className={`p-4 ${
                    isCurrentRank ? `bg-gradient-to-r ${r.gradient}` :
                    isUnlocked ? 'bg-gray-800' : 'bg-gray-800/50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                        isUnlocked ? 'bg-white/20' : 'bg-gray-700/50'
                      }`}>
                        {isUnlocked ? r.emoji : '🔒'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className={`font-bold text-base ${isCurrentRank ? 'text-white' : isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                            {r.name}
                          </p>
                          {isCurrentRank && (
                            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">ТЕКУЩИЙ</span>
                          )}
                        </div>
                        <p className={`text-xs ${isCurrentRank ? 'text-white/70' : 'text-gray-500'}`}>
                          {r.minKarma}+ кармы
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {r.perks.map((perk, j) => (
                            <span key={j} className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              isCurrentRank ? 'bg-white/15 text-white/80' : isUnlocked ? 'bg-gray-700 text-gray-400' : 'bg-gray-700/50 text-gray-600'
                            }`}>
                              {perk}
                            </span>
                          ))}
                        </div>
                      </div>
                      {isNext && (
                        <div className="text-right">
                          <p className="text-purple-400 text-xs font-bold">
                            {r.minKarma - state.totalKarma}
                          </p>
                          <p className="text-gray-500 text-[10px]">до ранга</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}