import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface CityPulseProps {
  onClose: () => void;
}

export function CityPulse({ onClose }: CityPulseProps) {
  // Mock realtime data
  const pulseData = {
    overall: 78,
    zones: [
      { name: 'Центр (Bayterek)', pulse: 92, trend: 'up', color: 'from-red-500 to-orange-500' },
      { name: 'Khan Shatyr', pulse: 85, trend: 'up', color: 'from-purple-500 to-pink-500' },
      { name: 'EXPO District', pulse: 67, trend: 'stable', color: 'from-yellow-500 to-orange-500' },
      { name: 'Mega Silk Way', pulse: 54, trend: 'down', color: 'from-blue-400 to-cyan-400' },
    ],
    activeNow: 2847,
    peakTime: '22:30',
  };

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
          <h2 className="text-2xl font-bold text-white">🔴 Пульс города</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 mb-6">
          <motion.div
            className="w-3 h-3 rounded-full bg-red-500"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
          <span className="text-gray-400 text-sm">Обновляется в реальном времени</span>
        </div>

        {/* Overall pulse */}
        <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-6 mb-6">
          <div className="text-center">
            <p className="text-white/80 text-sm mb-2">Активность города</p>
            <div className="relative">
              <motion.div
                className="text-7xl font-bold text-white"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                {pulseData.overall}%
              </motion.div>
              {/* Heartbeat effect */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                <div className="w-32 h-32 rounded-full bg-white/20" />
              </motion.div>
            </div>
            <p className="text-white/80 text-sm mt-2">{pulseData.activeNow} человек сейчас активны</p>
          </div>
        </div>

        {/* Zones */}
        <div className="space-y-3 mb-6">
          <h3 className="text-white font-semibold">По районам</h3>
          {pulseData.zones.map((zone, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-800 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">{zone.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-lg font-bold">{zone.pulse}%</span>
                  <span className="text-2xl">
                    {zone.trend === 'up' ? '📈' : zone.trend === 'down' ? '📉' : '➡️'}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${zone.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${zone.pulse}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Peak time prediction */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">⚡</div>
            <div>
              <p className="text-gray-400 text-sm">Пиковая активность ожидается</p>
              <p className="text-white text-xl font-bold">{pulseData.peakTime}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}