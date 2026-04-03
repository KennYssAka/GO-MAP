import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { CityId } from './CityContext';

export interface Person {
  id: string;
  name: string;
  age: number;
  username: string;
  bio: string;
  avatarUrl: string | null;
  avatarInitial: string;
  avatarGradient: string;
  interests: string[];
  vibe: string;
  vibeEmoji: string;
  status: 'online' | 'active' | 'offline';
  location: string;
  lat: number;
  lng: number;
  distance: string;
  matchPercent: number;
  mutualFriends: number;
  mutualFriendsNames: string[];
  lastSeen?: string;
  checkins: number;
  city: CityId;
}

export type FriendStatus = 'none' | 'sent' | 'received' | 'friends';

interface FriendsContextType {
  friends: Person[];
  recommendations: Person[];
  sentRequests: string[];
  receivedRequests: Person[];
  friendStatus: (personId: string) => FriendStatus;
  addFriend: (personId: string) => void;
  removeFriend: (personId: string) => void;
  acceptRequest: (personId: string) => void;
  declineRequest: (personId: string) => void;
  cancelRequest: (personId: string) => void;
  dismissRecommendation: (personId: string) => void;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

// Mock data for all people in the system
const allPeople: Person[] = [
  {
    id: 'p1', name: 'Айгерим Нурланова', age: 24, username: 'aigerim_n',
    bio: 'Event-менеджер, люблю техно и стартапы 🎧', avatarUrl: 'https://images.unsplash.com/photo-1643816831186-b2427a8f9f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjI3MzkxMnww&ixlib=rb-4.1.0&q=80&w=1080',
    avatarInitial: 'А', avatarGradient: 'from-purple-500 to-pink-500',
    interests: ['Техно', 'Стартапы', 'Йога', 'Кофе'], vibe: 'Активная', vibeEmoji: '🔥',
    status: 'online', location: 'Достык Плаза', lat: 43.2380, lng: 76.9570,
    distance: '250м', matchPercent: 92, mutualFriends: 3, mutualFriendsNames: ['Нурлан', 'София'], lastSeen: 'Сейчас', checkins: 47,
    city: 'almaty',
  },
  {
    id: 'p2', name: 'Нурлан Сейтов', age: 28, username: 'nurlan_s',
    bio: 'Founder в EdTech, ищу партнёров 🚀', avatarUrl: 'https://images.unsplash.com/photo-1724118135606-b4ff6b631cd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0JTIwdXJiYW58ZW58MXx8fHwxNzcyMjQyODEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    avatarInitial: 'Н', avatarGradient: 'from-blue-500 to-indigo-500',
    interests: ['AI', 'Бизнес', 'Кофе', 'Нетворкинг'], vibe: 'Креативный', vibeEmoji: '💡',
    status: 'online', location: 'Astana Hub', lat: 51.0906, lng: 71.3977,
    distance: '520м', matchPercent: 88, mutualFriends: 5, mutualFriendsNames: ['Артём', 'Камила', 'Руслан'], lastSeen: 'Сейчас', checkins: 62,
    city: 'astana',
  },
  {
    id: 'p3', name: 'София Ким', age: 23, username: 'sofia_art',
    bio: 'Художник и диджей по выходным 🎨🎧', avatarUrl: 'https://images.unsplash.com/photo-1657446969465-c7d312f8f21e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXQlMjBjaXR5fGVufDF8fHx8MTc3MjI4MDU0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    avatarInitial: 'С', avatarGradient: 'from-pink-500 to-rose-500',
    interests: ['Арт', 'Музыка', 'Йога', 'Фотография'], vibe: 'Вдохновлённая', vibeEmoji: '✨',
    status: 'active', location: 'KBTU Gallery', lat: 43.2450, lng: 76.9420,
    distance: '1.2км', matchPercent: 82, mutualFriends: 2, mutualFriendsNames: ['Айгерим'], lastSeen: '15 мин', checkins: 35,
    city: 'almaty',
  },
  {
    id: 'p4', name: 'Артём Волков', age: 27, username: 'artem_run',
    bio: 'Бегу марафон в апреле, кто со мной? 🏃', avatarUrl: 'https://images.unsplash.com/photo-1742201835989-4e346e36b364?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZW50cmFsJTIwYXNpYW4lMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzIyODA1NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    avatarInitial: 'А', avatarGradient: 'from-emerald-500 to-teal-500',
    interests: ['Бег', 'Горы', 'Здоровье', 'CrossFit'], vibe: 'Спортивный', vibeEmoji: '💪',
    status: 'online', location: 'Центральный парк', lat: 43.2290, lng: 76.9360,
    distance: '800м', matchPercent: 79, mutualFriends: 4, mutualFriendsNames: ['Нурлан', 'Данияр'], lastSeen: 'Сейчас', checkins: 89,
    city: 'almaty',
  },
  {
    id: 'p5', name: 'Камила Рахимова', age: 24, username: 'kamila_r',
    bio: 'Жизнь слишком коротка для скучных мест ✈️', avatarUrl: 'https://images.unsplash.com/photo-1762341117363-824bb37ad300?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwb2ZmaWNlfGVufDF8fHx8MTc3MjI4MDU0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    avatarInitial: 'К', avatarGradient: 'from-amber-500 to-orange-500',
    interests: ['Вечеринки', 'Мода', 'Путешествия', 'Фото'], vibe: 'Тусовщица', vibeEmoji: '🎉',
    status: 'active', location: 'Mega Alma-Ata', lat: 43.2567, lng: 76.9286,
    distance: '350м', matchPercent: 91, mutualFriends: 6, mutualFriendsNames: ['Нурлан', 'Айгерим', 'София'], lastSeen: '30 мин', checkins: 54,
    city: 'almaty',
  },
  {
    id: 'p6', name: 'Данияр Касымов', age: 26, username: 'daniyar_jazz',
    bio: 'Играю на гитаре, ищу людей для джема 🎸', avatarUrl: 'https://images.unsplash.com/photo-1752860872185-78926b52ef77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMG1hbiUyMHBvcnRyYWl0JTIwY2FzdWFsfGVufDF8fHx8MTc3MjI4MDU0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    avatarInitial: 'Д', avatarGradient: 'from-violet-500 to-purple-500',
    interests: ['Джаз', 'Гитара', 'Вино', 'Кино'], vibe: 'Музыкальный', vibeEmoji: '🎶',
    status: 'offline', location: 'Jazz Bar', lat: 43.2430, lng: 76.9390,
    distance: '600м', matchPercent: 85, mutualFriends: 2, mutualFriendsNames: ['Артём'], lastSeen: '2ч', checkins: 41,
    city: 'almaty',
  },
  {
    id: 'p7', name: 'Мадина Ахметова', age: 25, username: 'madina_a',
    bio: 'UX-дизайнер, обожаю книги и лавандовый раф ☕', avatarUrl: null,
    avatarInitial: 'М', avatarGradient: 'from-cyan-500 to-blue-500',
    interests: ['Дизайн', 'UX/UI', 'Книги', 'Кофе'], vibe: 'Творческая', vibeEmoji: '🎨',
    status: 'online', location: 'Creative Hub', lat: 43.2490, lng: 76.9420,
    distance: '1.1км', matchPercent: 76, mutualFriends: 3, mutualFriendsNames: ['София', 'Камила'], lastSeen: 'Сейчас', checkins: 28,
    city: 'almaty',
  },
  {
    id: 'p8', name: 'Руслан Оспанов', age: 30, username: 'ruslan_fintech',
    bio: 'Строю финтех продукт, открыт к нетворкингу 📈', avatarUrl: null,
    avatarInitial: 'Р', avatarGradient: 'from-sky-500 to-indigo-500',
    interests: ['Финтех', 'Крипто', 'Инвестиции', 'Гольф'], vibe: 'Предприниматель', vibeEmoji: '🚀',
    status: 'active', location: 'Ritz Carlton', lat: 43.2210, lng: 76.8990,
    distance: '900м', matchPercent: 87, mutualFriends: 4, mutualFriendsNames: ['Нурлан', 'Артём', 'Данияр'], lastSeen: '45 мин', checkins: 33,
    city: 'almaty',
  },
  {
    id: 'p9', name: 'Алия Жунусова', age: 22, username: 'aliya_z',
    bio: 'Начинающий фотограф, снимаю улицы Алматы 📸', avatarUrl: null,
    avatarInitial: 'А', avatarGradient: 'from-rose-500 to-pink-500',
    interests: ['Фотография', 'Стрит-арт', 'Кино', 'Путешествия'], vibe: 'Мечтательная', vibeEmoji: '🌙',
    status: 'offline', location: 'Арбат', lat: 43.2540, lng: 76.9340,
    distance: '1.5км', matchPercent: 73, mutualFriends: 1, mutualFriendsNames: ['София'], lastSeen: '5ч', checkins: 19,
    city: 'almaty',
  },
  {
    id: 'p10', name: 'Тимур Байгабулов', age: 29, username: 'timur_b',
    bio: 'DevOps инженер, скалолаз по выходным 🧗', avatarUrl: null,
    avatarInitial: 'Т', avatarGradient: 'from-green-500 to-emerald-500',
    interests: ['IT', 'Скалолазание', 'Велосипед', 'Горы'], vibe: 'Активный', vibeEmoji: '⚡',
    status: 'online', location: 'Mountain Club', lat: 43.2150, lng: 76.9420,
    distance: '2.1км', matchPercent: 81, mutualFriends: 3, mutualFriendsNames: ['Артём', 'Нурлан'], lastSeen: 'Сейчас', checkins: 56,
    city: 'almaty',
  },
  {
    id: 'p11', name: 'Асель Муратова', age: 26, username: 'asel_m',
    bio: 'Продюсер, организую события в Алматы 🎪', avatarUrl: null,
    avatarInitial: 'А', avatarGradient: 'from-fuchsia-500 to-purple-500',
    interests: ['Ивенты', 'Музыка', 'Нетворкинг', 'Мода'], vibe: 'Энергичная', vibeEmoji: '⚡',
    status: 'active', location: 'Chukotka Bar', lat: 43.2380, lng: 76.9450,
    distance: '450м', matchPercent: 84, mutualFriends: 5, mutualFriendsNames: ['Камила', 'Айгерим', 'Данияр'], lastSeen: '10 мин', checkins: 72,
    city: 'almaty',
  },
  {
    id: 'p12', name: 'Ерлан Жумабеков', age: 31, username: 'erlan_j',
    bio: 'Тренер по теннису, люблю путешествия 🎾', avatarUrl: null,
    avatarInitial: 'Е', avatarGradient: 'from-lime-500 to-green-500',
    interests: ['Теннис', 'Путешествия', 'Кулинария', 'Бег'], vibe: 'Позитивный', vibeEmoji: '😊',
    status: 'offline', location: 'Tennis Club', lat: 43.2620, lng: 76.9120,
    distance: '3.2км', matchPercent: 69, mutualFriends: 1, mutualFriendsNames: ['Артём'], lastSeen: '1д', checkins: 45,
    city: 'almaty',
  },
  // Астана
  {
    id: 'p13', name: 'Айнур Сагатова', age: 25, username: 'ainur_s',
    bio: 'Работаю в МФЦА, люблю фигурное катание ⛸️', avatarUrl: null,
    avatarInitial: 'А', avatarGradient: 'from-sky-400 to-blue-600',
    interests: ['Финансы', 'Каток', 'Кофе', 'Путешествия'], vibe: 'Целеустремлённая', vibeEmoji: '🎯',
    status: 'online', location: 'AIFC', lat: 51.0887, lng: 71.4155,
    distance: '1.3км', matchPercent: 83, mutualFriends: 2, mutualFriendsNames: ['Нурлан'], lastSeen: 'Сейчас', checkins: 38,
    city: 'astana',
  },
  {
    id: 'p14', name: 'Бауыржан Толеуов', age: 27, username: 'bauyr_t',
    bio: 'Госслужащий днём, диджей ночью 🎧🏛️', avatarUrl: null,
    avatarInitial: 'Б', avatarGradient: 'from-indigo-500 to-violet-600',
    interests: ['Электронная музыка', 'Политика', 'Бег', 'Фотография'], vibe: 'Многогранный', vibeEmoji: '🔮',
    status: 'active', location: 'Хан Шатыр', lat: 51.1324, lng: 71.4040,
    distance: '800м', matchPercent: 77, mutualFriends: 1, mutualFriendsNames: ['Нурлан'], lastSeen: '20 мин', checkins: 51,
    city: 'astana',
  },
  {
    id: 'p15', name: 'Жанна Аманова', age: 23, username: 'zhanna_art',
    bio: 'Студентка НУ, арт-блогер и книгоман 📚', avatarUrl: null,
    avatarInitial: 'Ж', avatarGradient: 'from-rose-400 to-fuchsia-500',
    interests: ['Искусство', 'Книги', 'Блог', 'Кино'], vibe: 'Творческая', vibeEmoji: '🌸',
    status: 'online', location: 'Назарбаев Университет', lat: 51.0906, lng: 71.3977,
    distance: '2.5км', matchPercent: 80, mutualFriends: 2, mutualFriendsNames: ['Айнур', 'Нурлан'], lastSeen: 'Сейчас', checkins: 22,
    city: 'astana',
  },
  {
    id: 'p16', name: 'Ержан Кусаинов', age: 30, username: 'erzhan_k',
    bio: 'Хоккеист-любитель, фанат Барыса 🏒', avatarUrl: null,
    avatarInitial: 'Е', avatarGradient: 'from-teal-500 to-cyan-600',
    interests: ['Хоккей', 'Спорт', 'BBQ', 'Рыбалка'], vibe: 'Командный', vibeEmoji: '🏒',
    status: 'offline', location: 'Barys Arena', lat: 51.1321, lng: 71.3983,
    distance: '3.0км', matchPercent: 72, mutualFriends: 1, mutualFriendsNames: ['Бауыржан'], lastSeen: '3ч', checkins: 65,
    city: 'astana',
  },
];

export function FriendsProvider({ children }: { children: ReactNode }) {
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [receivedRequestIds, setReceivedRequestIds] = useState<string[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('friends_data');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setFriendIds(data.friendIds || []);
        setSentRequests(data.sentRequests || []);
        setReceivedRequestIds(data.receivedRequestIds || []);
        setDismissedIds(data.dismissedIds || []);
      } catch {}
    } else {
      // Start with some pre-existing friends and received requests for demo
      setFriendIds(['p1', 'p2']);
      setReceivedRequestIds(['p5']);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('friends_data', JSON.stringify({
      friendIds, sentRequests, receivedRequestIds, dismissedIds,
    }));
  }, [friendIds, sentRequests, receivedRequestIds, dismissedIds]);

  const friends = allPeople.filter(p => friendIds.includes(p.id));

  const recommendations = allPeople
    .filter(p => !friendIds.includes(p.id) && !dismissedIds.includes(p.id))
    .sort((a, b) => b.matchPercent - a.matchPercent);

  const receivedRequests = allPeople.filter(p => receivedRequestIds.includes(p.id));

  const friendStatus = (personId: string): FriendStatus => {
    if (friendIds.includes(personId)) return 'friends';
    if (sentRequests.includes(personId)) return 'sent';
    if (receivedRequestIds.includes(personId)) return 'received';
    return 'none';
  };

  const addFriend = (personId: string) => {
    if (receivedRequestIds.includes(personId)) {
      // Accept incoming request
      acceptRequest(personId);
    } else {
      setSentRequests(prev => [...prev, personId]);
      // Simulate auto-accept after delay for demo
      setTimeout(() => {
        setFriendIds(prev => {
          if (prev.includes(personId)) return prev;
          return [...prev, personId];
        });
        setSentRequests(prev => prev.filter(id => id !== personId));
      }, 2000);
    }
  };

  const removeFriend = (personId: string) => {
    setFriendIds(prev => prev.filter(id => id !== personId));
  };

  const acceptRequest = (personId: string) => {
    setReceivedRequestIds(prev => prev.filter(id => id !== personId));
    setFriendIds(prev => {
      if (prev.includes(personId)) return prev;
      return [...prev, personId];
    });
  };

  const declineRequest = (personId: string) => {
    setReceivedRequestIds(prev => prev.filter(id => id !== personId));
  };

  const cancelRequest = (personId: string) => {
    setSentRequests(prev => prev.filter(id => id !== personId));
  };

  const dismissRecommendation = (personId: string) => {
    setDismissedIds(prev => [...prev, personId]);
  };

  return (
    <FriendsContext.Provider value={{
      friends,
      recommendations,
      sentRequests,
      receivedRequests,
      friendStatus,
      addFriend,
      removeFriend,
      acceptRequest,
      declineRequest,
      cancelRequest,
      dismissRecommendation,
    }}>
      {children}
    </FriendsContext.Provider>
  );
}

export function useFriends() {
  const context = useContext(FriendsContext);
  if (!context) throw new Error('useFriends must be used within FriendsProvider');
  return context;
}

export { allPeople };