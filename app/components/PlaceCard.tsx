import { X, Users, MessageCircle, Heart, ThumbsUp, Mic, Gift, Music, Share2, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

interface Place {
  id: string;
  name: string;
  type: string;
  vibe: string;
  vibeLabel: string;
  peopleCount: number;
  emotions: {
    fire: number;
    love: number;
    cool: number;
    sleepy: number;
  };
  description: string;
  image: string | null;
}

interface PlaceCardProps {
  place: Place;
  onClose: () => void;
}

export function PlaceCard({ place, onClose }: PlaceCardProps) {
  // Mock active users
  const activeUsers = [
    { id: '1', name: 'Анна', avatar: null },
    { id: '2', name: 'Макс', avatar: null },
    { id: '3', name: 'Лена', avatar: null },
    { id: '4', name: 'Иван', avatar: null },
  ];

  // Mock comments
  const comments = [
    { id: '1', user: 'Саша', text: 'Крутое место! 🔥', time: '5 мин назад' },
    { id: '2', user: 'Даша', text: 'Отличная атмосфера', time: '12 мин назад' },
  ];

  // Mock voice notes
  const voiceNotes = [
    { id: '1', user: 'Макс', duration: '0:45', time: '10 мин назад' },
    { id: '2', user: 'Катя', duration: '1:23', time: '1 час назад' },
  ];

  // Mock time capsules
  const timeCapsules = [
    { id: '1', message: '🎉 Секретное послание откроется в 23:00', time: '23:00', locked: true },
    { id: '2', message: 'Лучшая ночь! Спасибо всем 💜', time: 'вчера', locked: false },
  ];

  // Mock playlist
  const playlist = [
    { track: 'Midnight City', artist: 'M83', addedBy: 'Анна' },
    { track: 'Blinding Lights', artist: 'The Weeknd', addedBy: 'Макс' },
    { track: 'One More Time', artist: 'Daft Punk', addedBy: 'Лена' },
  ];

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl shadow-2xl z-20 max-h-[85vh] overflow-hidden flex flex-col"
    >
      {/* Handle */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-12 h-1.5 bg-gray-700 rounded-full" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{place.name}</h2>
            <p className="text-gray-400">{place.description}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Vibe Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold mb-4">
          <span>{place.vibeLabel}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400 text-sm">Сейчас здесь</span>
            </div>
            <p className="text-2xl font-bold text-white">{place.peopleCount}</p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Отзывы</span>
            </div>
            <p className="text-2xl font-bold text-white">127</p>
          </div>
        </div>

        {/* Emotions */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Эмоции</h3>
          <div className="flex gap-3">
            <button className="flex-1 bg-gray-800 rounded-xl p-3 hover:bg-gray-700 transition-colors">
              <div className="text-3xl mb-1">🔥</div>
              <div className="text-white font-semibold">{place.emotions.fire}</div>
            </button>
            <button className="flex-1 bg-gray-800 rounded-xl p-3 hover:bg-gray-700 transition-colors">
              <div className="text-3xl mb-1">😍</div>
              <div className="text-white font-semibold">{place.emotions.love}</div>
            </button>
            <button className="flex-1 bg-gray-800 rounded-xl p-3 hover:bg-gray-700 transition-colors">
              <div className="text-3xl mb-1">😎</div>
              <div className="text-white font-semibold">{place.emotions.cool}</div>
            </button>
            <button className="flex-1 bg-gray-800 rounded-xl p-3 hover:bg-gray-700 transition-colors">
              <div className="text-3xl mb-1">😴</div>
              <div className="text-white font-semibold">{place.emotions.sleepy}</div>
            </button>
          </div>
        </div>

        {/* Active People */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Активные люди</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {activeUsers.map((user) => (
              <div key={user.id} className="flex flex-col items-center gap-2 min-w-[70px]">
                <Avatar className="w-14 h-14 border-2 border-purple-500">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                    {user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-400">{user.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* НОВЫЕ КРУТЫЕ ФИЧИ - Tabs */}
        <Tabs defaultValue="comments" className="mb-6">
          <TabsList className="w-full bg-gray-800 grid grid-cols-4 mb-4">
            <TabsTrigger value="comments" className="text-xs">💬 Чат</TabsTrigger>
            <TabsTrigger value="voice" className="text-xs">🎤 Войс</TabsTrigger>
            <TabsTrigger value="capsules" className="text-xs">⏰ Капсулы</TabsTrigger>
            <TabsTrigger value="music" className="text-xs">🎵 Музыка</TabsTrigger>
          </TabsList>

          {/* Comments */}
          <TabsContent value="comments" className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                      {comment.user[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold">{comment.user}</span>
                      <span className="text-gray-500 text-xs">{comment.time}</span>
                    </div>
                    <p className="text-gray-300">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-white font-semibold">
              Написать комментарий
            </button>
          </TabsContent>

          {/* Voice Notes */}
          <TabsContent value="voice" className="space-y-3">
            {voiceNotes.map((note) => (
              <div key={note.id} className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                      {note.user[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">{note.user}</span>
                      <span className="text-gray-500 text-xs">{note.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="w-10 h-10 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors flex items-center justify-center">
                        <Mic className="w-5 h-5 text-white" />
                      </button>
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-gradient-to-r from-purple-500 to-pink-500" />
                      </div>
                      <span className="text-gray-400 text-sm">{note.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 transition-opacity text-white font-semibold flex items-center justify-center gap-2">
              <Mic className="w-5 h-5" />
              Записать голосовое
            </button>
          </TabsContent>

          {/* Time Capsules */}
          <TabsContent value="capsules" className="space-y-3">
            <p className="text-gray-400 text-sm mb-3">
              Оставь послание, которое откроется в определённое время
            </p>
            {timeCapsules.map((capsule) => (
              <div key={capsule.id} className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{capsule.locked ? '🔒' : '📖'}</div>
                  <div className="flex-1">
                    <p className="text-white mb-1">{capsule.message}</p>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{capsule.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 transition-opacity text-white font-semibold flex items-center justify-center gap-2">
              <Gift className="w-5 h-5" />
              Создать капсулу времени
            </button>
          </TabsContent>

          {/* Collective Playlist */}
          <TabsContent value="music" className="space-y-3">
            <p className="text-gray-400 text-sm mb-3">
              Коллективный плейлист — добавляй треки вместе со всеми
            </p>
            {playlist.map((song, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{song.track}</p>
                  <p className="text-gray-400 text-sm">{song.artist}</p>
                </div>
                <span className="text-gray-500 text-xs">by {song.addedBy}</span>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 transition-opacity text-white font-semibold flex items-center justify-center gap-2">
              <Music className="w-5 h-5" />
              Добавить трек
            </button>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex gap-3 mb-4">
          <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 rounded-2xl">
            Чек-ин
          </Button>
          <Button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-6 rounded-2xl">
            Пойду
          </Button>
        </div>

        {/* Share button */}
        <button className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-white font-semibold flex items-center justify-center gap-2">
          <Share2 className="w-5 h-5" />
          Поделиться
        </button>
      </div>
    </motion.div>
  );
}