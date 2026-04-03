import { X, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface VibeForecastProps {
  onClose: () => void;
}

export function VibeForecast({ onClose }: VibeForecastProps) {
  const forecast = [
    { time: '18:00', vibe: '☕', label: 'Спокойно', intensity: 45, color: 'from-blue-400 to-cyan-400' },
    { time: '20:00', vibe: '🔥', label: 'Разогрев', intensity: 68, color: 'from-yellow-500 to-orange-500' },
    { time: '22:00', vibe: '🔥', label: 'ПИК!', intensity: 95, color: 'from-red-500 to-pink-500' },
    { time: '00:00', vibe: '🎶', label: 'Максимум', intensity: 92, color: 'from-purple-500 to-pink-500' },
    { time: '02:00', vibe: '🎶', label: 'Афтепати', intensity: 72, color: 'from-purple-500 to-indigo-500' },
    { time: '04:00', vibe: '😴', label: 'Затухает', intensity: 35, color: 'from-gray-500 to-gray-600' },
  ];

  const weekForecast = [
    { day: 'ПН', vibe: '💼', intensity: 55 },
    { day: 'ВТ', vibe: '💼', intensity: 58 },
    { day: 'СР', vibe: '🔥', intensity: 72 },
    { day: 'ЧТ', vibe: '🔥', intensity: 78 },
    { day: 'ПТ', vibe: '🔥', intensity: 95 },
    { day: 'СБ', vibe: '🎉', intensity: 98 },
    { day: 'ВС', vibe: '☕', intensity: 62 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/80 backdrop-blur-lg z-30 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">📊 Прогноз вайба</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Today forecast */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Сегодня
          </h3>
          <div className="space-y-3">
            {forecast.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-800 rounded-xl p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{item.vibe}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-white font-semibold">{item.time}</span>
                        <span className="text-gray-400 text-sm ml-2">{item.label}</span>
                      </div>
                      <span className="text-white font-bold">{item.intensity}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${item.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.intensity}%` }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Week forecast */}
        <div>
          <h3 className="text-white font-semibold mb-4">На неделю</h3>
          <div className="grid grid-cols-7 gap-2">
            {weekForecast.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-800 rounded-xl p-3 text-center"
              >
                <p className="text-gray-400 text-xs mb-2">{item.day}</p>
                <div className="text-3xl mb-2">{item.vibe}</div>
                <div className="h-1 bg-gray-700 rounded-full overflow-hidden mb-1">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.intensity}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                  />
                </div>
                <p className="text-white text-xs font-bold">{item.intensity}%</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">🤖</div>
            <div>
              <p className="text-white font-semibold mb-1">AI рекомендует</p>
              <p className="text-white/90 text-sm">
                Лучшее время для нетворкинга — среда 19:00. Пиковая активность в пятницу 23:00 🔥
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
