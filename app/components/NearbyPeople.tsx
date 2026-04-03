import { X, Heart, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';

interface NearbyPeopleProps {
  onClose: () => void;
}

export function NearbyPeople({ onClose }: NearbyPeopleProps) {
  const nearbyPeople = [
    {
      name: 'Айгерим',
      age: 24,
      interests: ['🎶 Музыка', '💼 Бизнес'],
      vibe: '🔥 Активная',
      match: 92,
      distance: '250 м',
      location: 'Khan Shatyr',
      bio: 'Event-менеджер, люблю техно и стартапы',
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Нурлан',
      age: 28,
      interests: ['💼 Нетворкинг', '☕ Кофе'],
      vibe: '💡 Креативный',
      match: 85,
      distance: '420 м',
      location: 'Mega Silk Way',
      bio: 'Founder в EdTech, ищу партнёров',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      name: 'Асель',
      age: 26,
      interests: ['🎉 Тусовки', '🎶 Музыка'],
      vibe: '✨ Вдохновлённая',
      match: 78,
      distance: '1.2 км',
      location: 'Bayterek Area',
      bio: 'Продюсер, организую события',
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
          <h2 className="text-2xl font-bold text-white">👥 Люди рядом</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <p className="text-gray-400 mb-6">
          AI подобрал людей с похожими интересами, которые сейчас в твоём районе
        </p>

        {/* People cards */}
        <div className="space-y-4">
          {nearbyPeople.map((person, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-800 rounded-2xl overflow-hidden"
            >
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${person.color} p-4 relative`}>
                {/* Match badge */}
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-white font-bold text-sm">{person.match}%</span>
                </div>

                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-2xl font-bold">
                      {person.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-xl mb-1">
                      {person.name}, {person.age}
                    </h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{person.distance}</span>
                    </div>
                    <p className="text-white/80 text-sm">{person.vibe}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Location */}
                <div className="bg-gray-700/50 rounded-xl px-3 py-2 mb-3 flex items-center gap-2">
                  <div className="text-lg">📍</div>
                  <span className="text-white text-sm">Сейчас в {person.location}</span>
                </div>

                {/* Bio */}
                <p className="text-gray-300 text-sm mb-3">{person.bio}</p>

                {/* Interests */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {person.interests.map((interest, j) => (
                    <span
                      key={j}
                      className="px-3 py-1 rounded-full bg-gray-700 text-white text-xs font-semibold"
                    >
                      {interest}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${person.color} text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}>
                    <Heart className="w-4 h-4" />
                    Интересно
                  </button>
                  <button className="px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors text-white">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Settings hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-gray-800 rounded-xl p-4"
        >
          <p className="text-gray-400 text-sm text-center">
            🔒 Твоя точная геолокация скрыта. Показываем только район.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}