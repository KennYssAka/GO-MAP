import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin, MessageCircle, Heart, Music, FileText, Camera, Mic, Play, Pause, Send, X, Clock, Bookmark, Share2, MoreHorizontal, UserCheck, UserPlus, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { type Person, useFriends, type FriendStatus } from './FriendsContext';
import { useWeather } from './WeatherContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

/* ═══════════════════════════════════════════ */
/*              Stories / Notes Data            */
/* ═══════════════════════════════════════════ */

export type StoryType = 'note' | 'song' | 'moment' | 'voice';

export interface StoryItem {
  id: string;
  authorId: string;
  type: StoryType;
  text?: string;
  // song
  songTitle?: string;
  songArtist?: string;
  songCover?: string;
  // moment
  imageUrl?: string;
  caption?: string;
  // voice
  voiceDuration?: number;
  // meta
  timestamp: number;
  likes: number;
  likedByMe: boolean;
  saved: boolean;
}

const MOCK_IMAGES = {
  concert: 'https://images.unsplash.com/photo-1689783101582-98feb9393a57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2QlMjBuaWdodHxlbnwxfHx8fDE3NzIzODI3Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  coffee: 'https://images.unsplash.com/photo-1558966113-a817b7a17095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwY296eSUyMG1vcm5pbmd8ZW58MXx8fHwxNzcyMzgyNzM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  sunset: 'https://images.unsplash.com/photo-1665482955116-8226c353a5f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3NzIzODI3Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  streetart: 'https://images.unsplash.com/photo-1728219686377-509f37ff9cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBhcnQlMjBncmFmZml0aSUyMHdhbGx8ZW58MXx8fHwxNzcyMzU0MzAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  mountain: 'https://images.unsplash.com/photo-1603475429038-44361bcde123?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGhpa2luZyUyMHRyYWlsfGVufDF8fHx8MTc3MjM1NzMzNHww&ixlib=rb-4.1.0&q=80&w=1080',
  vinyl: 'https://images.unsplash.com/photo-1645523906738-eb84e7010695?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZHMlMjBtdXNpYyUyMHR1cm50YWJsZXxlbnwxfHx8fDE3NzIzODI3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
};

// Generates mock stories per person based on their interests
function generateMockStories(person: Person): StoryItem[] {
  const now = Date.now();
  const h = 3600000;

  const storiesMap: Record<string, StoryItem[]> = {
    p1: [
      { id: 's_p1_1', authorId: 'p1', type: 'song', songTitle: 'Narkotik Kal', songArtist: 'Hard Bass School', songCover: MOCK_IMAGES.vinyl, timestamp: now - h * 2, likes: 14, likedByMe: false, saved: false },
      { id: 's_p1_2', authorId: 'p1', type: 'note', text: 'Кто сегодня в Chukotka? Техно-вечер обещает быть огненным! 🔥🎧 Приходите к 22:00, будет DJ из Берлина!', timestamp: now - h * 5, likes: 23, likedByMe: false, saved: false },
      { id: 's_p1_3', authorId: 'p1', type: 'moment', imageUrl: MOCK_IMAGES.concert, caption: 'Вчерашний вечер был космос! 🚀', timestamp: now - h * 18, likes: 45, likedByMe: true, saved: false },
      { id: 's_p1_4', authorId: 'p1', type: 'voice', voiceDuration: 15, text: 'Голосовая заметка', timestamp: now - h * 24, likes: 8, likedByMe: false, saved: false },
    ],
    p2: [
      { id: 's_p2_1', authorId: 'p2', type: 'note', text: 'Ищу кофаундера для EdTech стартапа. Делаем платформу для изучения казахского через AI. Кому интересно — пишите! 🚀', timestamp: now - h * 3, likes: 31, likedByMe: false, saved: false },
      { id: 's_p2_2', authorId: 'p2', type: 'song', songTitle: 'Work', songArtist: 'Rihanna', songCover: MOCK_IMAGES.vinyl, timestamp: now - h * 8, likes: 12, likedByMe: false, saved: false },
      { id: 's_p2_3', authorId: 'p2', type: 'moment', imageUrl: MOCK_IMAGES.coffee, caption: 'Лучший раф в Astana Hub ☕', timestamp: now - h * 20, likes: 28, likedByMe: false, saved: false },
    ],
    p3: [
      { id: 's_p3_1', authorId: 'p3', type: 'moment', imageUrl: MOCK_IMAGES.streetart, caption: 'Новый мурал на Тулебаева! Нравится? 🎨', timestamp: now - h * 1, likes: 56, likedByMe: false, saved: false },
      { id: 's_p3_2', authorId: 'p3', type: 'song', songTitle: 'Blinding Lights', songArtist: 'The Weeknd', songCover: MOCK_IMAGES.vinyl, timestamp: now - h * 6, likes: 19, likedByMe: true, saved: false },
      { id: 's_p3_3', authorId: 'p3', type: 'note', text: 'Открываю новую студию рисования! Первые 10 участников — бесплатно. Кто хочет попробовать живопись? 🖌️', timestamp: now - h * 12, likes: 34, likedByMe: false, saved: false },
      { id: 's_p3_4', authorId: 'p3', type: 'voice', voiceDuration: 22, text: 'Отзыв о выставке', timestamp: now - h * 30, likes: 11, likedByMe: false, saved: false },
    ],
    p4: [
      { id: 's_p4_1', authorId: 'p4', type: 'note', text: 'Утренняя пробежка — 10 км за 48 мин! Новый рекорд 🏃‍♂️💨 Марафон в апреле — реально!', timestamp: now - h * 4, likes: 42, likedByMe: false, saved: false },
      { id: 's_p4_2', authorId: 'p4', type: 'moment', imageUrl: MOCK_IMAGES.mountain, caption: 'Кок-Тобе рано утром — другой мир 🏔️', timestamp: now - h * 10, likes: 67, likedByMe: true, saved: false },
      { id: 's_p4_3', authorId: 'p4', type: 'song', songTitle: 'Eye of the Tiger', songArtist: 'Survivor', songCover: MOCK_IMAGES.vinyl, timestamp: now - h * 16, likes: 15, likedByMe: false, saved: false },
    ],
    p5: [
      { id: 's_p5_1', authorId: 'p5', type: 'moment', imageUrl: MOCK_IMAGES.sunset, caption: 'Закат с крыши Mega 🌅 Алматы, ты прекрасен!', timestamp: now - h * 2, likes: 89, likedByMe: false, saved: false },
      { id: 's_p5_2', authorId: 'p5', type: 'song', songTitle: 'Levitating', songArtist: 'Dua Lipa', songCover: MOCK_IMAGES.vinyl, timestamp: now - h * 7, likes: 24, likedByMe: false, saved: false },
      { id: 's_p5_3', authorId: 'p5', type: 'note', text: 'Новый дресс-код: oversized blazer + кроссовки. Мода 2026 это вайб! ✨👠', timestamp: now - h * 15, likes: 38, likedByMe: false, saved: false },
    ],
    p6: [
      { id: 's_p6_1', authorId: 'p6', type: 'song', songTitle: 'Take Five', songArtist: 'Dave Brubeck', songCover: MOCK_IMAGES.vinyl, timestamp: now - h * 1, likes: 27, likedByMe: false, saved: false },
      { id: 's_p6_2', authorId: 'p6', type: 'note', text: 'Ищу людей для джем-сессии в эту субботу. Гитара, бас, клавиши — все welcome! 🎸🎹.sax', timestamp: now - h * 9, likes: 19, likedByMe: false, saved: false },
      { id: 's_p6_3', authorId: 'p6', type: 'voice', voiceDuration: 35, text: 'Новая мелодия на гитаре', timestamp: now - h * 14, likes: 33, likedByMe: true, saved: false },
      { id: 's_p6_4', authorId: 'p6', type: 'moment', imageUrl: MOCK_IMAGES.concert, caption: 'Jazz Evening вчера — мурашки 🎵', timestamp: now - h * 25, likes: 41, likedByMe: false, saved: false },
    ],
  };

  // For people without specific stories, generate generic ones
  if (storiesMap[person.id]) {
    return storiesMap[person.id];
  }

  return [
    { id: `s_${person.id}_1`, authorId: person.id, type: 'note', text: `${person.bio.replace(/[^\w\sа-яА-ЯёЁ.,!?—–-]/g, '').trim()} Хороший день для новых знакомств!`, timestamp: now - h * 3, likes: Math.floor(Math.random() * 30) + 5, likedByMe: false, saved: false },
    { id: `s_${person.id}_2`, authorId: person.id, type: 'song', songTitle: 'Something Just Like This', songArtist: 'Coldplay & The Chainsmokers', songCover: MOCK_IMAGES.vinyl, timestamp: now - h * 10, likes: Math.floor(Math.random() * 20) + 3, likedByMe: false, saved: false },
    { id: `s_${person.id}_3`, authorId: person.id, type: 'moment', imageUrl: person.city === 'astana' ? MOCK_IMAGES.sunset : MOCK_IMAGES.coffee, caption: `${person.location} — моё место силы ✨`, timestamp: now - h * 22, likes: Math.floor(Math.random() * 50) + 10, likedByMe: false, saved: false },
  ];
}

/* ─── Storage for likes & custom user stories ─── */
function loadLikes(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem('story_likes') || '{}'); } catch { return {}; }
}
function saveLikes(likes: Record<string, boolean>) {
  localStorage.setItem('story_likes', JSON.stringify(likes));
}

/* ─── Time formatting ─── */
function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'только что';
  if (mins < 60) return `${mins} мин`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}ч`;
  const days = Math.floor(hours / 24);
  return `${days}д`;
}

/* ═══════════════════════════════════════════ */
/*           PersonAvatar (re-used)            */
/* ═══════════════════════════════════════════ */

function PersonAvatar({ person, size = 'md' }: { person: Person; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizeClass = size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-14 h-14' : size === 'lg' ? 'w-20 h-20' : 'w-24 h-24';
  const textSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-3xl';

  if (person.avatarUrl) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden border-3 border-gray-700 shrink-0 relative`}>
        <ImageWithFallback src={person.avatarUrl} alt={person.name} className="w-full h-full object-cover" />
        {person.status === 'online' && <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-gray-900" />}
      </div>
    );
  }

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br ${person.avatarGradient} flex items-center justify-center ${textSize} font-bold text-white border-3 border-gray-700 shrink-0 relative`}>
      {person.avatarInitial}
      {person.status === 'online' && <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-gray-900" />}
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*            Friend Profile Screen            */
/* ═══════════════════════════════════════════ */

type FeedFilter = 'all' | 'note' | 'song' | 'moment' | 'voice';

interface FriendProfileScreenProps {
  person: Person;
  onBack: () => void;
  onMessage: (person: Person) => void;
  onViewOnMap: (person: Person) => void;
}

export function FriendProfileScreen({ person, onBack, onMessage, onViewOnMap }: FriendProfileScreenProps) {
  const { theme } = useWeather();
  const { friendStatus, addFriend, removeFriend, cancelRequest, acceptRequest, declineRequest } = useFriends();
  const status = friendStatus(person.id);
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('all');
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [likes, setLikes] = useState<Record<string, boolean>>(loadLikes);
  const [showAddStory, setShowAddStory] = useState(false);
  const [expandedStory, setExpandedStory] = useState<string | null>(null);

  // Load stories
  useEffect(() => {
    const mock = generateMockStories(person);
    // Apply persisted likes
    const saved = loadLikes();
    const withLikes = mock.map(s => ({
      ...s,
      likedByMe: saved[s.id] ?? s.likedByMe,
      likes: saved[s.id] && !s.likedByMe ? s.likes + 1 : !saved[s.id] && s.likedByMe ? s.likes - 1 : s.likes,
    }));
    setStories(withLikes);
  }, [person.id]);

  const toggleLike = (storyId: string) => {
    setStories(prev => prev.map(s => {
      if (s.id !== storyId) return s;
      const newLiked = !s.likedByMe;
      return { ...s, likedByMe: newLiked, likes: newLiked ? s.likes + 1 : s.likes - 1 };
    }));
    setLikes(prev => {
      const next = { ...prev };
      const story = stories.find(s => s.id === storyId);
      if (story) next[storyId] = !story.likedByMe;
      saveLikes(next);
      return next;
    });
  };

  const filteredStories = feedFilter === 'all'
    ? stories
    : stories.filter(s => s.type === feedFilter);

  const filterTabs: { id: FeedFilter; label: string; emoji: string }[] = [
    { id: 'all', label: 'Все', emoji: '📋' },
    { id: 'note', label: 'Заметки', emoji: '📝' },
    { id: 'song', label: 'Музыка', emoji: '🎵' },
    { id: 'moment', label: 'Моменты', emoji: '📸' },
    { id: 'voice', label: 'Голос', emoji: '🎤' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col">
      {/* ─── Fixed top bar (back button overlay) ─── */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="flex items-center justify-between px-4 pt-12 pb-3 pointer-events-auto">
          <button onClick={onBack} className="p-2 rounded-full bg-black/40 backdrop-blur-md">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-black/40 backdrop-blur-md">
              <Share2 className="w-4 h-4 text-white" />
            </button>
            <button className="p-2 rounded-full bg-black/40 backdrop-blur-md">
              <MoreHorizontal className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Scrollable content ─── */}
      <div className="flex-1 overflow-y-auto">
        {/* ─── Hero header ─── */}
        <div className={`bg-gradient-to-br ${person.avatarGradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />

          {/* Spacer for fixed top bar */}
          <div className="h-16" />

          {/* Avatar + Name block */}
          <div className="relative z-10 flex flex-col items-center pb-6 px-6 pt-4">
            <PersonAvatar person={person} size="xl" />
            <h1 className="text-2xl font-bold text-white mt-3">{person.name}</h1>
            <p className="text-white/70 text-sm">@{person.username} · {person.age} лет</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-lg">{person.vibeEmoji}</span>
              <span className="text-white/90 font-medium text-sm">{person.vibe}</span>
              <span className="text-white/50 text-sm">·</span>
              <span className="text-white/70 text-xs flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {person.location}
              </span>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-1.5 mt-2">
              <div className={`w-2 h-2 rounded-full ${person.status === 'online' ? 'bg-green-400' : person.status === 'active' ? 'bg-yellow-400' : 'bg-gray-500'}`} />
              <span className="text-white/60 text-xs">
                {person.status === 'online' ? 'Онлайн' : `Был(а) ${person.lastSeen} назад`}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Bio card ─── */}
        <div className="px-5 -mt-3 relative z-10">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30">
            <p className="text-gray-300 text-sm text-center leading-relaxed">{person.bio}</p>
          </div>
        </div>

        {/* ��── Stats row ─── */}
        <div className="px-5 mt-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: person.checkins, label: 'Чек-инов' },
              { val: stories.length, label: 'Записей' },
              { val: person.mutualFriends, label: 'Общих' },
              { val: `${person.matchPercent}%`, label: 'Match' },
            ].map((s, i) => (
              <div key={i} className="bg-gray-800/60 rounded-xl py-2.5 text-center border border-gray-700/30">
                <p className="text-white font-bold text-sm">{s.val}</p>
                <p className="text-gray-500 text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Action buttons ─── */}
        <div className="px-5 mt-4 flex gap-2.5">
          {status === 'friends' ? (
            <>
              <button
                onClick={() => onMessage(person)}
                className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${person.avatarGradient} text-white font-semibold text-sm flex items-center justify-center gap-2`}
              >
                <MessageCircle className="w-4 h-4" />
                Написать
              </button>
              <button
                onClick={() => onViewOnMap(person)}
                className="px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700/50"
              >
                <MapPin className="w-4 h-4" />
              </button>
            </>
          ) : status === 'sent' ? (
            <button
              onClick={() => cancelRequest(person.id)}
              className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 font-semibold text-sm flex items-center justify-center gap-2 border border-gray-700/50"
            >
              <Clock className="w-4 h-4" />
              Заявка отправлена
            </button>
          ) : status === 'received' ? (
            <>
              <button
                onClick={() => acceptRequest(person.id)}
                className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${person.avatarGradient} text-white font-semibold text-sm flex items-center justify-center gap-2`}
              >
                <UserCheck className="w-4 h-4" />
                Принять
              </button>
              <button
                onClick={() => declineRequest(person.id)}
                className="px-4 py-3 rounded-xl bg-gray-800 text-gray-400 border border-gray-700/50"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => addFriend(person.id)}
              className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${person.avatarGradient} text-white font-semibold text-sm flex items-center justify-center gap-2`}
            >
              <UserPlus className="w-4 h-4" />
              Добавить в друзья
            </button>
          )}
        </div>

        {/* ─── Interests ─── */}
        <div className="px-5 mt-4">
          <div className="flex flex-wrap gap-1.5">
            {person.interests.map(interest => (
              <span key={interest} className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs font-medium border border-gray-700/40">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* ─── Feed filter tabs ─── */}
        <div className="px-5 mt-5 mb-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-base">Лента</h2>
            <span className="text-gray-500 text-xs">{filteredStories.length} записей</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {filterTabs.map(t => (
              <button
                key={t.id}
                onClick={() => setFeedFilter(t.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                  feedFilter === t.id
                    ? `${theme.accent} text-white`
                    : 'bg-gray-800 text-gray-400 border border-gray-700/50'
                }`}
              >
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Feed ─── */}
        <div className="px-5 pb-8">
          {filteredStories.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">📭</span>
              <p className="text-gray-500 text-sm">Нет записей</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStories.map((story, idx) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  person={person}
                  onLike={() => toggleLike(story.id)}
                  index={idx}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*               Story Card                    */
/* ═══════════════════════════════════════════ */

function StoryCard({ story, person, onLike, index }: {
  story: StoryItem;
  person: Person;
  onLike: () => void;
  index: number;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  // Simulate voice playback
  const toggleVoice = () => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setVoiceProgress(0);
      const dur = (story.voiceDuration || 10) * 1000;
      const step = 100;
      let elapsed = 0;
      intervalRef.current = setInterval(() => {
        elapsed += step;
        setVoiceProgress(Math.min(elapsed / dur, 1));
        if (elapsed >= dur) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          setVoiceProgress(0);
        }
      }, step);
    }
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const typeIcons: Record<StoryType, { emoji: string; label: string; color: string }> = {
    note: { emoji: '📝', label: 'Заметка', color: 'text-blue-400' },
    song: { emoji: '🎵', label: 'Музыка', color: 'text-purple-400' },
    moment: { emoji: '📸', label: 'Момент', color: 'text-pink-400' },
    voice: { emoji: '🎤', label: 'Голос', color: 'text-amber-400' },
  };

  const info = typeIcons[story.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-gray-800/70 rounded-2xl overflow-hidden border border-gray-700/30"
    >
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 pt-3.5 pb-2">
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
          {person.avatarUrl ? (
            <ImageWithFallback src={person.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${person.avatarGradient} flex items-center justify-center text-xs font-bold text-white`}>
              {person.avatarInitial}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{person.name.split(' ')[0]}</p>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-medium ${info.color}`}>{info.emoji} {info.label}</span>
            <span className="text-gray-600 text-[10px]">·</span>
            <span className="text-gray-500 text-[10px]">{timeAgo(story.timestamp)}</span>
          </div>
        </div>
        <button className="p-1.5 rounded-full hover:bg-gray-700/50 text-gray-500">
          <Bookmark className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ─── NOTE ─── */}
      {story.type === 'note' && (
        <div className="px-4 pb-3">
          <p className="text-gray-200 text-sm leading-relaxed">{story.text}</p>
        </div>
      )}

      {/* ─── SONG ─── */}
      {story.type === 'song' && (
        <div className="px-4 pb-3">
          <div className="bg-gray-900/60 rounded-xl p-3 flex items-center gap-3 border border-gray-700/30">
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 relative">
              <ImageWithFallback src={story.songCover || MOCK_IMAGES.vinyl} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-4 h-4 text-white ml-0.5" />
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{story.songTitle}</p>
              <p className="text-gray-400 text-xs truncate">{story.songArtist}</p>
              {/* Fake waveform */}
              <div className="flex items-end gap-[2px] mt-2 h-4">
                {Array.from({ length: 24 }).map((_, i) => {
                  const h = Math.random() * 100;
                  return (
                    <div
                      key={i}
                      className={`w-[3px] rounded-full bg-gradient-to-t from-purple-500 to-pink-400 opacity-60`}
                      style={{ height: `${Math.max(15, h)}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MOMENT (photo) ─── */}
      {story.type === 'moment' && (
        <div className="px-4 pb-3">
          <div className="rounded-xl overflow-hidden relative">
            <ImageWithFallback
              src={story.imageUrl || MOCK_IMAGES.sunset}
              alt=""
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
          {story.caption && (
            <p className="text-gray-300 text-sm mt-2">{story.caption}</p>
          )}
        </div>
      )}

      {/* ─── VOICE ─── */}
      {story.type === 'voice' && (
        <div className="px-4 pb-3">
          <div className="bg-gray-900/60 rounded-xl p-3 flex items-center gap-3 border border-gray-700/30">
            <button
              onClick={toggleVoice}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                isPlaying ? 'bg-amber-500' : 'bg-gray-700'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              {/* Waveform / progress */}
              <div className="relative h-8 flex items-center">
                <div className="absolute inset-0 flex items-end gap-[2px]">
                  {Array.from({ length: 32 }).map((_, i) => {
                    const h = Math.sin(i * 0.5) * 30 + 40 + Math.random() * 20;
                    const filled = voiceProgress > i / 32;
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-colors ${
                          filled ? 'bg-amber-400' : 'bg-gray-600'
                        }`}
                        style={{ height: `${Math.max(15, h)}%` }}
                      />
                    );
                  })}
                </div>
              </div>
              <p className="text-gray-500 text-[10px] mt-1">
                {isPlaying
                  ? `${Math.floor(voiceProgress * (story.voiceDuration || 10))}с / ${story.voiceDuration || 10}с`
                  : `${story.voiceDuration || 10}с`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Actions footer ─── */}
      <div className="px-4 pb-3 flex items-center gap-4">
        <button
          onClick={onLike}
          className="flex items-center gap-1.5 group"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              story.likedByMe ? 'text-red-500 fill-red-500' : 'text-gray-500 group-hover:text-red-400'
            }`}
          />
          <span className={`text-xs font-medium ${story.likedByMe ? 'text-red-400' : 'text-gray-500'}`}>
            {story.likes}
          </span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300">
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs">Ответить</span>
        </button>
        <button className="ml-auto text-gray-500 hover:text-gray-300">
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}