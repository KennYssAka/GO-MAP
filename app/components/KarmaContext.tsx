import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// ─── Action types that earn karma/points ─────────────────
export type KarmaAction =
  | 'checkin'           // Check in at a location
  | 'event_attend'      // Mark "going" to event
  | 'event_create'      // Create a new event
  | 'friend_add'        // Add a friend
  | 'friend_accept'     // Accept friend request
  | 'post_create'       // Create a post in feed
  | 'post_like'         // Like someone's post
  | 'comment_create'    // Comment on a post
  | 'route_complete'    // Complete a route
  | 'vibe_vote'         // Vote on a vibe
  | 'quest_complete'    // Complete a quest
  | 'quest_start'       // Start a quest
  | 'daily_login'       // Daily login streak
  | 'profile_complete'  // Complete profile info
  | 'share_event'       // Share an event
  | 'voice_note'        // Record voice note
  | 'status_post'       // Post a status
  | 'match_swipe'       // Swipe in vibe match
  | 'match_connect'     // Connect with match
  | 'capsule_create'    // Create time capsule
  | 'playlist_add'      // Add to collective playlist
  | 'explore_newplace'  // Visit a new place
  | 'help_report'       // Report helpful info
  | 'streak_bonus';     // Streak bonus

export interface KarmaActionConfig {
  action: KarmaAction;
  points: number;
  karma: number;
  label: string;
  emoji: string;
  description: string;
  cooldownMs?: number; // Minimum time between same actions
  dailyLimit?: number; // Max times per day
}

export const KARMA_ACTIONS: Record<KarmaAction, KarmaActionConfig> = {
  checkin:          { action: 'checkin',          points: 50,   karma: 10,  label: 'Чек-ин',           emoji: '📍', description: 'Отметка на локации',            cooldownMs: 3600000, dailyLimit: 10 },
  event_attend:    { action: 'event_attend',     points: 100,  karma: 20,  label: 'Иду на событие',    emoji: '🎉', description: 'Участие в событии',             dailyLimit: 5 },
  event_create:    { action: 'event_create',     points: 200,  karma: 50,  label: 'Создание события',  emoji: '✨', description: 'Организация события',           dailyLimit: 3 },
  friend_add:      { action: 'friend_add',       points: 30,   karma: 15,  label: 'Добавление друга',  emoji: '👥', description: 'Отправка заявки в друзья',      dailyLimit: 20 },
  friend_accept:   { action: 'friend_accept',    points: 40,   karma: 20,  label: 'Принятие заявки',   emoji: '🤝', description: 'Новая дружба',                  dailyLimit: 20 },
  post_create:     { action: 'post_create',      points: 60,   karma: 15,  label: 'Публикация',        emoji: '📝', description: 'Пост в ленте',                 dailyLimit: 10 },
  post_like:       { action: 'post_like',         points: 5,    karma: 2,   label: 'Лайк',             emoji: '❤️', description: 'Оценка чужого контента',        dailyLimit: 50 },
  comment_create:  { action: 'comment_create',   points: 20,   karma: 8,   label: 'Комментарий',       emoji: '💬', description: 'Комментарий к посту',           dailyLimit: 30 },
  route_complete:  { action: 'route_complete',   points: 150,  karma: 30,  label: 'Маршрут пройден',   emoji: '🗺️', description: 'Прохождение маршрута',          dailyLimit: 5 },
  vibe_vote:       { action: 'vibe_vote',         points: 10,   karma: 5,   label: 'Голос за вайб',    emoji: '🔮', description: 'Оценка атмосферы места',        cooldownMs: 1800000, dailyLimit: 20 },
  quest_complete:  { action: 'quest_complete',   points: 500,  karma: 100, label: 'Квест завершён',    emoji: '🏆', description: 'Выполнение квеста',             dailyLimit: 3 },
  quest_start:     { action: 'quest_start',       points: 20,   karma: 5,   label: 'Квест начат',      emoji: '🎯', description: 'Начало нового квеста',          dailyLimit: 5 },
  daily_login:     { action: 'daily_login',       points: 25,   karma: 5,   label: 'Ежедневный вход',  emoji: '📅', description: 'Вход в приложение',             dailyLimit: 1 },
  profile_complete:{ action: 'profile_complete', points: 300,  karma: 50,  label: 'Профиль заполнен',  emoji: '👤', description: 'Полное заполнение профиля',     dailyLimit: 1 },
  share_event:     { action: 'share_event',       points: 40,   karma: 10,  label: 'Поделиться',       emoji: '📤', description: 'Поделиться событием',           dailyLimit: 10 },
  voice_note:      { action: 'voice_note',        points: 30,   karma: 10,  label: 'Голосовая заметка', emoji: '🎙️', description: 'Запись голосовой',              dailyLimit: 10 },
  status_post:     { action: 'status_post',       points: 20,   karma: 5,   label: 'Статус',           emoji: '💫', description: 'Публикация статуса',            dailyLimit: 5 },
  match_swipe:     { action: 'match_swipe',       points: 5,    karma: 1,   label: 'Свайп',            emoji: '⚡', description: 'Свайп в Vibe Match',            dailyLimit: 50 },
  match_connect:   { action: 'match_connect',    points: 100,  karma: 25,  label: 'Мэтч!',            emoji: '💜', description: 'Взаимный мэтч',                dailyLimit: 10 },
  capsule_create:  { action: 'capsule_create',   points: 80,   karma: 20,  label: 'Капсула времени',   emoji: '⏳', description: 'Создание временной капсулы',    dailyLimit: 3 },
  playlist_add:    { action: 'playlist_add',      points: 15,   karma: 5,   label: 'Трек в плейлист',  emoji: '🎵', description: 'Добавление в общий плейлист',   dailyLimit: 10 },
  explore_newplace:{ action: 'explore_newplace', points: 120,  karma: 25,  label: 'Новое место',       emoji: '💎', description: 'Первое посещение места',        dailyLimit: 5 },
  help_report:     { action: 'help_report',       points: 50,   karma: 30,  label: 'Полезный отчёт',   emoji: '📊', description: 'Помощь сообществу',             dailyLimit: 5 },
  streak_bonus:    { action: 'streak_bonus',      points: 100,  karma: 20,  label: 'Бонус серии',      emoji: '🔥', description: 'Бонус за серию дней',           dailyLimit: 1 },
};

// ─── Karma ranks ──────────────────────────────────────────
export interface KarmaRank {
  minKarma: number;
  name: string;
  emoji: string;
  color: string;
  gradient: string;
  perks: string[];
  description: string;
  requirements: {
    visits?: number;
    checkins?: number;
    reviews?: number;
    photos?: number;
    likes?: number;
    events?: number;
  };
}

export const KARMA_RANKS: KarmaRank[] = [
  { 
    minKarma: 0, 
    name: 'Искра города', 
    emoji: '✨', 
    color: 'text-gray-400', 
    gradient: 'from-gray-500 to-gray-600', 
    perks: ['Базовый доступ'], 
    description: 'Только начинаете активность',
    requirements: { visits: 3, checkins: 1 }
  },
  { 
    minKarma: 50, 
    name: 'Гость улиц', 
    emoji: '🚶', 
    color: 'text-green-400', 
    gradient: 'from-green-500 to-emerald-500', 
    perks: ['Базовый доступ', 'Загрузка фото'], 
    description: 'Начинаете исследовать город',
    requirements: { visits: 7, checkins: 3, reviews: 1, photos: 1 }
  },
  { 
    minKarma: 200, 
    name: 'Исследователь', 
    emoji: '🧭', 
    color: 'text-blue-400', 
    gradient: 'from-blue-500 to-cyan-500', 
    perks: ['Цветная рамка аватара', 'Приоритет в ленте'], 
    description: 'Начинаете делиться опытом',
    requirements: { visits: 10, reviews: 3, likes: 5 }
  },
  { 
    minKarma: 500, 
    name: 'Охотник за местами', 
    emoji: '🎯', 
    color: 'text-yellow-400', 
    gradient: 'from-yellow-500 to-amber-500', 
    perks: ['Значок у имени', 'Сохранение мест', 'Создание подборок'], 
    description: 'Активно открываете новые точки',
    requirements: { visits: 15, photos: 5, checkins: 10 }
  },
  { 
    minKarma: 1000, 
    name: 'Навигатор города', 
    emoji: '🗺️', 
    color: 'text-orange-400', 
    gradient: 'from-orange-500 to-red-500', 
    perks: ['Свой цвет маркера', 'Приватные события', 'Влияние на других'], 
    description: 'Ваше мнение влияет на других',
    requirements: { visits: 20, reviews: 5, likes: 10 }
  },
  { 
    minKarma: 2000, 
    name: 'Инсайдер', 
    emoji: '🎭', 
    color: 'text-purple-400', 
    gradient: 'from-purple-500 to-pink-500', 
    perks: ['Золотой профиль', 'Модерация событий', 'VIP доступ'], 
    description: 'Хорошо знаете город',
    requirements: { visits: 25, reviews: 7, likes: 20 }
  },
  { 
    minKarma: 5000, 
    name: 'Создатель атмосферы', 
    emoji: '🌟', 
    color: 'text-cyan-300', 
    gradient: 'from-cyan-400 to-blue-500', 
    perks: ['Создание событий', 'Подборки', 'Формирование комьюнити'], 
    description: 'Формируете комьюнити',
    requirements: { visits: 30, events: 1, likes: 30 }
  },
  { 
    minKarma: 10000, 
    name: 'Легенда ночей и улиц', 
    emoji: '🔥', 
    color: 'text-amber-300', 
    gradient: 'from-amber-400 to-yellow-500', 
    perks: ['Личный промокод', 'Менторство новичков', 'Эксклюзивные ивенты'], 
    description: 'Очень активный пользователь',
    requirements: { visits: 40, reviews: 10, likes: 50 }
  },
  { 
    minKarma: 20000, 
    name: 'Хранитель города', 
    emoji: '🏛️', 
    color: 'text-rose-300', 
    gradient: 'from-rose-400 to-pink-500', 
    perks: ['Профиль-ориентир', 'Высокий отклик', 'Популярные рекомендации'], 
    description: 'Профиль становится ориентиром',
    requirements: { visits: 50, reviews: 15, likes: 100 }
  },
  { 
    minKarma: 50000, 
    name: 'Душа города', 
    emoji: '👑', 
    color: 'text-yellow-300', 
    gradient: 'from-yellow-300 via-amber-400 to-orange-500', 
    perks: ['Все привилегии', 'Влияние на развитие', 'Максимальный статус', 'Легендарный значок'], 
    description: 'Самый активный пользователь, влияющий на выбор других',
    requirements: { visits: 100, reviews: 30, events: 10, likes: 200 }
  },
];

// ─── Level thresholds ─────────────────────────────────────
export function getLevelInfo(totalPoints: number): { level: number; currentPoints: number; nextLevelPoints: number; progress: number } {
  // Points needed: 500, 1200, 2500, 5000, 8000, 12000, 18000, 25000, 35000, 50000...
  const thresholds = [0, 500, 1200, 2500, 5000, 8000, 12000, 18000, 25000, 35000, 50000, 70000, 100000];
  let level = 1;
  for (let i = 1; i < thresholds.length; i++) {
    if (totalPoints >= thresholds[i]) {
      level = i + 1;
    } else break;
  }
  const currentThreshold = thresholds[Math.min(level - 1, thresholds.length - 1)] || 0;
  const nextThreshold = thresholds[Math.min(level, thresholds.length - 1)] || thresholds[thresholds.length - 1] + 50000;
  const currentPoints = totalPoints - currentThreshold;
  const nextLevelPoints = nextThreshold - currentThreshold;
  const progress = Math.min((currentPoints / nextLevelPoints) * 100, 100);
  return { level, currentPoints, nextLevelPoints, progress };
}

export function getRank(karma: number): KarmaRank {
  let rank = KARMA_RANKS[0];
  for (const r of KARMA_RANKS) {
    if (karma >= r.minKarma) rank = r;
    else break;
  }
  return rank;
}

// ─── History entry ────────────────────────────────────────
export interface KarmaHistoryEntry {
  id: string;
  action: KarmaAction;
  points: number;
  karma: number;
  timestamp: number;
  detail?: string;
  multiplier?: number;
}

// ─── Achievements ─────────────────────────────────────────
export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  condition: string;
  requiredCount: number;
  trackAction?: KarmaAction;
  gradient: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_checkin',     title: 'Первый шаг',        description: 'Первый чек-ин',                    emoji: '👣', condition: 'checkin',         requiredCount: 1,   trackAction: 'checkin',       gradient: 'from-green-500 to-emerald-500' },
  { id: 'checkin_10',        title: 'Завсегдатай',        description: '10 чек-инов',                      emoji: '📍', condition: 'checkin',         requiredCount: 10,  trackAction: 'checkin',       gradient: 'from-blue-500 to-cyan-500' },
  { id: 'checkin_50',        title: 'Местный житель',     description: '50 чек-инов',                      emoji: '🏠', condition: 'checkin',         requiredCount: 50,  trackAction: 'checkin',       gradient: 'from-purple-500 to-pink-500' },
  { id: 'checkin_100',       title: 'Вездесущий',         description: '100 чек-инов',                     emoji: '🌍', condition: 'checkin',         requiredCount: 100, trackAction: 'checkin',       gradient: 'from-amber-500 to-red-500' },
  { id: 'social_butterfly',  title: 'Социальная бабочка', description: '5 друзей',                         emoji: '🦋', condition: 'friend_add',     requiredCount: 5,   trackAction: 'friend_add',   gradient: 'from-pink-500 to-rose-500' },
  { id: 'popular',           title: 'Популярный',         description: '20 друзей',                        emoji: '🌟', condition: 'friend_add',     requiredCount: 20,  trackAction: 'friend_add',   gradient: 'from-yellow-500 to-orange-500' },
  { id: 'event_goer',        title: 'Тусовщик',           description: 'Посетить 5 событий',               emoji: '🎉', condition: 'event_attend',   requiredCount: 5,   trackAction: 'event_attend', gradient: 'from-violet-500 to-purple-500' },
  { id: 'event_king',        title: 'Король вечеринок',   description: 'Посетить 20 событий',              emoji: '👑', condition: 'event_attend',   requiredCount: 20,  trackAction: 'event_attend', gradient: 'from-amber-400 to-yellow-500' },
  { id: 'organizer',         title: 'Организатор',        description: 'Создать 3 события',                emoji: '🎪', condition: 'event_create',   requiredCount: 3,   trackAction: 'event_create', gradient: 'from-indigo-500 to-blue-500' },
  { id: 'quest_hero',        title: 'Герой квестов',      description: 'Завершить 5 квестов',              emoji: '🏆', condition: 'quest_complete', requiredCount: 5,   trackAction: 'quest_complete', gradient: 'from-orange-500 to-red-500' },
  { id: 'explorer',          title: 'Исследователь',      description: 'Открыть 10 новых мест',           emoji: '🧭', condition: 'explore_newplace', requiredCount: 10, trackAction: 'explore_newplace', gradient: 'from-teal-500 to-cyan-500' },
  { id: 'streak_7',          title: 'Неделя огня',        description: '7-дневная серия',                  emoji: '🔥', condition: 'streak',          requiredCount: 7,                                gradient: 'from-red-500 to-orange-500' },
  { id: 'streak_30',         title: 'Месяц в игре',       description: '30-дневная серия',                 emoji: '💪', condition: 'streak',          requiredCount: 30,                                gradient: 'from-purple-600 to-pink-600' },
  { id: 'karma_500',         title: 'Уважаемый',          description: 'Набрать 500 кармы',                emoji: '⭐', condition: 'karma',            requiredCount: 500,                               gradient: 'from-yellow-400 to-amber-500' },
  { id: 'karma_2000',        title: 'Легенда',            description: 'Набрать 2000 кармы',               emoji: '💎', condition: 'karma',            requiredCount: 2000,                              gradient: 'from-cyan-400 to-blue-500' },
  { id: 'route_master',      title: 'Путешественник',     description: 'Пройти 10 маршрутов',             emoji: '🗺️', condition: 'route_complete',  requiredCount: 10,  trackAction: 'route_complete', gradient: 'from-green-400 to-teal-500' },
  { id: 'content_creator',   title: 'Контент-мейкер',     description: 'Создать 20 постов',               emoji: '📝', condition: 'post_create',     requiredCount: 20,  trackAction: 'post_create',  gradient: 'from-fuchsia-500 to-purple-500' },
  { id: 'matchmaker',        title: 'Мэтчмейкер',         description: '10 мэтчей',                       emoji: '💜', condition: 'match_connect',   requiredCount: 10,  trackAction: 'match_connect', gradient: 'from-pink-500 to-purple-500' },
];

// ─── Streak multiplier ───────────────────────────────────
function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 3.0;
  if (streak >= 14) return 2.5;
  if (streak >= 7) return 2.0;
  if (streak >= 3) return 1.5;
  return 1.0;
}

// ─── Context ──────────────────────────────────────────────
interface KarmaState {
  totalPoints: number;
  totalKarma: number;
  streak: number;
  lastLoginDate: string;
  history: KarmaHistoryEntry[];
  actionCounts: Record<string, number>;
  dailyActions: Record<string, { count: number; date: string }>;
  unlockedAchievements: string[];
  newAchievements: string[]; // Just unlocked, not yet seen
}

interface KarmaContextType {
  state: KarmaState;
  level: ReturnType<typeof getLevelInfo>;
  rank: KarmaRank;
  streakMultiplier: number;
  earnKarma: (action: KarmaAction, detail?: string) => { points: number; karma: number; newAchievements: Achievement[] } | null;
  getActionCount: (action: KarmaAction) => number;
  isAchievementUnlocked: (id: string) => boolean;
  clearNewAchievements: () => void;
  getRecentHistory: (count?: number) => KarmaHistoryEntry[];
  todayPoints: number;
  todayKarma: number;
  leaderboardPosition: number;
}

const defaultState: KarmaState = {
  totalPoints: 0,
  totalKarma: 0,
  streak: 0,
  lastLoginDate: '',
  history: [],
  actionCounts: {},
  dailyActions: {},
  unlockedAchievements: [],
  newAchievements: [],
};

const KarmaContext = createContext<KarmaContextType | undefined>(undefined);

export function KarmaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<KarmaState>(() => {
    const stored = localStorage.getItem('karma_state');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...defaultState, ...parsed };
      } catch { return defaultState; }
    }
    return defaultState;
  });

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem('karma_state', JSON.stringify(state));
  }, [state]);

  // Check daily login streak
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (state.lastLoginDate !== today) {
      setState(prev => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        const newStreak = prev.lastLoginDate === yesterdayStr ? prev.streak + 1 : 1;
        
        return {
          ...prev,
          lastLoginDate: today,
          streak: newStreak,
        };
      });
    }
  }, []);

  const streakMultiplier = getStreakMultiplier(state.streak);
  const level = getLevelInfo(state.totalPoints);
  const rank = getRank(state.totalKarma);

  // Calculate today's earnings
  const today = new Date().toISOString().split('T')[0];
  const todayHistory = state.history.filter(h => new Date(h.timestamp).toISOString().split('T')[0] === today);
  const todayPoints = todayHistory.reduce((sum, h) => sum + h.points, 0);
  const todayKarma = todayHistory.reduce((sum, h) => sum + h.karma, 0);

  // Simulated leaderboard position based on karma
  const leaderboardPosition = Math.max(1, Math.floor(100 - (state.totalKarma / 100)));

  const canPerformAction = useCallback((action: KarmaAction): boolean => {
    const config = KARMA_ACTIONS[action];
    if (!config) return false;

    // Check daily limit
    if (config.dailyLimit) {
      const daily = state.dailyActions[action];
      if (daily && daily.date === today && daily.count >= config.dailyLimit) {
        return false;
      }
    }

    // Check cooldown
    if (config.cooldownMs) {
      const lastEntry = [...state.history].reverse().find(h => h.action === action);
      if (lastEntry && (Date.now() - lastEntry.timestamp) < config.cooldownMs) {
        return false;
      }
    }

    return true;
  }, [state.dailyActions, state.history, today]);

  const checkNewAchievements = useCallback((newState: KarmaState): Achievement[] => {
    const newlyUnlocked: Achievement[] = [];

    for (const ach of ACHIEVEMENTS) {
      if (newState.unlockedAchievements.includes(ach.id)) continue;

      let met = false;
      if (ach.condition === 'streak') {
        met = newState.streak >= ach.requiredCount;
      } else if (ach.condition === 'karma') {
        met = newState.totalKarma >= ach.requiredCount;
      } else if (ach.trackAction) {
        const count = newState.actionCounts[ach.trackAction] || 0;
        met = count >= ach.requiredCount;
      }

      if (met) {
        newlyUnlocked.push(ach);
      }
    }

    return newlyUnlocked;
  }, []);

  const earnKarma = useCallback((action: KarmaAction, detail?: string) => {
    if (!canPerformAction(action)) return null;

    const config = KARMA_ACTIONS[action];
    const multiplier = streakMultiplier;
    const earnedPoints = Math.round(config.points * multiplier);
    const earnedKarma = Math.round(config.karma * multiplier);

    const entry: KarmaHistoryEntry = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      action,
      points: earnedPoints,
      karma: earnedKarma,
      timestamp: Date.now(),
      detail,
      multiplier: multiplier > 1 ? multiplier : undefined,
    };

    let newAchievements: Achievement[] = [];

    setState(prev => {
      const newState: KarmaState = {
        ...prev,
        totalPoints: prev.totalPoints + earnedPoints,
        totalKarma: prev.totalKarma + earnedKarma,
        history: [...prev.history.slice(-200), entry], // Keep last 200
        actionCounts: {
          ...prev.actionCounts,
          [action]: (prev.actionCounts[action] || 0) + 1,
        },
        dailyActions: {
          ...prev.dailyActions,
          [action]: {
            count: (prev.dailyActions[action]?.date === today ? prev.dailyActions[action]?.count || 0 : 0) + 1,
            date: today,
          },
        },
        unlockedAchievements: prev.unlockedAchievements,
        newAchievements: prev.newAchievements,
      };

      // Check achievements
      newAchievements = checkNewAchievements(newState);
      if (newAchievements.length > 0) {
        newState.unlockedAchievements = [
          ...newState.unlockedAchievements,
          ...newAchievements.map(a => a.id),
        ];
        newState.newAchievements = [
          ...newState.newAchievements,
          ...newAchievements.map(a => a.id),
        ];
      }

      return newState;
    });

    return { points: earnedPoints, karma: earnedKarma, newAchievements };
  }, [canPerformAction, streakMultiplier, checkNewAchievements, today]);

  const getActionCount = useCallback((action: KarmaAction) => {
    return state.actionCounts[action] || 0;
  }, [state.actionCounts]);

  const isAchievementUnlocked = useCallback((id: string) => {
    return state.unlockedAchievements.includes(id);
  }, [state.unlockedAchievements]);

  const clearNewAchievements = useCallback(() => {
    setState(prev => ({ ...prev, newAchievements: [] }));
  }, []);

  const getRecentHistory = useCallback((count = 20) => {
    return [...state.history].reverse().slice(0, count);
  }, [state.history]);

  return (
    <KarmaContext.Provider value={{
      state,
      level,
      rank,
      streakMultiplier,
      earnKarma,
      getActionCount,
      isAchievementUnlocked,
      clearNewAchievements,
      getRecentHistory,
      todayPoints,
      todayKarma,
      leaderboardPosition,
    }}>
      {children}
    </KarmaContext.Provider>
  );
}

export function useKarma() {
  const context = useContext(KarmaContext);
  if (!context) throw new Error('useKarma must be used within KarmaProvider');
  return context;
}