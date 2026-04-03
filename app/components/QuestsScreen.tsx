import { Trophy, MapPin, Users, Zap, Star, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { Progress } from '@/app/components/ui/progress';

export function QuestsScreen() {
  const activeQuests = [
    {
      id: '1',
      title: 'Ночной исследователь',
      description: 'Посети 3 разных места после полуночи',
      progress: 2,
      total: 3,
      reward: 500,
      emoji: '🌙',
      color: 'from-indigo-500 to-purple-500',
      timeLeft: '2 дня',
    },
    {
      id: '2',
      title: 'Социальная бабочка',
      description: 'Познакомься с 5 новыми людьми',
      progress: 3,
      total: 5,
      reward: 300,
      emoji: '🦋',
      color: 'from-pink-500 to-rose-500',
      timeLeft: '5 дней',
    },
  ];

  const availableQuests = [
    {
      id: '3',
      title: 'Вайб-хоппер',
      description: 'Посети места с разными вайбами за один день',
      difficulty: 'Средне',
      reward: 800,
      emoji: '🎯',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: '4',
      title: 'Первопроходец',
      description: 'Открой 3 новых места в городе',
      difficulty: 'Легко',
      reward: 400,
      emoji: '🗺️',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: '5',
      title: 'Король вечеринок',
      description: 'Посети все топовые клубы города',
      difficulty: 'Сложно',
      reward: 1500,
      emoji: '👑',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const lockedQuests = [
    {
      title: 'Легенда города',
      requirement: 'Уровень 20',
      emoji: '⚡',
      reward: 5000,
    },
    {
      title: 'VIP Доступ',
      requirement: 'Уровень 15',
      emoji: '💎',
      reward: 3000,
    },
  ];

  const achievements = [
    { emoji: '🏆', name: 'Первый чек-ин', unlocked: true },
    { emoji: '🔥', name: '10 мест', unlocked: true },
    { emoji: '⭐', name: '5 друзей', unlocked: true },
    { emoji: '🎯', name: 'Квестер', unlocked: true },
    { emoji: '💯', name: 'Легенда', unlocked: false },
    { emoji: '👑', name: 'Король', unlocked: false },
  ];

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-900 to-black overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 p-6 pb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Квесты</h1>
        <p className="text-orange-100 mb-6">Исследуй город и получай награды</p>

        {/* Total points */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm mb-1">Всего баллов</p>
            <p className="text-white text-3xl font-bold">2,847</p>
          </div>
          <div className="text-5xl">⚡</div>
        </div>
      </div>

      {/* Active quests */}
      <div className="p-6">
        <h2 className="text-white text-xl font-bold mb-4">Активные квесты</h2>
        <div className="space-y-4 mb-8">
          {activeQuests.map((quest, i) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-gray-800 rounded-2xl overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${quest.color} p-4`}>
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{quest.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1">{quest.title}</h3>
                    <p className="text-white/80 text-sm">{quest.description}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">
                    Прогресс: {quest.progress} / {quest.total}
                  </span>
                  <span className="text-white font-bold">+{quest.reward} ⚡</span>
                </div>
                <Progress value={(quest.progress / quest.total) * 100} className="h-2 mb-3" />
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">⏰ {quest.timeLeft}</span>
                  <button className={`px-4 py-2 rounded-xl bg-gradient-to-r ${quest.color} text-white font-semibold text-sm`}>
                    Продолжить
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Available quests */}
        <h2 className="text-white text-xl font-bold mb-4">Доступные квесты</h2>
        <div className="space-y-3 mb-8">
          {availableQuests.map((quest, i) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-gray-800 rounded-xl p-4 flex items-center gap-4"
            >
              <div className="text-4xl">{quest.emoji}</div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1">{quest.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{quest.description}</p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500">{quest.difficulty}</span>
                  <span className="text-yellow-500 font-bold">+{quest.reward} ⚡</span>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors text-white font-semibold text-sm">
                Начать
              </button>
            </motion.div>
          ))}
        </div>

        {/* Locked quests */}
        <h2 className="text-white text-xl font-bold mb-4">🔒 Секретные квесты</h2>
        <div className="space-y-3 mb-8">
          {lockedQuests.map((quest, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-gray-800/50 rounded-xl p-4 flex items-center gap-4 opacity-60"
            >
              <div className="text-4xl grayscale">{quest.emoji}</div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1">{quest.title}</h3>
                <p className="text-gray-400 text-sm">Требуется: {quest.requirement}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 font-bold text-sm">+{quest.reward} ⚡</span>
                <Lock className="w-5 h-5 text-gray-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <h2 className="text-white text-xl font-bold mb-4">Достижения</h2>
        <div className="grid grid-cols-3 gap-3">
          {achievements.map((achievement, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.03 }}
              className={`rounded-xl p-4 text-center ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                  : 'bg-gray-800/50 opacity-50'
              }`}
            >
              <div className={`text-4xl mb-2 ${!achievement.unlocked && 'grayscale'}`}>
                {achievement.emoji}
              </div>
              <p className={`text-xs font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                {achievement.name}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Leaderboard teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Топ квестеров</h3>
              <p className="text-white/80 text-sm">Ты на 12 месте</p>
            </div>
            <Trophy className="w-12 h-12 text-yellow-300" />
          </div>
          <button className="w-full py-3 rounded-xl bg-white text-purple-600 font-bold hover:bg-gray-100 transition-colors">
            Посмотреть рейтинг
          </button>
        </motion.div>
      </div>
    </div>
  );
}
