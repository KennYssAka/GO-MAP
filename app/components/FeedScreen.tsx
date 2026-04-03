import { useState, useEffect, useMemo } from 'react';
import {
  Heart, MessageCircle, Bookmark, Music, Plus, X,
  Send, Image as ImageIcon, FileText, Play,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFriends, type Person } from './FriendsContext';
import { useWeather } from './WeatherContext';
import { useUser } from './UserContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { StoryItem, StoryType } from './FriendProfileScreen';

/* ── Constants ── */
const STORY_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

const IMG = {
  concert: 'https://images.unsplash.com/photo-1689783101582-98feb9393a57?w=1080&q=80',
  coffee:  'https://images.unsplash.com/photo-1558966113-a817b7a17095?w=1080&q=80',
  sunset:  'https://images.unsplash.com/photo-1665482955116-8226c353a5f1?w=1080&q=80',
  streetart:'https://images.unsplash.com/photo-1728219686377-509f37ff9cb9?w=1080&q=80',
  mountain:'https://images.unsplash.com/photo-1603475429038-44361bcde123?w=1080&q=80',
  vinyl:   'https://images.unsplash.com/photo-1645523906738-eb84e7010695?w=1080&q=80',
  rooftop: 'https://images.unsplash.com/photo-1649473971841-75eea7a58afe?w=1080&q=80',
  skate:   'https://images.unsplash.com/photo-1556019443-39c1f49212f0?w=1080&q=80',
};

/* ── Types ── */

interface FeedItem extends StoryItem {
  person: Person;
}

/* ── Storage ── */

function loadFeedLikes(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem('feed_likes') || '{}'); } catch { return {}; }
}
function saveFeedLikes(l: Record<string, boolean>) {
  localStorage.setItem('feed_likes', JSON.stringify(l));
}
function loadMyPosts(): StoryItem[] {
  try { return JSON.parse(localStorage.getItem('my_posts') || '[]'); } catch { return []; }
}
function saveMyPosts(p: StoryItem[]) {
  localStorage.setItem('my_posts', JSON.stringify(p));
}

/* ── Time ── */
function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'только что';
  if (mins < 60) return `${mins} мин`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}ч`;
  return `${Math.floor(hours / 24)}д`;
}

/* ── Feed data ── */

function buildFeedItems(friends: Person[]): FeedItem[] {
  const now = Date.now();
  const h = 3_600_000;
  const friendMap = new Map<string, Person>(friends.map(f => [f.id, f]));

  const RAW: { personId: string; story: Omit<StoryItem, 'authorId'> }[] = [
    { personId: 'p3', story: { id: 'f1',  type: 'moment',  imageUrl: IMG.streetart, caption: 'Новый мурал на Тулебаева! 🎨', timestamp: now - h * 0.5,  likes: 56, likedByMe: false, saved: false } },
    { personId: 'p1', story: { id: 'f2',  type: 'song',    songTitle: 'Narkotik Kal', songArtist: 'Hard Bass School', songCover: IMG.vinyl, timestamp: now - h * 1, likes: 14, likedByMe: false, saved: false } },
    { personId: 'p5', story: { id: 'f3',  type: 'moment',  imageUrl: IMG.sunset, caption: 'Закат с крыши Mega 🌅', timestamp: now - h * 1.5, likes: 89, likedByMe: false, saved: false } },
    { personId: 'p2', story: { id: 'f4',  type: 'note',    text: 'Ищу кофаундера для EdTech стартапа 🚀', timestamp: now - h * 2,   likes: 31, likedByMe: false, saved: false } },
    { personId: 'p6', story: { id: 'f5',  type: 'song',    songTitle: 'Take Five', songArtist: 'Dave Brubeck', songCover: IMG.vinyl, timestamp: now - h * 2.5, likes: 27, likedByMe: false, saved: false } },
    { personId: 'p4', story: { id: 'f6',  type: 'note',    text: '10 км за 48 мин! Новый рекорд 🏃‍♂️', timestamp: now - h * 3,   likes: 42, likedByMe: false, saved: false } },
    { personId: 'p1', story: { id: 'f7',  type: 'moment',  imageUrl: IMG.concert, caption: 'Вчерашний вечер в Chukotka bar 🔥', timestamp: now - h * 4, likes: 45, likedByMe: true, saved: false } },
    { personId: 'p3', story: { id: 'f8',  type: 'note',    text: 'Открываю студию рисования! Первые 10 — бесплатно 🖌️', timestamp: now - h * 5, likes: 34, likedByMe: false, saved: false } },
    { personId: 'p5', story: { id: 'f9',  type: 'song',    songTitle: 'Levitating', songArtist: 'Dua Lipa', songCover: IMG.vinyl, timestamp: now - h * 6, likes: 24, likedByMe: false, saved: false } },
    { personId: 'p4', story: { id: 'f10', type: 'moment',  imageUrl: IMG.mountain, caption: 'Кок-Тобе рано утром 🏔️', timestamp: now - h * 7, likes: 67, likedByMe: true, saved: false } },
    { personId: 'p6', story: { id: 'f11', type: 'note',    text: 'Новая мелодия на гитаре 🎸', timestamp: now - h * 8, likes: 33, likedByMe: false, saved: false } },
    { personId: 'p2', story: { id: 'f12', type: 'moment',  imageUrl: IMG.coffee, caption: 'Лучший раф в городе ☕', timestamp: now - h * 9, likes: 28, likedByMe: false, saved: false } },
    { personId: 'p5', story: { id: 'f13', type: 'note',    text: 'Новый дресс-код: oversized blazer + кроссовки ✨', timestamp: now - h * 10, likes: 38, likedByMe: false, saved: false } },
    // Beyond 24h - these will be filtered out
    { personId: 'p6', story: { id: 'f14', type: 'moment',  imageUrl: IMG.rooftop, caption: 'Jazz Evening 🎵', timestamp: now - h * 25, likes: 41, likedByMe: false, saved: false } },
    { personId: 'p1', story: { id: 'f15', type: 'note',    text: 'Запись с сета 🎧', timestamp: now - h * 26, likes: 8,  likedByMe: false, saved: false } },
  ];

  const items: FeedItem[] = [];

  for (const { personId, story } of RAW) {
    // Filter expired stories
    if (now - story.timestamp > STORY_EXPIRY_MS) continue;
    const person = friendMap.get(personId);
    if (!person) continue;
    items.push({ ...story, authorId: personId, person });
  }

  // Also add items for friends not in the pre-built list, within 24h window
  for (const friend of friends) {
    if (['p1','p2','p3','p4','p5','p6'].includes(friend.id)) continue;
    // Only generate if they'd have an "active" timestamp
    const fakeTs = now - h * (Math.random() * 20 + 0.5);
    if (now - fakeTs > STORY_EXPIRY_MS) continue;
    items.push({
      id: `fg_${friend.id}`,
      authorId: friend.id,
      type: 'note',
      text: friend.bio ? `${friend.bio} 💫` : 'Исследую город 🗺️',
      timestamp: fakeTs,
      likes: Math.floor(Math.random() * 30) + 5,
      likedByMe: false,
      saved: false,
      person: friend,
    });
  }

  // Ranking: recency + engagement score
  items.sort((a, b) => {
    const scoreA = (a.likes * 2) - Math.floor((now - a.timestamp) / h) * 3;
    const scoreB = (b.likes * 2) - Math.floor((now - b.timestamp) / h) * 3;
    return scoreB - scoreA;
  });

  return items;
}

/* ── Filter ── */
type FeedFilter = 'all' | 'note' | 'song' | 'moment';

/* ── Props ── */
interface FeedScreenProps {
  onOpenProfile: (person: Person) => void;
}

/* ── Component ── */
export function FeedScreen({ onOpenProfile }: FeedScreenProps) {
  const { theme } = useWeather();
  const { friends, recommendations } = useFriends();
  const { user } = useUser();

  const [feedFilter, setFeedFilter] = useState<FeedFilter>('all');
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [likes, setLikes] = useState<Record<string, boolean>>(loadFeedLikes);
  const [myPosts, setMyPosts] = useState<StoryItem[]>(loadMyPosts);
  const [showCompose, setShowCompose] = useState(false);
  const [composeType, setComposeType] = useState<StoryType>('note');
  const [composeText, setComposeText] = useState('');
  const [composeSongTitle, setComposeSongTitle] = useState('');
  const [composeSongArtist, setComposeSongArtist] = useState('');

  const allPeople = useMemo(() => [...friends, ...recommendations], [friends, recommendations]);

  // Stories row: only people with active (< 24h) stories
  const storiesPeople = useMemo(() => {
    const activeFriendIds = new Set(feedItems.map(i => i.authorId));
    return allPeople.filter(p => activeFriendIds.has(p.id)).slice(0, 12);
  }, [allPeople, feedItems]);

  useEffect(() => {
    const allFriends = [...friends, ...recommendations];
    setFeedItems(buildFeedItems(allFriends));
  }, [friends, recommendations]);

  const filteredItems = useMemo(() => {
    if (feedFilter === 'all') return feedItems;
    return feedItems.filter(i => i.type === feedFilter);
  }, [feedItems, feedFilter]);

  const toggleLike = (itemId: string, currentLikes: number, likedByMe: boolean) => {
    setLikes(prev => {
      const updated = { ...prev, [itemId]: !prev[itemId] };
      saveFeedLikes(updated);
      return updated;
    });
    setFeedItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, likes: item.likes + (likedByMe ? -1 : 1), likedByMe: !likedByMe }
        : item
    ));
  };

  const publishPost = () => {
    if (composeType === 'note' && !composeText.trim()) return;
    if (composeType === 'song' && (!composeSongTitle.trim() || !composeSongArtist.trim())) return;

    const newPost: StoryItem = {
      id: `my_${Date.now()}`,
      authorId: 'me',
      type: composeType,
      text: composeType === 'note' ? composeText : undefined,
      songTitle: composeType === 'song' ? composeSongTitle : undefined,
      songArtist: composeType === 'song' ? composeSongArtist : undefined,
      timestamp: Date.now(),
      likes: 0,
      likedByMe: false,
      saved: false,
    };

    const updated = [newPost, ...myPosts];
    setMyPosts(updated);
    saveMyPosts(updated);
    setComposeText(''); setComposeSongTitle(''); setComposeSongArtist('');
    setShowCompose(false);
  };

  return (
    <div className="flex-1 bg-black overflow-y-auto pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/95 backdrop-blur-sm border-b border-white/[0.06]">
        <div className="px-4 pt-12 pb-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-white font-black text-2xl">Лента</h1>
            <button
              onClick={() => setShowCompose(true)}
              className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.4)]"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {([
              { id: 'all', label: 'Все', emoji: '✨' },
              { id: 'moment', label: 'Фото', emoji: '📷' },
              { id: 'note', label: 'Заметки', emoji: '💭' },
              { id: 'song', label: 'Музыка', emoji: '🎵' },
            ] as { id: FeedFilter; label: string; emoji: string }[]).map(({ id, label, emoji }) => (
              <button
                key={id}
                onClick={() => setFeedFilter(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  feedFilter === id
                    ? 'bg-violet-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]'
                    : 'bg-white/[0.06] text-gray-400 border border-white/[0.06]'
                }`}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stories row — only active people */}
      {storiesPeople.length > 0 && (
        <div className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-white/[0.06]">
          {/* My story */}
          <button
            onClick={() => setShowCompose(true)}
            className="flex flex-col items-center gap-1 shrink-0"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl border-2 border-black relative">
              {user?.avatarInitial ?? '?'}
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-violet-500 rounded-full border-2 border-black flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
            </div>
            <span className="text-gray-500 text-[10px]">Моя</span>
          </button>

          {storiesPeople.map(p => (
            <button
              key={p.id}
              onClick={() => onOpenProfile(p)}
              className="flex flex-col items-center gap-1 shrink-0"
            >
              <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-br from-violet-500 via-pink-500 to-orange-400">
                <div className={`w-full h-full rounded-full bg-gradient-to-br ${p.avatarGradient || 'from-violet-500 to-pink-500'} flex items-center justify-center text-white font-bold text-xl border-2 border-black`}>
                  {p.name.charAt(0)}
                </div>
              </div>
              <span className="text-gray-400 text-[10px] truncate w-14 text-center">{p.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      )}

      {/* My posts */}
      {myPosts.filter(p => Date.now() - p.timestamp < STORY_EXPIRY_MS).map(post => (
        <MyPostCard key={post.id} post={post} onDelete={() => {
          const updated = myPosts.filter(p => p.id !== post.id);
          setMyPosts(updated);
          saveMyPosts(updated);
        }} />
      ))}

      {/* Feed */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 px-8 text-center">
          <span className="text-5xl">🌙</span>
          <p className="text-gray-400 text-sm">
            {feedFilter !== 'all'
              ? 'Нет публикаций этого типа'
              : 'Активных историй нет. Добавь друзей!'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {filteredItems.map(item => (
            <FeedCard
              key={item.id}
              item={item}
              liked={likes[item.id] ?? item.likedByMe}
              onLike={() => toggleLike(item.id, item.likes, likes[item.id] ?? item.likedByMe)}
              onOpenProfile={() => onOpenProfile(item.person)}
            />
          ))}
        </div>
      )}

      {/* Compose sheet */}
      <AnimatePresence>
        {showCompose && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowCompose(false)}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-[#0d0d0d] rounded-t-3xl border-t border-white/[0.06] max-w-md mx-auto"
            >
              <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mt-3 mb-5" />
              <div className="px-5 pb-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white font-bold text-lg">Новая публикация</p>
                  <button onClick={() => setShowCompose(false)}>
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Type selector */}
                <div className="flex gap-2 mb-4">
                  {([
                    { id: 'note', label: 'Заметка', Icon: FileText },
                    { id: 'song', label: 'Музыка', Icon: Music },
                    { id: 'moment', label: 'Фото', Icon: ImageIcon },
                  ] as { id: StoryType; label: string; Icon: React.ComponentType<{className?: string}> }[]).map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      onClick={() => setComposeType(id)}
                      className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all ${
                        composeType === id
                          ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                          : 'bg-white/[0.04] border-white/[0.08] text-gray-500'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>

                {composeType === 'note' && (
                  <textarea
                    autoFocus
                    value={composeText}
                    onChange={e => setComposeText(e.target.value)}
                    placeholder="Что происходит?"
                    rows={3}
                    className="w-full bg-white/[0.07] border border-white/[0.08] rounded-2xl px-4 py-3 text-white text-[14px] placeholder-gray-600 outline-none resize-none focus:border-violet-500/50 transition-colors"
                  />
                )}

                {composeType === 'song' && (
                  <div className="space-y-3">
                    <input
                      autoFocus
                      type="text"
                      value={composeSongTitle}
                      onChange={e => setComposeSongTitle(e.target.value)}
                      placeholder="Название трека"
                      className="w-full bg-white/[0.07] border border-white/[0.08] rounded-2xl px-4 py-3 text-white text-[14px] placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors"
                    />
                    <input
                      type="text"
                      value={composeSongArtist}
                      onChange={e => setComposeSongArtist(e.target.value)}
                      placeholder="Артист"
                      className="w-full bg-white/[0.07] border border-white/[0.08] rounded-2xl px-4 py-3 text-white text-[14px] placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors"
                    />
                  </div>
                )}

                {composeType === 'moment' && (
                  <div className="flex flex-col items-center gap-2 py-8 bg-white/[0.04] border border-white/[0.08] rounded-2xl">
                    <ImageIcon className="w-10 h-10 text-gray-600" />
                    <p className="text-gray-500 text-sm">Загрузка фото скоро появится</p>
                  </div>
                )}

                <button
                  onClick={publishPost}
                  disabled={
                    (composeType === 'note' && !composeText.trim()) ||
                    (composeType === 'song' && (!composeSongTitle.trim() || !composeSongArtist.trim())) ||
                    composeType === 'moment'
                  }
                  className="w-full mt-4 py-3.5 rounded-2xl bg-violet-600 text-white font-bold text-[14px] disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_16px_rgba(139,92,246,0.4)]"
                >
                  Опубликовать
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Feed Card ── */

function FeedCard({
  item, liked, onLike, onOpenProfile,
}: {
  item: FeedItem;
  liked: boolean;
  onLike: () => void;
  onOpenProfile: () => void;
}) {
  const [saved, setSaved] = useState(item.saved);

  return (
    <div className="px-4 py-4">
      {/* Author */}
      <button onClick={onOpenProfile} className="flex items-center gap-3 mb-3 w-full text-left">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.person.avatarGradient || 'from-violet-500 to-pink-500'} flex items-center justify-center text-white font-bold shrink-0`}>
          {item.person.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-[14px]">{item.person.name}</p>
          <p className="text-gray-500 text-[11px]">{timeAgo(item.timestamp)}</p>
        </div>
      </button>

      {/* Content */}
      {item.type === 'moment' && item.imageUrl && (
        <div className="rounded-2xl overflow-hidden mb-3 aspect-[4/3]">
          <ImageWithFallback src={item.imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {item.type === 'note' && item.text && (
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-4 mb-3">
          <p className="text-white text-[15px] leading-relaxed">{item.text}</p>
        </div>
      )}

      {item.type === 'song' && (
        <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shrink-0">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-[14px] truncate">{item.songTitle}</p>
            <p className="text-gray-400 text-[12px] truncate">{item.songArtist}</p>
          </div>
          <Play className="w-5 h-5 text-gray-500 shrink-0" />
        </div>
      )}

      {item.type === 'moment' && item.caption && (
        <p className="text-white text-[14px] mb-3 leading-relaxed">{item.caption}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button onClick={onLike} className="flex items-center gap-1.5">
          <Heart className={`w-5 h-5 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
          <span className="text-gray-500 text-[13px]">{item.likes + (liked ? 1 : 0)}</span>
        </button>
        <button className="flex items-center gap-1.5">
          <MessageCircle className="w-5 h-5 text-gray-500" />
          <span className="text-gray-500 text-[13px]">0</span>
        </button>
        <button className="flex items-center gap-1.5">
          <Send className="w-5 h-5 text-gray-500" />
        </button>
        <button onClick={() => setSaved(s => !s)} className="ml-auto">
          <Bookmark className={`w-5 h-5 transition-colors ${saved ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}`} />
        </button>
      </div>
    </div>
  );
}

function MyPostCard({ post, onDelete }: { post: StoryItem; onDelete: () => void }) {
  return (
    <div className="mx-4 my-3 bg-violet-500/10 border border-violet-500/20 rounded-2xl p-4 flex items-start gap-3">
      <div className="flex-1 min-w-0">
        {post.type === 'note' && <p className="text-violet-200 text-[14px]">{post.text}</p>}
        {post.type === 'song' && (
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-violet-400 shrink-0" />
            <p className="text-violet-200 text-[14px] truncate">{post.songTitle} — {post.songArtist}</p>
          </div>
        )}
        <p className="text-violet-400/60 text-[11px] mt-1">{timeAgo(post.timestamp)} · Только ты</p>
      </div>
      <button onClick={onDelete}>
        <X className="w-4 h-4 text-violet-400/60" />
      </button>
    </div>
  );
}
