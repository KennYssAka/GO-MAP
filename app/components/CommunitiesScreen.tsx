import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Search, MoreVertical, Hash, Pin, Users, Plus, Send,
  Smile, Image, Mic, Check, CheckCheck, X, Settings, Bell, BellOff,
  ChevronRight, Globe, Lock, MessageSquare, FileText, Video as VideoIcon,
  Bookmark, Star, TrendingUp, Coffee, ShoppingBag, HelpCircle, Megaphone,
  Flame, Briefcase, GraduationCap, Heart, Palette, Music, Gamepad2, Utensils,
  Trash2, Edit3, PinOff, Copy, Eye, EyeOff, Camera, Type, Crown, Shield
} from 'lucide-react';
import { useUser } from './UserContext';

/* ─── Types ─── */

interface TopicMessage {
  id: string;
  senderName: string;
  senderAvatar?: string;
  senderColor: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

interface Topic {
  id: string;
  title: string;
  icon: string;
  iconBg: string;
  pinned?: boolean;
  lastMessage?: TopicMessage;
  messagesCount: number;
  createdAt: number;
}

interface Community {
  id: string;
  name: string;
  avatar: string;
  avatarBg: string;
  membersCount: number;
  description: string;
  isPublic: boolean;
  topics: Topic[];
  category: string;
  isOwner?: boolean;
  createdAt?: number;
  rules?: string;
  welcomeMessage?: string;
}

/* ─── Constants ─── */

const COMMUNITY_AVATARS = ['🏔️', '🏙️', '🍜', '💻', '⚽', '🎵', '🎮', '📸', '🎨', '📚', '🏋️', '🚗', '🐱', '🌍', '🎬', '☕', '🛍️', '💼', '🎓', '❤️', '🔥', '🎯', '🏠', '✈️', '🎭', '🧘', '🍕', '🎸', '🌃', '🏖️'];

const COMMUNITY_GRADIENTS = [
  { id: 'purple', label: 'Фиолетовый', value: 'from-purple-600 to-indigo-700' },
  { id: 'cyan', label: 'Бирюзовый', value: 'from-cyan-600 to-blue-700' },
  { id: 'orange', label: 'Оранжевый', value: 'from-orange-500 to-red-600' },
  { id: 'green', label: 'Зелёный', value: 'from-green-500 to-emerald-700' },
  { id: 'blue', label: 'Синий', value: 'from-blue-500 to-indigo-600' },
  { id: 'pink', label: 'Розовый', value: 'from-pink-500 to-rose-600' },
  { id: 'amber', label: 'Жёлтый', value: 'from-amber-500 to-orange-600' },
  { id: 'teal', label: 'Тёмно-бирюзовый', value: 'from-teal-500 to-cyan-700' },
  { id: 'violet', label: 'Лиловый', value: 'from-violet-500 to-purple-700' },
  { id: 'rose', label: 'Малиновый', value: 'from-rose-500 to-pink-700' },
  { id: 'emerald', label: 'Изумрудный', value: 'from-emerald-500 to-green-700' },
  { id: 'slate', label: 'Серый', value: 'from-slate-500 to-gray-700' },
];

const CATEGORIES = ['Город', 'Еда', 'IT', 'Спорт', 'Музыка', 'Игры', 'Фото', 'Искусство', 'Книги', 'Авто', 'Путешествия', 'Бизнес', 'Учёба', 'Здоровье', 'Другое'];

const TOPIC_ICONS = ['💬', '📍', '🏷️', '🎉', '💡', '📋', '📁', '📝', '❓', '💰', '🔥', '📢', '🎯', '🎮', '🎵', '📸', '🏃', '⚽', '🍕', '📚'];

const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'c1', name: 'Алматы | Reality Map', avatar: '🏔️', avatarBg: 'from-purple-600 to-indigo-700',
    membersCount: 2847, description: 'Главное сообщество Reality Map в Алматы. Места, события, люди.',
    isPublic: true, category: 'Город', createdAt: Date.now() - 86400000 * 90,
    topics: [
      { id: 't1', title: 'ЧАТ', icon: '💬', iconBg: 'bg-purple-500/20', pinned: true, messagesCount: 1523, createdAt: Date.now() - 86400000 * 30,
        lastMessage: { id: 'm1', senderName: 'Алия', senderColor: 'text-pink-400', text: '‼️ не забываем про митап в 16:00‼️', timestamp: Date.now() - 3600000 * 2 } },
      { id: 't2', title: 'Новые места', icon: '📍', iconBg: 'bg-green-500/20', pinned: true, messagesCount: 456, createdAt: Date.now() - 86400000 * 25,
        lastMessage: { id: 'm2', senderName: 'Мансур', senderColor: 'text-blue-400', text: 'Открылась новая кофейня на Достык — капучино огонь', timestamp: Date.now() - 3600000 } },
      { id: 't3', title: 'Инфа о скидках', icon: '🏷️', iconBg: 'bg-amber-500/20', messagesCount: 312, createdAt: Date.now() - 86400000 * 20,
        lastMessage: { id: 'm3', senderName: 'di jet', senderColor: 'text-cyan-400', text: 'КЕТЕМ. СЛОВАКИЯ, 2.pdf', timestamp: Date.now() - 86400000 } },
      { id: 't4', title: 'Ивенты и митапы', icon: '🎉', iconBg: 'bg-pink-500/20', messagesCount: 201, createdAt: Date.now() - 86400000 * 15,
        lastMessage: { id: 'm4', senderName: 'Манс', senderColor: 'text-green-400', text: '🎥 Video message', timestamp: Date.now() - 86400000 * 7 } },
      { id: 't5', title: 'Полезности', icon: '💡', iconBg: 'bg-emerald-500/20', messagesCount: 178, createdAt: Date.now() - 86400000 * 10,
        lastMessage: { id: 'm5', senderName: 'di jet', senderColor: 'text-cyan-400', text: '🇰🇿 https://docs.google.com/spreadsheets...', timestamp: Date.now() - 86400000 * 12 } },
      { id: 't6', title: 'Правила', icon: '📋', iconBg: 'bg-red-500/20', messagesCount: 12, createdAt: Date.now() - 86400000 * 30,
        lastMessage: { id: 'm6', senderName: 'Mr Guevara (Admin)', senderColor: 'text-amber-400', text: '📎 https://...', timestamp: Date.now() - 86400000 * 32 } },
    ],
  },
  {
    id: 'c2', name: 'Астана | Reality Map', avatar: '🏙️', avatarBg: 'from-cyan-600 to-blue-700',
    membersCount: 1934, description: 'Сообщество Reality Map в столице. Делимся местами и вайбами.',
    isPublic: true, category: 'Город', createdAt: Date.now() - 86400000 * 60,
    topics: [
      { id: 't20', title: 'ЧАТ', icon: '💬', iconBg: 'bg-purple-500/20', pinned: true, messagesCount: 834, createdAt: Date.now() - 86400000 * 30,
        lastMessage: { id: 'm20', senderName: 'Дана', senderColor: 'text-pink-400', text: 'Кто идёт на Expo сегодня?', timestamp: Date.now() - 7200000 } },
      { id: 't21', title: 'Заведения', icon: '☕', iconBg: 'bg-amber-500/20', messagesCount: 267, createdAt: Date.now() - 86400000 * 20,
        lastMessage: { id: 'm21', senderName: 'Арман', senderColor: 'text-green-400', text: 'Новый ресторан на Левом — просто топ', timestamp: Date.now() - 14400000 } },
      { id: 't22', title: 'Попутчики', icon: '🚗', iconBg: 'bg-blue-500/20', messagesCount: 145, createdAt: Date.now() - 86400000 * 15,
        lastMessage: { id: 'm22', senderName: 'Бекзат', senderColor: 'text-cyan-400', text: 'Еду в Алматы в пятницу, 2 места', timestamp: Date.now() - 28800000 } },
    ],
  },
  {
    id: 'c3', name: 'Фудиз Казахстана', avatar: '🍜', avatarBg: 'from-orange-500 to-red-600',
    membersCount: 5621, description: 'Любители вкусной еды. Обзоры, рекомендации, секретные места.',
    isPublic: true, category: 'Еда', createdAt: Date.now() - 86400000 * 120,
    topics: [
      { id: 't30', title: 'Обсуждение', icon: '🗣️', iconBg: 'bg-purple-500/20', pinned: true, messagesCount: 2341, createdAt: Date.now() - 86400000 * 60,
        lastMessage: { id: 'm30', senderName: 'Айжан', senderColor: 'text-pink-400', text: 'Бешбармак в Алашахане — 10/10 🔥', timestamp: Date.now() - 1800000 } },
      { id: 't31', title: 'Рецепты', icon: '👨‍🍳', iconBg: 'bg-green-500/20', messagesCount: 567, createdAt: Date.now() - 86400000 * 45,
        lastMessage: { id: 'm31', senderName: 'Нурлан', senderColor: 'text-amber-400', text: 'Мой рецепт баурсаков — просто бомба', timestamp: Date.now() - 43200000 } },
    ],
  },
  {
    id: 'c4', name: 'IT Meetups KZ', avatar: '💻', avatarBg: 'from-green-500 to-emerald-700',
    membersCount: 3412, description: 'IT-комьюнити Казахстана. Митапы, вакансии, нетворкинг.',
    isPublic: true, category: 'IT', createdAt: Date.now() - 86400000 * 180,
    topics: [
      { id: 't40', title: 'Общий чат', icon: '💬', iconBg: 'bg-purple-500/20', pinned: true, messagesCount: 4521, createdAt: Date.now() - 86400000 * 90,
        lastMessage: { id: 'm40', senderName: 'Ерлан', senderColor: 'text-green-400', text: 'Кто был на DevFest? Как вам?', timestamp: Date.now() - 5400000 } },
      { id: 't41', title: 'Вакансии', icon: '💼', iconBg: 'bg-amber-500/20', messagesCount: 876, createdAt: Date.now() - 86400000 * 60,
        lastMessage: { id: 'm41', senderName: 'HR Kaspi', senderColor: 'text-yellow-400', text: 'Senior React Dev, от 1.5М тг', timestamp: Date.now() - 10800000 } },
      { id: 't42', title: 'Стартапы', icon: '🚀', iconBg: 'bg-pink-500/20', messagesCount: 345, createdAt: Date.now() - 86400000 * 45,
        lastMessage: { id: 'm42', senderName: 'Асель', senderColor: 'text-pink-400', text: 'Ищу кофаундера для EdTech проекта', timestamp: Date.now() - 21600000 } },
    ],
  },
  {
    id: 'c5', name: 'Спорт & Активности', avatar: '⚽', avatarBg: 'from-blue-500 to-indigo-600',
    membersCount: 1876, description: 'Бег, футбол, теннис, хайкинг — находи партнёров.',
    isPublic: true, category: 'Спорт', createdAt: Date.now() - 86400000 * 150,
    topics: [
      { id: 't50', title: 'Бег', icon: '🏃', iconBg: 'bg-green-500/20', messagesCount: 654, createdAt: Date.now() - 86400000 * 30,
        lastMessage: { id: 'm50', senderName: 'Тимур', senderColor: 'text-green-400', text: '10 км за 48 мин! Новый рекорд 🏃‍♂️', timestamp: Date.now() - 3600000 * 5 } },
      { id: 't51', title: 'Футбол', icon: '⚽', iconBg: 'bg-blue-500/20', messagesCount: 432, createdAt: Date.now() - 86400000 * 25,
        lastMessage: { id: 'm51', senderName: 'Нурсултан', senderColor: 'text-blue-400', text: 'Нужен вратарь на воскресенье, 10:00', timestamp: Date.now() - 3600000 * 8 } },
    ],
  },
];

/* ─── Mock topic chat messages ─── */

const MOCK_TOPIC_MESSAGES: Record<string, TopicMessage[]> = {
  t1: [
    { id: 'tm1', senderName: 'Алия', senderColor: 'text-pink-400', text: 'Всем привет! 👋', timestamp: Date.now() - 86400000 },
    { id: 'tm2', senderName: 'Мансур', senderColor: 'text-blue-400', text: 'Привет! Кто был на митапе вчера?', timestamp: Date.now() - 82800000 },
    { id: 'tm3', senderName: 'Данияр', senderColor: 'text-green-400', text: 'Я был! Очень круто было, особенно доклад про AI', timestamp: Date.now() - 79200000 },
    { id: 'tm4', senderName: 'Айгерим', senderColor: 'text-amber-400', text: 'А следующий когда планируется?', timestamp: Date.now() - 75600000 },
    { id: 'tm5', senderName: 'Алия', senderColor: 'text-pink-400', text: '‼️ не забываем про митап в 16:00‼️', timestamp: Date.now() - 3600000 * 2 },
  ],
  t2: [
    { id: 'tm10', senderName: 'Мансур', senderColor: 'text-blue-400', text: 'Открылась новая кофейня на Достык — капучино огонь 🔥', timestamp: Date.now() - 3600000 },
    { id: 'tm11', senderName: 'Самал', senderColor: 'text-cyan-400', text: 'О, надо зайти! Как называется?', timestamp: Date.now() - 3000000 },
    { id: 'tm12', senderName: 'Мансур', senderColor: 'text-blue-400', text: 'Brew Lab, рядом с Достык Плаза', timestamp: Date.now() - 2400000 },
  ],
};

const TOPIC_AUTO_REPLIES = [
  'Класс! 🔥', 'Согласен 👍', 'О, интересно!', 'Кто ещё идёт?',
  'Всем привет! 👋', 'Круто, спасибо за инфу!', '+1', 'Отлично!',
  'А где именно?', 'Надо попробовать!', 'Поддерживаю 💪',
  'Когда следующий?', 'Записываюсь!', 'Можно подробнее?',
];

const REPLY_NAMES = [
  { name: 'Алия', color: 'text-pink-400' },
  { name: 'Мансур', color: 'text-blue-400' },
  { name: 'Данияр', color: 'text-green-400' },
  { name: 'Айгерим', color: 'text-amber-400' },
  { name: 'Самал', color: 'text-cyan-400' },
  { name: 'Тимур', color: 'text-emerald-400' },
  { name: 'Дана', color: 'text-violet-400' },
  { name: 'Арман', color: 'text-orange-400' },
];

/* ─── Helpers ─── */

function formatTimestamp(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Сейчас';
  if (mins < 60) return `${mins} мин`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Вчера';
  if (days < 7) {
    return new Date(ts).toLocaleDateString('ru-RU', { weekday: 'short' });
  }
  return new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function formatMessageTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

/* ─── Component ─── */

interface CommunitiesScreenProps {
  onBack?: () => void;
}

type ViewType = 'list' | 'community' | 'topic' | 'create' | 'settings' | 'editTopic';

export function CommunitiesScreen({ onBack }: CommunitiesScreenProps) {
  const { user } = useUser();
  const [communities, setCommunities] = useState<Community[]>(INITIAL_COMMUNITIES);
  const [view, setView] = useState<ViewType>('list');
  const [prevView, setPrevView] = useState<ViewType>('list');
  const [activeCommunity, setActiveCommunity] = useState<Community | null>(null);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [topicMessages, setTopicMessages] = useState<Record<string, TopicMessage[]>>(MOCK_TOPIC_MESSAGES);
  const [typing, setTyping] = useState(false);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicIcon, setNewTopicIcon] = useState('💬');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Create community wizard state
  const [createStep, setCreateStep] = useState(0);
  const [newCommunity, setNewCommunity] = useState<Partial<Community>>({
    name: '', description: '', avatar: '🔥', avatarBg: 'from-purple-600 to-indigo-700',
    isPublic: true, category: 'Другое', rules: '', welcomeMessage: '',
  });
  const [initialTopics, setInitialTopics] = useState<{ title: string; icon: string }[]>([
    { title: 'Общий чат', icon: '💬' },
  ]);

  // Edit community state
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editTopicTitle, setEditTopicTitle] = useState('');
  const [editTopicIcon, setEditTopicIcon] = useState('');
  const [showTopicActions, setShowTopicActions] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [topicMessages, activeTopic]);

  /* ─── Navigation ─── */
  const openCommunity = (community: Community) => {
    setActiveCommunity(community);
    setView('community');
    setShowSearch(false);
    setSearchQuery('');
  };

  const openTopic = (topic: Topic) => {
    setActiveTopic(topic);
    setView('topic');
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const goBack = () => {
    if (view === 'topic') { setView('community'); setActiveTopic(null); }
    else if (view === 'community') { setView('list'); setActiveCommunity(null); }
    else if (view === 'settings') { setView('community'); setEditField(null); }
    else if (view === 'editTopic') { setView('settings'); setEditingTopic(null); }
    else if (view === 'create') { setView('list'); resetCreateForm(); }
  };

  const resetCreateForm = () => {
    setCreateStep(0);
    setNewCommunity({ name: '', description: '', avatar: '🔥', avatarBg: 'from-purple-600 to-indigo-700', isPublic: true, category: 'Другое', rules: '', welcomeMessage: '' });
    setInitialTopics([{ title: 'Общий чат', icon: '💬' }]);
  };

  /* ─── Actions ─── */
  const sendMessage = () => {
    if (!messageText.trim() || !activeTopic || !user) return;
    const topicId = activeTopic.id;
    const newMsg: TopicMessage = {
      id: `tm_${Date.now()}`, senderName: user.name || 'Я', senderColor: 'text-purple-400',
      text: messageText.trim(), timestamp: Date.now(),
    };
    setTopicMessages(prev => ({ ...prev, [topicId]: [...(prev[topicId] || []), newMsg] }));
    setMessageText('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const sender = REPLY_NAMES[Math.floor(Math.random() * REPLY_NAMES.length)];
      const reply: TopicMessage = {
        id: `tm_${Date.now()}_r`, senderName: sender.name, senderColor: sender.color,
        text: TOPIC_AUTO_REPLIES[Math.floor(Math.random() * TOPIC_AUTO_REPLIES.length)], timestamp: Date.now(),
      };
      setTopicMessages(prev => ({ ...prev, [topicId]: [...(prev[topicId] || []), reply] }));
    }, 1200 + Math.random() * 2000);
  };

  const createTopic = () => {
    if (!newTopicTitle.trim() || !activeCommunity) return;
    const newTopic: Topic = {
      id: `t_new_${Date.now()}`, title: newTopicTitle.trim(), icon: newTopicIcon, iconBg: 'bg-gray-500/20',
      messagesCount: 0, createdAt: Date.now(),
      lastMessage: { id: `sys_${Date.now()}`, senderName: 'Система', senderColor: 'text-gray-400',
        text: `Топик «${newTopicTitle.trim()}» создан`, timestamp: Date.now(), isSystem: true },
    };
    const updated = { ...activeCommunity, topics: [...activeCommunity.topics, newTopic] };
    setActiveCommunity(updated);
    setCommunities(prev => prev.map(c => c.id === updated.id ? updated : c));
    setNewTopicTitle(''); setNewTopicIcon('💬'); setShowCreateTopic(false);
  };

  const createCommunity = () => {
    if (!newCommunity.name?.trim()) return;
    const topics: Topic[] = initialTopics.filter(t => t.title.trim()).map((t, i) => ({
      id: `t_created_${Date.now()}_${i}`, title: t.title.trim(), icon: t.icon, iconBg: 'bg-gray-500/20',
      messagesCount: 0, createdAt: Date.now(),
      lastMessage: { id: `sys_c_${Date.now()}_${i}`, senderName: 'Система', senderColor: 'text-gray-400',
        text: `Топик «${t.title.trim()}» создан`, timestamp: Date.now(), isSystem: true },
    }));
    const community: Community = {
      id: `c_new_${Date.now()}`, name: newCommunity.name!.trim(), avatar: newCommunity.avatar || '🔥',
      avatarBg: newCommunity.avatarBg || 'from-purple-600 to-indigo-700', membersCount: 1,
      description: newCommunity.description || '', isPublic: newCommunity.isPublic ?? true,
      category: newCommunity.category || 'Другое', isOwner: true, createdAt: Date.now(),
      topics, rules: newCommunity.rules, welcomeMessage: newCommunity.welcomeMessage,
    };
    setCommunities(prev => [community, ...prev]);
    resetCreateForm();
    openCommunity(community);
  };

  const deleteCommunity = () => {
    if (!activeCommunity) return;
    setCommunities(prev => prev.filter(c => c.id !== activeCommunity.id));
    setActiveCommunity(null);
    setShowDeleteConfirm(false);
    setView('list');
  };

  const updateCommunity = (updates: Partial<Community>) => {
    if (!activeCommunity) return;
    const updated = { ...activeCommunity, ...updates };
    setActiveCommunity(updated);
    setCommunities(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const toggleTopicPin = (topicId: string) => {
    if (!activeCommunity) return;
    const updatedTopics = activeCommunity.topics.map(t =>
      t.id === topicId ? { ...t, pinned: !t.pinned } : t
    );
    updateCommunity({ topics: updatedTopics });
    setShowTopicActions(null);
  };

  const deleteTopicFromCommunity = (topicId: string) => {
    if (!activeCommunity) return;
    updateCommunity({ topics: activeCommunity.topics.filter(t => t.id !== topicId) });
    setShowTopicActions(null);
  };

  const saveEditedTopic = () => {
    if (!activeCommunity || !editingTopic || !editTopicTitle.trim()) return;
    const updatedTopics = activeCommunity.topics.map(t =>
      t.id === editingTopic.id ? { ...t, title: editTopicTitle.trim(), icon: editTopicIcon } : t
    );
    updateCommunity({ topics: updatedTopics });
    setEditingTopic(null);
    setView('settings');
  };

  /* ─── Topic Chat View ─── */
  if (view === 'topic' && activeTopic && activeCommunity) {
    const messages = topicMessages[activeTopic.id] || [];
    return (
      <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden">
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-3 shrink-0">
          <button onClick={goBack} className="p-1.5 rounded-full hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className={`w-9 h-9 rounded-full ${activeTopic.iconBg} flex items-center justify-center text-lg shrink-0`}>
              {activeTopic.icon}
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-semibold text-sm truncate">{activeTopic.title}</h2>
              <p className="text-gray-500 text-[11px] truncate">{activeCommunity.name} · {activeTopic.messagesCount} сообщений</p>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <MoreVertical className="w-4.5 h-4.5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className={`w-16 h-16 rounded-2xl ${activeTopic.iconBg} flex items-center justify-center text-3xl mb-4`}>{activeTopic.icon}</div>
              <h3 className="text-white font-bold text-lg mb-1">{activeTopic.title}</h3>
              <p className="text-gray-500 text-sm">Начните обсуждение в этом топике!</p>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => {
                const isMe = msg.senderName === (user?.name || 'Я');
                const prevMsg = i > 0 ? messages[i - 1] : null;
                const showDate = !prevMsg || new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();
                const isConsecutive = prevMsg && prevMsg.senderName === msg.senderName && (msg.timestamp - prevMsg.timestamp) < 120000;
                if (msg.isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center my-3">
                      <span className="px-3 py-1 rounded-full bg-gray-800/60 text-gray-500 text-[11px]">{msg.text}</span>
                    </div>
                  );
                }
                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <span className="px-3 py-1 rounded-full bg-gray-800/60 text-gray-500 text-[10px] font-medium">
                          {new Date(msg.timestamp).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                        </span>
                      </div>
                    )}
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }} className={`${isConsecutive ? 'mt-0.5' : 'mt-3'}`}>
                      <div className={`max-w-[85%] ${isMe ? 'ml-auto' : ''}`}>
                        <div className={`${isMe ? 'rounded-2xl rounded-br-md bg-gradient-to-br from-purple-600 to-pink-600' : 'rounded-2xl rounded-bl-md bg-gray-800'} px-3.5 py-2 shadow-sm`}>
                          {!isMe && !isConsecutive && (<p className={`text-[12px] font-semibold mb-0.5 ${msg.senderColor}`}>{msg.senderName}</p>)}
                          <p className="text-[14px] text-white leading-snug whitespace-pre-wrap">{msg.text}</p>
                          <div className={`flex items-center gap-1 justify-end mt-0.5 ${isMe ? 'text-purple-200/70' : 'text-gray-500'}`}>
                            <span className="text-[10px]">{formatMessageTime(msg.timestamp)}</span>
                            {isMe && <CheckCheck className="w-3 h-3 text-blue-300" />}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
              <AnimatePresence>
                {typing && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mt-3">
                    <div className="bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3 inline-block">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="bg-gray-900 border-t border-gray-800 px-3 py-2.5 flex items-end gap-2 shrink-0">
          <button className="p-2 rounded-full text-gray-500 hover:text-gray-300 transition-colors shrink-0"><Image className="w-5 h-5" /></button>
          <div className="flex-1 bg-gray-800 rounded-2xl flex items-end">
            <input ref={inputRef} value={messageText} onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Сообщение..." className="flex-1 bg-transparent text-white placeholder:text-gray-500 px-4 py-2.5 outline-none text-sm" />
            <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors shrink-0"><Smile className="w-5 h-5" /></button>
          </div>
          {messageText.trim() ? (
            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={sendMessage}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/30">
              <Send className="w-4.5 h-4.5 text-white ml-0.5" />
            </motion.button>
          ) : (
            <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors shrink-0"><Mic className="w-5 h-5" /></button>
          )}
        </div>
      </div>
    );
  }

  /* ─── Community Settings View ─── */
  if (view === 'settings' && activeCommunity) {
    return (
      <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden">
        <div className="bg-gray-900 border-b border-gray-800 px-4 pt-12 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="p-1.5 rounded-full hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-white font-bold text-lg flex-1">Настройки</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Community preview card */}
          <div className="p-5 flex flex-col items-center">
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${activeCommunity.avatarBg} flex items-center justify-center text-5xl shadow-xl mb-4`}>
              {activeCommunity.avatar}
            </div>
            <h3 className="text-white font-bold text-xl text-center">{activeCommunity.name}</h3>
            <p className="text-gray-500 text-sm mt-1">{activeCommunity.membersCount.toLocaleString()} участников · {activeCommunity.topics.length} топиков</p>
            <div className="flex items-center gap-1.5 mt-2">
              {activeCommunity.isPublic ? <Globe className="w-3.5 h-3.5 text-green-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
              <span className={`text-xs font-medium ${activeCommunity.isPublic ? 'text-green-400' : 'text-amber-400'}`}>
                {activeCommunity.isPublic ? 'Публичное' : 'Приватное'}
              </span>
              <span className="text-gray-700 text-xs mx-1">·</span>
              <span className="text-gray-500 text-xs">{activeCommunity.category}</span>
            </div>
          </div>

          {/* Basic info section */}
          <div className="px-5 pb-2">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Основная информация</h4>
          </div>

          {/* Edit Name */}
          <SettingsRow icon={<Type className="w-4.5 h-4.5 text-purple-400" />} label="Название" value={activeCommunity.name}
            onEdit={() => { setEditField('name'); setEditValue(activeCommunity.name); }} />

          {/* Edit Description */}
          <SettingsRow icon={<FileText className="w-4.5 h-4.5 text-blue-400" />} label="Описание"
            value={activeCommunity.description || 'Не указано'}
            onEdit={() => { setEditField('description'); setEditValue(activeCommunity.description); }} />

          {/* Edit Category */}
          <SettingsRow icon={<Hash className="w-4.5 h-4.5 text-cyan-400" />} label="Категория" value={activeCommunity.category}
            onEdit={() => { setEditField('category'); setEditValue(activeCommunity.category); }} />

          {/* Toggle Public/Private */}
          <button onClick={() => updateCommunity({ isPublic: !activeCommunity.isPublic })}
            className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-gray-800/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0">
              {activeCommunity.isPublic ? <Globe className="w-4.5 h-4.5 text-green-400" /> : <Lock className="w-4.5 h-4.5 text-amber-400" />}
            </div>
            <div className="flex-1 text-left">
              <p className="text-white text-sm font-medium">Тип сообщества</p>
              <p className="text-gray-500 text-[11px]">{activeCommunity.isPublic ? 'Публичное — видно всем' : 'Приватное — по приглашению'}</p>
            </div>
            <div className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${activeCommunity.isPublic ? 'bg-green-500' : 'bg-gray-700'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${activeCommunity.isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </button>

          {/* Appearance section */}
          <div className="px-5 pt-4 pb-2">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Внешний вид</h4>
          </div>

          {/* Edit Avatar */}
          <SettingsRow icon={<Smile className="w-4.5 h-4.5 text-amber-400" />} label="Эмодзи-аватар" value={activeCommunity.avatar}
            onEdit={() => setEditField('avatar')} />

          {/* Edit Gradient */}
          <SettingsRow icon={<Palette className="w-4.5 h-4.5 text-pink-400" />} label="Цвет фона"
            value={COMMUNITY_GRADIENTS.find(g => g.value === activeCommunity.avatarBg)?.label || 'Фиолетовый'}
            onEdit={() => setEditField('gradient')} />

          {/* Topics management */}
          <div className="px-5 pt-4 pb-2">
            <div className="flex items-center justify-between">
              <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Топики ({activeCommunity.topics.length})</h4>
              <button onClick={() => setShowCreateTopic(true)} className="text-purple-400 text-xs font-semibold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Добавить
              </button>
            </div>
          </div>

          {activeCommunity.topics.map(topic => (
            <div key={topic.id} className="relative">
              <button
                onClick={() => setShowTopicActions(showTopicActions === topic.id ? null : topic.id)}
                className="w-full px-5 py-3 flex items-center gap-3 hover:bg-gray-800/40 transition-colors"
              >
                <div className={`w-9 h-9 rounded-full ${topic.iconBg || 'bg-gray-500/20'} flex items-center justify-center text-lg shrink-0`}>
                  {topic.icon}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    {topic.pinned && <Pin className="w-3 h-3 text-gray-500" />}
                    <span className="text-white text-sm font-medium truncate">{topic.title}</span>
                  </div>
                  <span className="text-gray-600 text-[11px]">{topic.messagesCount} сообщений</span>
                </div>
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>

              {/* Topic actions dropdown */}
              <AnimatePresence>
                {showTopicActions === topic.id && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute right-4 top-12 bg-gray-800 rounded-xl border border-gray-700/50 shadow-xl z-20 overflow-hidden min-w-[180px]">
                    <button onClick={() => { setEditingTopic(topic); setEditTopicTitle(topic.title); setEditTopicIcon(topic.icon); setView('editTopic'); setShowTopicActions(null); }}
                      className="w-full px-4 py-3 flex items-center gap-2.5 hover:bg-gray-700/50 text-left">
                      <Edit3 className="w-4 h-4 text-blue-400" /><span className="text-white text-sm">Редактировать</span>
                    </button>
                    <button onClick={() => toggleTopicPin(topic.id)} className="w-full px-4 py-3 flex items-center gap-2.5 hover:bg-gray-700/50 text-left">
                      {topic.pinned ? <PinOff className="w-4 h-4 text-gray-400" /> : <Pin className="w-4 h-4 text-amber-400" />}
                      <span className="text-white text-sm">{topic.pinned ? 'Открепить' : 'Закрепить'}</span>
                    </button>
                    <button onClick={() => deleteTopicFromCommunity(topic.id)}
                      className="w-full px-4 py-3 flex items-center gap-2.5 hover:bg-gray-700/50 text-left border-t border-gray-700/30">
                      <Trash2 className="w-4 h-4 text-red-400" /><span className="text-red-400 text-sm">Удалить</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Additional settings */}
          <div className="px-5 pt-4 pb-2">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Дополнительно</h4>
          </div>

          <SettingsRow icon={<Shield className="w-4.5 h-4.5 text-emerald-400" />} label="Правила"
            value={activeCommunity.rules || 'Не заданы'}
            onEdit={() => { setEditField('rules'); setEditValue(activeCommunity.rules || ''); }} />

          <SettingsRow icon={<MessageSquare className="w-4.5 h-4.5 text-violet-400" />} label="Приветствие"
            value={activeCommunity.welcomeMessage || 'Не задано'}
            onEdit={() => { setEditField('welcomeMessage'); setEditValue(activeCommunity.welcomeMessage || ''); }} />

          {/* Danger zone */}
          <div className="px-5 pt-6 pb-2">
            <h4 className="text-red-400/60 text-[10px] font-bold uppercase tracking-wider mb-2">Опасная зона</h4>
          </div>
          <button onClick={() => setShowDeleteConfirm(true)}
            className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-red-500/10 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
              <Trash2 className="w-4.5 h-4.5 text-red-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-red-400 text-sm font-medium">Удалить сообщество</p>
              <p className="text-red-400/40 text-[11px]">Это действие нельзя отменить</p>
            </div>
          </button>

          <div className="h-20" />
        </div>

        {/* Edit field modal */}
        <AnimatePresence>
          {editField && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={() => setEditField(null)}>
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
                onClick={e => e.stopPropagation()} className="w-full max-w-lg bg-gray-900 rounded-t-3xl border-t border-gray-700/30 p-5 max-h-[80vh] overflow-y-auto">
                <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-5" />

                {editField === 'avatar' && (
                  <>
                    <h3 className="text-white font-bold text-lg mb-4">Выберите эмодзи</h3>
                    <div className="flex flex-wrap gap-2.5">
                      {COMMUNITY_AVATARS.map(a => (
                        <button key={a} onClick={() => { updateCommunity({ avatar: a }); setEditField(null); }}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${activeCommunity.avatar === a ? 'bg-purple-500/30 ring-2 ring-purple-500 scale-110' : 'bg-gray-800 hover:bg-gray-700'}`}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {editField === 'gradient' && (
                  <>
                    <h3 className="text-white font-bold text-lg mb-4">Цвет фона</h3>
                    <div className="grid grid-cols-3 gap-2.5">
                      {COMMUNITY_GRADIENTS.map(g => (
                        <button key={g.id} onClick={() => { updateCommunity({ avatarBg: g.value }); setEditField(null); }}
                          className={`rounded-xl overflow-hidden transition-all ${activeCommunity.avatarBg === g.value ? 'ring-2 ring-purple-500 scale-105' : ''}`}>
                          <div className={`h-16 bg-gradient-to-br ${g.value} flex items-center justify-center`}>
                            <span className="text-2xl">{activeCommunity.avatar}</span>
                          </div>
                          <div className="bg-gray-800 px-2 py-1.5">
                            <span className="text-gray-300 text-[11px] font-medium">{g.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {editField === 'category' && (
                  <>
                    <h3 className="text-white font-bold text-lg mb-4">Категория</h3>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => { updateCommunity({ category: cat }); setEditField(null); }}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCommunity.category === cat ? 'bg-purple-500/30 text-purple-300 ring-1 ring-purple-500' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {(editField === 'name' || editField === 'description' || editField === 'rules' || editField === 'welcomeMessage') && (
                  <>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {editField === 'name' ? 'Название' : editField === 'description' ? 'Описание' : editField === 'rules' ? 'Правила сообщества' : 'Приветственное сообщение'}
                    </h3>
                    {editField === 'name' ? (
                      <input autoFocus value={editValue} onChange={e => setEditValue(e.target.value)}
                        placeholder="Введите название" maxLength={60}
                        className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder:text-gray-500 outline-none text-sm border border-gray-700 focus:border-purple-500/50 mb-2" />
                    ) : (
                      <textarea autoFocus value={editValue} onChange={e => setEditValue(e.target.value)}
                        placeholder={editField === 'description' ? 'Описание сообщества...' : editField === 'rules' ? 'Правила сообщества...' : 'Сообщение для новых участников...'}
                        rows={4} maxLength={500}
                        className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder:text-gray-500 outline-none text-sm border border-gray-700 focus:border-purple-500/50 resize-none mb-2" />
                    )}
                    <p className="text-gray-600 text-[11px] text-right mb-4">{editValue.length}/{editField === 'name' ? 60 : 500}</p>
                    <button onClick={() => {
                      if (editField === 'name' && editValue.trim()) updateCommunity({ name: editValue.trim() });
                      else if (editField === 'description') updateCommunity({ description: editValue.trim() });
                      else if (editField === 'rules') updateCommunity({ rules: editValue.trim() });
                      else if (editField === 'welcomeMessage') updateCommunity({ welcomeMessage: editValue.trim() });
                      setEditField(null);
                    }} disabled={editField === 'name' && !editValue.trim()}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm disabled:opacity-40">
                      Сохранить
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete confirmation */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowDeleteConfirm(false)}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}
                className="w-full max-w-sm bg-gray-900 rounded-2xl border border-gray-700/30 p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Удалить сообщество?</h3>
                <p className="text-gray-500 text-sm mb-6">«{activeCommunity.name}» будет удалено навсегда со всеми топиками и сообщениями.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 font-semibold text-sm">Отмена</button>
                  <button onClick={deleteCommunity} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm">Удалить</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create topic modal inside settings */}
        <AnimatePresence>
          {showCreateTopic && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={() => setShowCreateTopic(false)}>
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
                onClick={e => e.stopPropagation()} className="w-full max-w-lg bg-gray-900 rounded-t-3xl border-t border-gray-700/30 p-5">
                <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-5" />
                <h3 className="text-white font-bold text-lg mb-4">Новый топик</h3>
                <p className="text-gray-500 text-xs mb-2 font-medium">Иконка</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {TOPIC_ICONS.map(icon => (
                    <button key={icon} onClick={() => setNewTopicIcon(icon)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${newTopicIcon === icon ? 'bg-purple-500/30 ring-2 ring-purple-500 scale-110' : 'bg-gray-800 hover:bg-gray-700'}`}>
                      {icon}
                    </button>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mb-2 font-medium">Название</p>
                <input autoFocus value={newTopicTitle} onChange={e => setNewTopicTitle(e.target.value)}
                  placeholder="Введите название топика" className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder:text-gray-500 outline-none text-sm border border-gray-700 focus:border-purple-500/50 mb-4"
                  onKeyDown={e => { if (e.key === 'Enter') createTopic(); }} />
                <button onClick={createTopic} disabled={!newTopicTitle.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm disabled:opacity-40">
                  Создать топик
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ─── Edit Topic View ─── */
  if (view === 'editTopic' && editingTopic && activeCommunity) {
    return (
      <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden">
        <div className="bg-gray-900 border-b border-gray-800 px-4 pt-12 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="p-1.5 rounded-full hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-white font-bold text-lg flex-1">Редактировать топик</h2>
            <button onClick={saveEditedTopic} disabled={!editTopicTitle.trim()}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold disabled:opacity-40">
              Готово
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Preview */}
          <div className="flex flex-col items-center py-4">
            <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center text-4xl mb-3">
              {editTopicIcon}
            </div>
            <p className="text-white font-bold text-lg">{editTopicTitle || 'Название топика'}</p>
          </div>

          <div>
            <p className="text-gray-500 text-xs mb-2 font-medium">Иконка</p>
            <div className="flex flex-wrap gap-2">
              {TOPIC_ICONS.map(icon => (
                <button key={icon} onClick={() => setEditTopicIcon(icon)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${editTopicIcon === icon ? 'bg-purple-500/30 ring-2 ring-purple-500 scale-110' : 'bg-gray-800 hover:bg-gray-700'}`}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-xs mb-2 font-medium">Название</p>
            <input value={editTopicTitle} onChange={e => setEditTopicTitle(e.target.value)}
              placeholder="Введите название" maxLength={40}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder:text-gray-500 outline-none text-sm border border-gray-700 focus:border-purple-500/50" />
            <p className="text-gray-600 text-[11px] text-right mt-1">{editTopicTitle.length}/40</p>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Create Community Wizard ─── */
  if (view === 'create') {
    const steps = [
      { title: 'Основное', subtitle: 'Название и описание' },
      { title: 'Внешний вид', subtitle: 'Аватар и цвет' },
      { title: 'Настройки', subtitle: 'Приватность и категория' },
      { title: 'Топики', subtitle: 'Начальные разделы' },
    ];

    const canProceed = () => {
      if (createStep === 0) return !!newCommunity.name?.trim();
      return true;
    };

    return (
      <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden">
        <div className="bg-gray-900 border-b border-gray-800 px-4 pt-12 pb-4 shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={goBack} className="p-1.5 rounded-full hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1">
              <h2 className="text-white font-bold text-lg">Новое сообщество</h2>
              <p className="text-gray-500 text-[11px]">{steps[createStep].subtitle}</p>
            </div>
            <span className="text-gray-500 text-sm font-medium">{createStep + 1}/{steps.length}</span>
          </div>

          {/* Progress bar */}
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i <= createStep ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-800'}`} />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            {/* Step 0: Name & Description */}
            {createStep === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="flex flex-col items-center py-4">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${newCommunity.avatarBg} flex items-center justify-center text-4xl shadow-xl mb-3`}>
                    {newCommunity.avatar}
                  </div>
                  <p className="text-gray-500 text-sm">Предпросмотр</p>
                </div>

                <div>
                  <label className="text-gray-400 text-xs font-semibold mb-2 block">Название <span className="text-red-400">*</span></label>
                  <input autoFocus value={newCommunity.name || ''} onChange={e => setNewCommunity(p => ({ ...p, name: e.target.value }))}
                    placeholder="Например: Алматы Фудиз" maxLength={60}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder:text-gray-500 outline-none text-sm border border-gray-700 focus:border-purple-500/50" />
                  <p className="text-gray-600 text-[11px] text-right mt-1">{(newCommunity.name || '').length}/60</p>
                </div>

                <div>
                  <label className="text-gray-400 text-xs font-semibold mb-2 block">Опис��ние</label>
                  <textarea value={newCommunity.description || ''} onChange={e => setNewCommunity(p => ({ ...p, description: e.target.value }))}
                    placeholder="Расскажите, о чём ваше сообщество..." rows={3} maxLength={300}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder:text-gray-500 outline-none text-sm border border-gray-700 focus:border-purple-500/50 resize-none" />
                  <p className="text-gray-600 text-[11px] text-right mt-1">{(newCommunity.description || '').length}/300</p>
                </div>
              </motion.div>
            )}

            {/* Step 1: Avatar & Gradient */}
            {createStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex flex-col items-center py-4">
                  <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${newCommunity.avatarBg} flex items-center justify-center text-5xl shadow-xl mb-2`}>
                    {newCommunity.avatar}
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-xs font-semibold mb-3 block">Эмодзи</label>
                  <div className="flex flex-wrap gap-2.5">
                    {COMMUNITY_AVATARS.map(a => (
                      <button key={a} onClick={() => setNewCommunity(p => ({ ...p, avatar: a }))}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all ${newCommunity.avatar === a ? 'bg-purple-500/30 ring-2 ring-purple-500 scale-110' : 'bg-gray-800 hover:bg-gray-700'}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-xs font-semibold mb-3 block">Цвет фона</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {COMMUNITY_GRADIENTS.map(g => (
                      <button key={g.id} onClick={() => setNewCommunity(p => ({ ...p, avatarBg: g.value }))}
                        className={`rounded-xl overflow-hidden transition-all ${newCommunity.avatarBg === g.value ? 'ring-2 ring-purple-500 scale-105' : ''}`}>
                        <div className={`h-14 bg-gradient-to-br ${g.value} flex items-center justify-center`}>
                          <span className="text-2xl">{newCommunity.avatar}</span>
                        </div>
                        <div className="bg-gray-800 px-2 py-1.5 text-center">
                          <span className="text-gray-300 text-[10px] font-medium">{g.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Privacy & Category */}
            {createStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <label className="text-gray-400 text-xs font-semibold mb-3 block">Тип сообщества</label>
                  <div className="flex gap-3">
                    {[
                      { value: true, label: 'Публичное', desc: 'Найдут все пользователи', icon: Globe, color: 'text-green-400', bg: 'bg-green-500/15', border: 'border-green-500/40' },
                      { value: false, label: 'Приватное', desc: 'Только по приглашению', icon: Lock, color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/40' },
                    ].map(opt => {
                      const Icon = opt.icon;
                      const active = newCommunity.isPublic === opt.value;
                      return (
                        <button key={String(opt.value)} onClick={() => setNewCommunity(p => ({ ...p, isPublic: opt.value }))}
                          className={`flex-1 p-4 rounded-xl border transition-all ${active ? `${opt.bg} ${opt.border}` : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800'}`}>
                          <Icon className={`w-6 h-6 ${active ? opt.color : 'text-gray-500'} mb-2`} />
                          <p className={`font-semibold text-sm ${active ? 'text-white' : 'text-gray-400'}`}>{opt.label}</p>
                          <p className={`text-[11px] mt-0.5 ${active ? 'text-gray-400' : 'text-gray-600'}`}>{opt.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-xs font-semibold mb-3 block">Категория</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => setNewCommunity(p => ({ ...p, category: cat }))}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${newCommunity.category === cat ? 'bg-purple-500/30 text-purple-300 ring-1 ring-purple-500' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-xs font-semibold mb-2 block">Правила (необязательно)</label>
                  <textarea value={newCommunity.rules || ''} onChange={e => setNewCommunity(p => ({ ...p, rules: e.target.value }))}
                    placeholder="Добавьте правила для участников..." rows={3} maxLength={500}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder:text-gray-500 outline-none text-sm border border-gray-700 focus:border-purple-500/50 resize-none" />
                </div>
              </motion.div>
            )}

            {/* Step 3: Initial Topics */}
            {createStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <p className="text-gray-400 text-sm">Добавьте начальные топики (разделы) для вашего сообщества. Можно добавить ещё позже.</p>

                {initialTopics.map((topic, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <button onClick={() => {
                      const icons = TOPIC_ICONS;
                      const curr = icons.indexOf(topic.icon);
                      const next = icons[(curr + 1) % icons.length];
                      setInitialTopics(prev => prev.map((t, i) => i === index ? { ...t, icon: next } : t));
                    }} className="w-11 h-11 rounded-xl bg-gray-800 flex items-center justify-center text-xl shrink-0 hover:bg-gray-700 transition-colors">
                      {topic.icon}
                    </button>
                    <input value={topic.title} onChange={e => setInitialTopics(prev => prev.map((t, i) => i === index ? { ...t, title: e.target.value } : t))}
                      placeholder="Название топика" maxLength={40}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-white placeholder:text-gray-500 outline-none text-sm border border-gray-700 focus:border-purple-500/50" />
                    {initialTopics.length > 1 && (
                      <button onClick={() => setInitialTopics(prev => prev.filter((_, i) => i !== index))}
                        className="p-2 rounded-full hover:bg-red-500/15 transition-colors">
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    )}
                  </div>
                ))}

                {initialTopics.length < 10 && (
                  <button onClick={() => setInitialTopics(prev => [...prev, { title: '', icon: TOPIC_ICONS[prev.length % TOPIC_ICONS.length] }])}
                    className="w-full py-3 rounded-xl border border-dashed border-gray-700 text-gray-500 text-sm font-medium flex items-center justify-center gap-2 hover:border-purple-500/50 hover:text-purple-400 transition-colors">
                    <Plus className="w-4 h-4" /> Добавить топик
                  </button>
                )}

                <div className="bg-gray-800/40 rounded-xl p-4 mt-2">
                  <p className="text-gray-500 text-xs">💡 Совет: создайте «Общий чат» для свободного общения и тематические топики для конкретных обсуждений.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom buttons */}
        <div className="px-5 pb-6 pt-3 flex gap-3 shrink-0 border-t border-gray-800/50">
          {createStep > 0 && (
            <button onClick={() => setCreateStep(s => s - 1)} className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 font-semibold text-sm">
              Назад
            </button>
          )}
          {createStep < steps.length - 1 ? (
            <button onClick={() => setCreateStep(s => s + 1)} disabled={!canProceed()}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm disabled:opacity-40 transition-opacity">
              Далее
            </button>
          ) : (
            <button onClick={createCommunity} disabled={!canProceed()}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm disabled:opacity-40 transition-opacity shadow-lg shadow-purple-500/30">
              🚀 Создать сообщество
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ─── Community Detail View (Topics List) ─── */
  if (view === 'community' && activeCommunity) {
    const sortedTopics = [...activeCommunity.topics].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return (b.lastMessage?.timestamp || b.createdAt) - (a.lastMessage?.timestamp || a.createdAt);
    });
    const filteredTopics = searchQuery
      ? sortedTopics.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : sortedTopics;

    return (
      <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden relative">
        <div className="bg-gray-900 border-b border-gray-800 px-4 pt-12 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="p-1.5 rounded-full hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${activeCommunity.avatarBg} flex items-center justify-center text-xl shrink-0`}>
              {activeCommunity.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold text-base truncate">{activeCommunity.name}</h2>
              <p className="text-gray-500 text-[11px]">{activeCommunity.membersCount.toLocaleString()} участников</p>
            </div>
            <button onClick={() => setShowSearch(!showSearch)} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
              <Search className="w-4.5 h-4.5 text-gray-400" />
            </button>
            <button onClick={() => setView('settings')} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
              <Settings className="w-4.5 h-4.5 text-gray-400" />
            </button>
          </div>

          <AnimatePresence>
            {showSearch && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input autoFocus type="text" placeholder="Поиск топиков..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800 text-white placeholder:text-gray-500 outline-none text-sm border border-gray-700 focus:border-purple-500/50 transition-colors" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredTopics.map((topic) => (
            <button key={topic.id} onClick={() => openTopic(topic)}
              className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-800/50 transition-colors border-b border-gray-800/30 text-left">
              <div className={`w-12 h-12 rounded-full ${topic.iconBg} flex items-center justify-center text-2xl shrink-0`}>{topic.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {topic.pinned && <Pin className="w-3 h-3 text-gray-500 shrink-0" />}
                  <h3 className="text-white font-semibold text-[15px] truncate">{topic.title}</h3>
                  <span className="text-gray-600 text-[11px] ml-auto shrink-0">{topic.lastMessage ? formatTimestamp(topic.lastMessage.timestamp) : ''}</span>
                </div>
                {topic.lastMessage && (
                  <p className="text-gray-500 text-[13px] truncate leading-snug">
                    {topic.lastMessage.isSystem ? (
                      <span className="text-gray-600 italic">{topic.lastMessage.text}</span>
                    ) : (
                      <><span className={`${topic.lastMessage.senderColor} font-medium`}>{topic.lastMessage.senderName}:</span>{' '}{topic.lastMessage.text}</>
                    )}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* FAB create topic */}
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowCreateTopic(true)}
          className="absolute bottom-6 right-5 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-xl shadow-purple-500/30 z-10">
          <MessageSquare className="w-6 h-6 text-white" />
          <Plus className="w-3.5 h-3.5 text-white absolute top-2.5 right-2.5" />
        </motion.button>

        {/* Create topic modal */}
        <AnimatePresence>
          {showCreateTopic && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={() => setShowCreateTopic(false)}>
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
                onClick={e => e.stopPropagation()} className="w-full max-w-lg bg-gray-900 rounded-t-3xl border-t border-gray-700/30 p-5">
                <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-5" />
                <h3 className="text-white font-bold text-lg mb-4">Новый топик</h3>
                <p className="text-gray-500 text-xs mb-2 font-medium">Иконка</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {TOPIC_ICONS.map(icon => (
                    <button key={icon} onClick={() => setNewTopicIcon(icon)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${newTopicIcon === icon ? 'bg-purple-500/30 ring-2 ring-purple-500 scale-110' : 'bg-gray-800 hover:bg-gray-700'}`}>
                      {icon}
                    </button>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mb-2 font-medium">Название</p>
                <input autoFocus value={newTopicTitle} onChange={e => setNewTopicTitle(e.target.value)}
                  placeholder="Введите название топика" className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder:text-gray-500 outline-none text-sm border border-gray-700 focus:border-purple-500/50 mb-4"
                  onKeyDown={e => { if (e.key === 'Enter') createTopic(); }} />
                <button onClick={createTopic} disabled={!newTopicTitle.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm disabled:opacity-40">
                  Создать топик
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ─── Communities List View ─── */
  const filteredCommunities = searchQuery
    ? communities.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : communities;

  const categories = [...new Set(communities.map(c => c.category))];

  return (
    <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden relative">
      {/* Search */}
      <div className="px-5 pt-3 pb-1 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Поиск сообществ..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800 text-white placeholder:text-gray-500 outline-none text-sm border border-gray-700 focus:border-purple-500/50 transition-colors" />
        </div>
      </div>

      {/* Category chips */}
      {!searchQuery && (
        <div className="px-5 py-3 flex gap-2 overflow-x-auto scrollbar-hide shrink-0 border-b border-gray-800/50">
          <button className="px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium shrink-0 border border-purple-500/30">Все</button>
          {categories.map(cat => (
            <button key={cat} className="px-3.5 py-1.5 rounded-full bg-gray-800 text-gray-400 text-xs font-medium shrink-0 hover:bg-gray-700 transition-colors">{cat}</button>
          ))}
        </div>
      )}

      {/* Communities list */}
      <div className="flex-1 overflow-y-auto">
        {filteredCommunities.map((community) => {
          const lastTopic = [...community.topics].sort((a, b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0))[0];
          return (
            <button key={community.id} onClick={() => openCommunity(community)}
              className="w-full flex items-center gap-3.5 px-5 py-4 hover:bg-gray-800/50 transition-colors border-b border-gray-800/30 text-left">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${community.avatarBg} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
                {community.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-white font-semibold text-[15px] truncate">{community.name}</h3>
                  {community.isOwner && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  <span className="text-gray-600 text-[11px] ml-auto shrink-0">
                    {lastTopic?.lastMessage ? formatTimestamp(lastTopic.lastMessage.timestamp) : ''}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Users className="w-3 h-3 text-gray-600 shrink-0" />
                  <span className="text-gray-600 text-[11px]">{community.membersCount.toLocaleString()}</span>
                  <span className="text-gray-700 text-[11px]">·</span>
                  <span className="text-gray-600 text-[11px]">{community.topics.length} топиков</span>
                </div>
                {lastTopic?.lastMessage && !lastTopic.lastMessage.isSystem && (
                  <p className="text-gray-500 text-[12px] truncate">
                    <span className="text-gray-600">{lastTopic.title}:</span>{' '}{lastTopic.lastMessage.text}
                  </p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-700 shrink-0" />
            </button>
          );
        })}

        {filteredCommunities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <Globe className="w-12 h-12 text-gray-700 mb-3" />
            <p className="text-gray-500 text-sm">Сообщества не найдены</p>
            <p className="text-gray-600 text-xs mt-1">Попробуйте другой запрос</p>
          </div>
        )}
      </div>

      {/* FAB create community */}
      <motion.button whileTap={{ scale: 0.9 }} onClick={() => setView('create')}
        className="absolute bottom-24 right-5 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-xl shadow-purple-500/30 z-10">
        <Plus className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
}

/* ─── Settings Row Component ─── */

function SettingsRow({ icon, label, value, onEdit }: { icon: React.ReactNode; label: string; value: string; onEdit: () => void }) {
  return (
    <button onClick={onEdit} className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-gray-800/40 transition-colors">
      <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1 text-left min-w-0">
        <p className="text-gray-500 text-[11px]">{label}</p>
        <p className="text-white text-sm font-medium truncate">{value}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
    </button>
  );
}
