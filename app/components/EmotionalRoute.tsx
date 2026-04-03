import { X, Navigation, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface EmotionalRouteProps {
  onClose: () => void;
}

export function EmotionalRoute({ onClose }: EmotionalRouteProps) {
  const routes = [
    {
      name: '🔥 Взрывной вечер',
      duration: '3 часа',
      vibe: 'Максимум энергии',
      stops: [
        { place: 'Khan Shatyr', time: '18:00', vibe: '💼', activity: 'Шопинг' },
        { place: 'Mega Silk Way', time: '20:00', vibe: '🔥', activity: 'Ужин' },
        { place: 'Bayterek Area', time: '22:00', vibe: '🎶', activity: 'Клубы' },
      ],
      color: 'from-red-500 to-orange-500',
    },
    {
      name: '☕ Спокойный день',
      duration: '4 часа',
      vibe: 'Расслабление',
      stops: [
        { place: 'Central Park', time: '12:00', vibe: '☕', activity: 'Прогулка' },
        { place: 'Astana Opera', time: '15:00', vibe: '🎭', activity: 'Культура' },
        { place: 'Nur-Astana Mosque', time: '17:00', vibe: '🕌', activity: 'Тишина' },
      ],
      color: 'from-blue-400 to-cyan-400',
    },
    {
      name: '❤️ Романтический вечер',
      duration: '5 часов',
      vibe: 'Love story',
      stops: [
        { place: 'Bayterek Tower', time: '19:00', vibe: '🌅', activity: 'Закат' },
        { place: 'Ресторан у реки', time: '20:30', vibe: '🍝', activity: 'Ужин' },
        { place: 'Khan Shatyr Roof', time: '22:30', vibe: '⭐', activity: 'Звёзды' },
      ],
      color: 'from-pink-500 to-rose-500',
    },
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
          <h2 className="text-2xl font-bold text-white">🗺️ Эмоциональные маршруты</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <p className="text-gray-400 mb-6">
          AI строит маршруты не по расстоянию, а по эмоциям и вайбу
        </p>

        {/* Routes */}
        <div className="space-y-4">
          {routes.map((route, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-800 rounded-2xl overflow-hidden"
            >
              {/* Route header */}
              <div className={`bg-gradient-to-r ${route.color} p-4`}>
                <h3 className="text-white font-bold text-lg mb-1">{route.name}</h3>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <span>⏱️ {route.duration}</span>
                  <span>• {route.vibe}</span>
                </div>
              </div>

              {/* Stops */}
              <div className="p-4 space-y-3">
                {route.stops.map((stop, j) => (
                  <div key={j} className="flex items-start gap-3">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${route.color} flex items-center justify-center text-white font-bold`}>
                        {j + 1}
                      </div>
                      {j < route.stops.length - 1 && (
                        <div className={`w-0.5 h-12 bg-gradient-to-b ${route.color} opacity-30 my-1`} />
                      )}
                    </div>

                    {/* Stop info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-semibold">{stop.place}</span>
                        <span className="text-gray-400 text-sm">{stop.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{stop.vibe}</span>
                        <span className="text-gray-400 text-sm">{stop.activity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action button */}
              <div className="p-4 pt-0">
                <button className={`w-full py-3 rounded-xl bg-gradient-to-r ${route.color} text-white font-semibold hover:opacity-90 transition-opacity`}>
                  Начать маршрут
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom route */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <button className="w-full py-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-white font-semibold flex items-center justify-center gap-2">
            <Navigation className="w-5 h-5" />
            Создать свой маршрут
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}