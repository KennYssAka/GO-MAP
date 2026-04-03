import { useState, useMemo } from 'react';
import { ArrowLeft, Trophy, Lock, Sparkles, ChevronRight, Award, Target, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EXTENDED_ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, type AchievementCategory, type ExtendedAchievement } from './achievementsData';
import { useKarma } from './KarmaContext';

interface AchievementsScreenProps {
  onBack: () => void;
}

export function AchievementsScreen({ onBack }: AchievementsScreenProps) {
  const { state: karmaState } = useKarma();
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<ExtendedAchievement | null>(null);

  // Mock progress data - in real app this would come from user's state
  const getUserProgress = (trackKey: string): number => {
    const mockProgress: Record<string, number> = {
      turkish_restaurants: 2,
      italian_restaurants: 5,
      asian_restaurants: 8,
      cafes_visited: 12,
      nightlife_visited: 4,
      raves_visited: 1,
      events_attended: 7,
      places_visited: 15,
      group_visits: 6,
      countries_visited: 3,
      photos_uploaded: 18,
      places_added: 2,
      edits_confirmed: 5,
      detailed_reviews: 3,
      night_checkins: 7,
      helpful_answers: 4,
      login_streak: karmaState.streak,
      coupons_activated: 3,
      referrals_ranked: 1,
      photos_with_likes: 22,
      local_events_joined: 2,
    };
    return mockProgress[trackKey] || 0;
  };

  const achievementsWithProgress = useMemo(() => {
    return EXTENDED_ACHIEVEMENTS.map(ach => {
      const progress = getUserProgress(ach.trackKey);
      const isUnlocked = progress >= ach.requiredCount;
      const progressPercent = Math.min((progress / ach.requiredCount) * 100, 100);
      return { ...ach, progress, isUnlocked, progressPercent };
    });
  }, [karmaState.streak]);

  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'all') return achievementsWithProgress;
    return achievementsWithProgress.filter(a => a.category === selectedCategory);
  }, [achievementsWithProgress, selectedCategory]);

  const unlockedCount = achievementsWithProgress.filter(a => a.isUnlocked).length;
  const totalCount = achievementsWithProgress.length;
  const totalKarmaEarned = achievementsWithProgress
    .filter(a => a.isUnlocked)
    .reduce((sum, a) => sum + a.karmaReward, 0);

  const categories: Array<{ id: AchievementCategory | 'all'; label: string; emoji: string }> = [
    { id: 'all', label: 'Все', emoji: '✨' },
    ...Object.entries(ACHIEVEMENT_CATEGORIES).map(([id, info]) => ({
      id: id as AchievementCategory,
      label: info.name,
      emoji: info.emoji,
    })),
  ];

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-900 to-black overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 p-5 pb-6 relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl" />

        <div className="flex items-center gap-3 mb-5 relative z-10">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Достижения
            </h1>
            <p className="text-indigo-200 text-xs">Собирай ачивки и зарабатывай карму</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{unlockedCount}/{totalCount}</div>
            <div className="text-white/70 text-[10px] mt-0.5">Разблокировано</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">{totalKarmaEarned}</div>
            <div className="text-white/70 text-[10px] mt-0.5">Карма получена</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-emerald-400">{Math.round((unlockedCount / totalCount) * 100)}%</div>
            <div className="text-white/70 text-[10px] mt-0.5">Завершено</div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => {
            const catAchievements = cat.id === 'all' 
              ? achievementsWithProgress 
              : achievementsWithProgress.filter(a => a.category === cat.id);
            const catUnlocked = catAchievements.filter(a => a.isUnlocked).length;
            
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedCategory === cat.id ? 'bg-white/20' : 'bg-gray-700'
                }`}>
                  {catUnlocked}/{catAchievements.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="grid grid-cols-2 gap-3 py-3">
          {filteredAchievements.map((ach, idx) => (
            <motion.button
              key={ach.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => setSelectedAchievement(ach)}
              className={`relative rounded-2xl overflow-hidden p-4 text-left transition-all ${
                ach.isUnlocked
                  ? 'bg-gradient-to-br ' + ach.gradient + ' shadow-lg active:scale-95'
                  : 'bg-gray-800 border border-gray-700 active:scale-95'
              }`}
            >
              {/* Lock overlay */}
              {!ach.isUnlocked && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-gray-500" />
                </div>
              )}

              {/* Tier badge */}
              <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                ach.tier === 3 ? 'bg-yellow-500 text-yellow-900' :
                ach.tier === 2 ? 'bg-gray-300 text-gray-700' :
                'bg-amber-700 text-amber-200'
              }`}>
                {ach.tier}
              </div>

              {/* Icon */}
              <div className="text-4xl mb-2">{ach.emoji}</div>

              {/* Title */}
              <h3 className={`text-sm font-bold mb-1 ${ach.isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                {ach.title}
              </h3>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className={ach.isUnlocked ? 'text-white/80' : 'text-gray-500'}>
                    {ach.progress}/{ach.requiredCount}
                  </span>
                  <span className={ach.isUnlocked ? 'text-white/80' : 'text-gray-500'}>
                    {Math.round(ach.progressPercent)}%
                  </span>
                </div>
                <div className="h-1 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${ach.isUnlocked ? 'bg-white' : 'bg-gray-600'}`}
                    style={{ width: `${ach.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Rewards */}
              {ach.isUnlocked && (
                <div className="flex items-center gap-2 mt-2 text-[10px] text-white/90">
                  <span className="flex items-center gap-0.5">
                    <Flame className="w-3 h-3" /> +{ach.karmaReward}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3" /> +{ach.pointsReward}
                  </span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAchievement(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-gray-900 rounded-3xl p-6 z-50 max-w-md mx-auto border border-gray-700 shadow-2xl"
            >
              <button
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center active:scale-95"
              >
                ×
              </button>

              {/* Icon */}
              <div className="text-center mb-4">
                <div className={`w-24 h-24 rounded-3xl mx-auto flex items-center justify-center text-5xl mb-3 ${
                  selectedAchievement.isUnlocked
                    ? 'bg-gradient-to-br ' + selectedAchievement.gradient
                    : 'bg-gray-800'
                }`}>
                  {selectedAchievement.isUnlocked ? selectedAchievement.emoji : <Lock className="w-12 h-12 text-gray-600" />}
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{selectedAchievement.title}</h2>
                <p className="text-gray-400 text-sm">{selectedAchievement.description}</p>
              </div>

              {/* Category & Tier */}
              <div className="flex items-center gap-2 justify-center mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  ACHIEVEMENT_CATEGORIES[selectedAchievement.category].color
                } bg-gray-800`}>
                  {ACHIEVEMENT_CATEGORIES[selectedAchievement.category].emoji} {ACHIEVEMENT_CATEGORIES[selectedAchievement.category].name}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedAchievement.tier === 3 ? 'bg-yellow-500 text-yellow-900' :
                  selectedAchievement.tier === 2 ? 'bg-gray-400 text-gray-900' :
                  'bg-amber-700 text-amber-100'
                }`}>
                  Уровень {selectedAchievement.tier}
                </span>
              </div>

              {/* Progress */}
              <div className="bg-gray-800 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-bold">Прогресс</span>
                  <span className="text-gray-400 text-sm">
                    {selectedAchievement.progress}/{selectedAchievement.requiredCount}
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
                    style={{ width: `${selectedAchievement.progressPercent}%` }}
                  />
                </div>
                <p className="text-gray-500 text-xs">
                  {selectedAchievement.isUnlocked 
                    ? '✅ Достижение разблокировано!' 
                    : `Ещё ${selectedAchievement.requiredCount - selectedAchievement.progress} до разблокировки`}
                </p>
              </div>

              {/* Rewards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded-xl p-3 text-center">
                  <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                  <div className="text-white font-bold">+{selectedAchievement.karmaReward}</div>
                  <div className="text-gray-500 text-xs">Карма</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-3 text-center">
                  <Sparkles className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                  <div className="text-white font-bold">+{selectedAchievement.pointsReward}</div>
                  <div className="text-gray-500 text-xs">Очки</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
