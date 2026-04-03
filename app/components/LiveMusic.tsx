import { X, Play, Music2, MapPin, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface LiveMusicProps {
  onClose: () => void;
}

export function LiveMusic({ onClose }: LiveMusicProps) {
  const liveNow = [
    {
      place: 'Khan Shatyr Club',
      dj: 'DJ Groove',
      genre: 'Techno',
      track: 'Underground Vibes',
      listeners: 89,
      distance: '1.2 км',
      vibe: '🔥',
      color: 'from-purple-500 to-pink-500',
    },
    {
      place: 'Mega Silk Way Bar',
      dj: 'Live Band',
      genre: 'Rock',
      track: 'Seven Nation Army',
      listeners: 42,
      distance: '0.5 км',
      vibe: '🎸',
      color: 'from-red-500 to-orange-500',
    },
    {
      place: 'Astana Jazz Club',
      dj: 'Sarah & Trio',
      genre: 'Jazz',
      track: 'Blue Bossa',
      listeners: 28,
      distance: '2.1 км',
      vibe: '🎷',
      color: 'from-blue-500 to-indigo-500',
    },
  ];

  const trending = [
    { track: 'Midnight City', artist: 'M83', plays: 247 },
    { track: 'Starboy', artist: 'The Weeknd', plays: 189 },
    { track: 'Blinding Lights', artist: 'The Weeknd', plays: 156 },
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
          <h2 className="text-2xl font-bold text-white">🎵 Что играет сейчас</h2>
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
            className="w-3 h-3 rounded-full bg-green-500"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
          <span className="text-gray-400 text-sm">Live музыка в городе</span>
        </div>

        {/* Live places */}
        <div className="space-y-4 mb-8">
          {liveNow.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-800 rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${item.color} p-4`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-bold">{item.place}</h3>
                    <p className="text-white/80 text-sm">{item.dj}</p>
                  </div>
                  <div className="text-2xl">{item.vibe}</div>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{item.distance}</span>
                  <Users className="w-4 h-4 ml-2" />
                  <span>{item.listeners}</span>
                </div>
              </div>

              {/* Current track */}
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                    }}
                  >
                    <Music2 className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{item.track}</p>
                    <p className="text-gray-400 text-sm">{item.genre}</p>
                  </div>
                </div>

                {/* Waveform animation */}
                <div className="flex items-end justify-center gap-1 h-16 mb-3">
                  {Array.from({ length: 30 }).map((_, j) => (
                    <motion.div
                      key={j}
                      className={`w-1 bg-gradient-to-t ${item.color} rounded-full`}
                      animate={{
                        height: [
                          `${20 + Math.random() * 40}%`,
                          `${30 + Math.random() * 50}%`,
                          `${20 + Math.random() * 40}%`,
                        ],
                      }}
                      transition={{
                        duration: 0.5 + Math.random() * 0.5,
                        repeat: Infinity,
                        delay: j * 0.02,
                      }}
                    />
                  ))}
                </div>

                <button className="w-full py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors text-white font-semibold flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Послушать превью
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trending */}
        <div>
          <h3 className="text-white font-semibold mb-3">🔥 Популярно в городе</h3>
          <div className="space-y-2">
            {trending.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="bg-gray-800 rounded-xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-bold">#{i + 1}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.track}</p>
                    <p className="text-gray-400 text-xs">{item.artist}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">{item.plays} plays</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Spotify integration hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎧</div>
            <div>
              <p className="text-white font-semibold mb-1">Подключи Spotify</p>
              <p className="text-white/90 text-sm">
                Получай плейлисты под вайб каждого места
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
