// ─── Extended Achievements System ─────────────────────────

export type AchievementCategory = 
  | 'gastro'
  | 'coffee'
  | 'nightlife'
  | 'events'
  | 'exploration'
  | 'social'
  | 'travel'
  | 'content'
  | 'crowdsource'
  | 'general';

export interface ExtendedAchievement {
  id: string;
  category: AchievementCategory;
  tier: 1 | 2 | 3;
  title: string;
  description: string;
  emoji: string;
  requiredCount: number;
  trackKey: string;
  gradient: string;
  karmaReward: number;
  pointsReward: number;
}

export const EXTENDED_ACHIEVEMENTS: ExtendedAchievement[] = [
  // GASTRO
  { id: 'turkish_mood', category: 'gastro', tier: 1, title: 'Turkish Vibes', description: 'Посетить 3 турецких ресторана', emoji: '🇹🇷', requiredCount: 3, trackKey: 'turkish_restaurants', gradient: 'from-red-500 to-red-600', karmaReward: 30, pointsReward: 100 },
  { id: 'turkish_lover', category: 'gastro', tier: 2, title: 'Kebab Certified', description: 'Посетить 10 турецких ресторанов', emoji: '🍖', requiredCount: 10, trackKey: 'turkish_restaurants', gradient: 'from-red-600 to-orange-500', karmaReward: 100, pointsReward: 300 },
  { id: 'turkish_expert', category: 'gastro', tier: 3, title: 'Sultan Mode', description: 'Посетить 20 турецких ресторанов', emoji: '🏺', requiredCount: 20, trackKey: 'turkish_restaurants', gradient: 'from-orange-500 to-yellow-500', karmaReward: 200, pointsReward: 600 },
  { id: 'italian_evening', category: 'gastro', tier: 1, title: 'Ciao Bella', description: 'Посетить 3 итальянских ресторана', emoji: '🇮🇹', requiredCount: 3, trackKey: 'italian_restaurants', gradient: 'from-green-500 to-emerald-400', karmaReward: 30, pointsReward: 100 },
  { id: 'pasta_lover', category: 'gastro', tier: 2, title: 'Pasta Lowkey', description: 'Посетить 10 итальянских ресторанов', emoji: '🍝', requiredCount: 10, trackKey: 'italian_restaurants', gradient: 'from-red-500 to-green-500', karmaReward: 100, pointsReward: 300 },
  { id: 'pasta_maestro', category: 'gastro', tier: 3, title: 'Al Dente God', description: 'Посетить 20 итальянских ресторанов', emoji: '🍕', requiredCount: 20, trackKey: 'italian_restaurants', gradient: 'from-green-600 to-red-600', karmaReward: 200, pointsReward: 600 },
  { id: 'asian_taste', category: 'gastro', tier: 1, title: 'Chopsticks Unlocked', description: 'Посетить 3 азиатских ресторана', emoji: '🥢', requiredCount: 3, trackKey: 'asian_restaurants', gradient: 'from-red-500 to-yellow-500', karmaReward: 30, pointsReward: 100 },
  { id: 'asian_gourmet', category: 'gastro', tier: 2, title: 'Ramen Slurp', description: 'Посетить 10 азиатских ресторанов', emoji: '🍜', requiredCount: 10, trackKey: 'asian_restaurants', gradient: 'from-yellow-500 to-orange-600', karmaReward: 100, pointsReward: 300 },
  { id: 'asian_master', category: 'gastro', tier: 3, title: 'Umami Lord', description: 'Посетить 20 азиатских ресторанов', emoji: '🍱', requiredCount: 20, trackKey: 'asian_restaurants', gradient: 'from-orange-600 to-red-700', karmaReward: 200, pointsReward: 600 },

  // COFFEE
  { id: 'first_cup', category: 'coffee', tier: 1, title: 'First Sip Hit', description: 'Посетить 3 кофейни', emoji: '☕', requiredCount: 3, trackKey: 'cafes_visited', gradient: 'from-amber-700 to-amber-500', karmaReward: 25, pointsReward: 80 },
  { id: 'coffee_lover', category: 'coffee', tier: 2, title: 'Daily Drip', description: 'Посетить 10 кофеен', emoji: '☕', requiredCount: 10, trackKey: 'cafes_visited', gradient: 'from-amber-600 to-orange-500', karmaReward: 80, pointsReward: 250 },
  { id: 'coffee_hunter', category: 'coffee', tier: 3, title: 'Grind Never Stops', description: 'Посетить 20 кофеен', emoji: '🔍', requiredCount: 20, trackKey: 'cafes_visited', gradient: 'from-orange-500 to-yellow-600', karmaReward: 150, pointsReward: 500 },

  // NIGHTLIFE
  { id: 'night_start', category: 'nightlife', tier: 1, title: 'Night Shift On', description: 'Посетить 3 бара или клуба', emoji: '🌃', requiredCount: 3, trackKey: 'nightlife_visited', gradient: 'from-purple-600 to-indigo-600', karmaReward: 35, pointsReward: 120 },
  { id: 'night_wave', category: 'nightlife', tier: 2, title: 'Midnight Regular', description: 'Посетить 10 ночных заведений', emoji: '🌊', requiredCount: 10, trackKey: 'nightlife_visited', gradient: 'from-indigo-600 to-blue-600', karmaReward: 120, pointsReward: 350 },
  { id: 'night_legend', category: 'nightlife', tier: 3, title: 'After Hours Legend', description: 'Посетить 20 ночных заведений', emoji: '🌟', requiredCount: 20, trackKey: 'nightlife_visited', gradient: 'from-blue-600 to-purple-700', karmaReward: 250, pointsReward: 700 },
  { id: 'first_rave', category: 'nightlife', tier: 1, title: 'First Drop', description: 'Посетить 3 техно-вечеринки', emoji: '🎧', requiredCount: 3, trackKey: 'raves_visited', gradient: 'from-pink-500 to-purple-600', karmaReward: 40, pointsReward: 150 },
  { id: 'city_rhythm', category: 'nightlife', tier: 2, title: 'On The Beat', description: 'Посетить 10 техно-рейвов', emoji: '🎵', requiredCount: 10, trackKey: 'raves_visited', gradient: 'from-purple-600 to-indigo-700', karmaReward: 130, pointsReward: 400 },
  { id: 'dancefloor_dawn', category: 'nightlife', tier: 3, title: 'Dancefloor Till Dawn', description: 'Посетить 20 рейвов', emoji: '🌅', requiredCount: 20, trackKey: 'raves_visited', gradient: 'from-indigo-700 to-pink-700', karmaReward: 270, pointsReward: 800 },

  // EVENTS
  { id: 'first_event', category: 'events', tier: 1, title: 'Show Up Energy', description: 'Посетить 3 мероприятия', emoji: '🎪', requiredCount: 3, trackKey: 'events_attended', gradient: 'from-pink-500 to-rose-500', karmaReward: 30, pointsReward: 100 },
  { id: 'event_guest', category: 'events', tier: 2, title: 'On The Guest List', description: 'Посетить 10 мероприятий', emoji: '🎭', requiredCount: 10, trackKey: 'events_attended', gradient: 'from-rose-500 to-pink-600', karmaReward: 100, pointsReward: 300 },
  { id: 'event_person', category: 'events', tier: 3, title: 'Main Character Energy', description: 'Посетить 20 мероприятий', emoji: '🎉', requiredCount: 20, trackKey: 'events_attended', gradient: 'from-pink-600 to-purple-600', karmaReward: 200, pointsReward: 600 },

  // EXPLORATION
  { id: 'street_newbie', category: 'exploration', tier: 1, title: 'Fresh Off The Block', description: 'Посетить 5 заведений', emoji: '🚶', requiredCount: 5, trackKey: 'places_visited', gradient: 'from-green-400 to-emerald-500', karmaReward: 20, pointsReward: 70 },
  { id: 'city_explorer', category: 'exploration', tier: 2, title: 'Local Plug', description: 'Посетить 10 заведений', emoji: '🧭', requiredCount: 10, trackKey: 'places_visited', gradient: 'from-emerald-500 to-teal-600', karmaReward: 70, pointsReward: 200 },
  { id: 'city_navigator', category: 'exploration', tier: 3, title: 'GPS Of The Streets', description: 'Посетить 20 заведений', emoji: '🗺️', requiredCount: 20, trackKey: 'places_visited', gradient: 'from-teal-600 to-cyan-600', karmaReward: 150, pointsReward: 500 },

  // SOCIAL
  { id: 'with_company', category: 'social', tier: 1, title: 'Linked Up', description: 'Посетить 3 места с друзьями', emoji: '👥', requiredCount: 3, trackKey: 'group_visits', gradient: 'from-blue-400 to-cyan-500', karmaReward: 35, pointsReward: 120 },
  { id: 'city_team', category: 'social', tier: 2, title: 'Squad Goals', description: 'Посетить 10 мест с друзьями', emoji: '🤝', requiredCount: 10, trackKey: 'group_visits', gradient: 'from-cyan-500 to-blue-600', karmaReward: 110, pointsReward: 350 },
  { id: 'company_king', category: 'social', tier: 3, title: 'The Plug Of The City', description: 'Посетить 20 мест с друзьями', emoji: '👑', requiredCount: 20, trackKey: 'group_visits', gradient: 'from-blue-600 to-purple-600', karmaReward: 220, pointsReward: 700 },

  // TRAVEL
  { id: 'first_borders', category: 'travel', tier: 1, title: 'Passport Stamped', description: 'Отметить 2 страны', emoji: '🌍', requiredCount: 2, trackKey: 'countries_visited', gradient: 'from-green-500 to-blue-500', karmaReward: 50, pointsReward: 200 },
  { id: 'traveler', category: 'travel', tier: 2, title: 'Jet Set Go', description: 'Отметить 5 стран', emoji: '✈️', requiredCount: 5, trackKey: 'countries_visited', gradient: 'from-blue-500 to-purple-600', karmaReward: 150, pointsReward: 500 },
  { id: 'world_citizen', category: 'travel', tier: 3, title: 'No Fixed Address', description: 'Отметить 10 стран', emoji: '🌎', requiredCount: 10, trackKey: 'countries_visited', gradient: 'from-purple-600 to-pink-600', karmaReward: 300, pointsReward: 1000 },

  // CONTENT
  { id: 'first_frame', category: 'content', tier: 1, title: 'Shot On iPhone', description: 'Загрузить 3 фото мест', emoji: '📸', requiredCount: 3, trackKey: 'photos_uploaded', gradient: 'from-yellow-400 to-orange-500', karmaReward: 25, pointsReward: 80 },
  { id: 'city_photographer', category: 'content', tier: 2, title: 'Core Memory Maker', description: 'Загрузить 10 фото', emoji: '📷', requiredCount: 10, trackKey: 'photos_uploaded', gradient: 'from-orange-500 to-red-500', karmaReward: 80, pointsReward: 250 },
  { id: 'city_chronicler', category: 'content', tier: 3, title: 'Raw Unfiltered', description: 'Загрузить 20 фото', emoji: '🎬', requiredCount: 20, trackKey: 'photos_uploaded', gradient: 'from-red-500 to-purple-600', karmaReward: 160, pointsReward: 500 },

  // CROWDSOURCE
  { id: 'pioneer', category: 'crowdsource', tier: 3, title: 'Trailblazer', description: 'Добавить 5 новых заведений на карту', emoji: '🔍', requiredCount: 5, trackKey: 'places_added', gradient: 'from-emerald-500 to-green-600', karmaReward: 250, pointsReward: 800 },
  { id: 'locator', category: 'crowdsource', tier: 3, title: 'Map That', description: 'Предложить 20 подтверждённых правок', emoji: '📍', requiredCount: 20, trackKey: 'edits_confirmed', gradient: 'from-blue-500 to-cyan-600', karmaReward: 200, pointsReward: 650 },
  { id: 'restaurant_critic', category: 'crowdsource', tier: 3, title: 'No Cap Review', description: 'Оставить 15 развернутых отзывов (100+ символов, 2 фото)', emoji: '✍️', requiredCount: 15, trackKey: 'detailed_reviews', gradient: 'from-purple-500 to-pink-600', karmaReward: 220, pointsReward: 700 },
  { id: 'night_watch', category: 'crowdsource', tier: 3, title: 'Night Owl', description: 'Чек-ин в 10 заведениях после 00:00', emoji: '🌙', requiredCount: 10, trackKey: 'night_checkins', gradient: 'from-indigo-600 to-purple-700', karmaReward: 180, pointsReward: 550 },
  { id: 'district_savior', category: 'crowdsource', tier: 3, title: 'Hood Helper', description: 'Дать 10 полезных ответов на вопросы', emoji: '🆘', requiredCount: 10, trackKey: 'helpful_answers', gradient: 'from-red-500 to-orange-600', karmaReward: 170, pointsReward: 520 },
  { id: 'marathoner', category: 'crowdsource', tier: 3, title: 'No Days Off', description: 'Заходить в приложение 30 дней подряд', emoji: '🏃', requiredCount: 30, trackKey: 'login_streak', gradient: 'from-green-500 to-emerald-600', karmaReward: 300, pointsReward: 1000 },
  { id: 'shopaholic', category: 'crowdsource', tier: 3, title: 'Deal Hunter', description: 'Активировать 15 различных O2O-купонов', emoji: '🛍️', requiredCount: 15, trackKey: 'coupons_activated', gradient: 'from-pink-500 to-rose-600', karmaReward: 240, pointsReward: 750 },
  { id: 'life_party', category: 'crowdsource', tier: 3, title: 'The Connector', description: 'Привести 5 друзей до ранга «Исследователь»', emoji: '🎊', requiredCount: 5, trackKey: 'referrals_ranked', gradient: 'from-yellow-500 to-orange-600', karmaReward: 280, pointsReward: 900 },
  { id: 'paparazzi', category: 'crowdsource', tier: 3, title: 'Shots Went Viral', description: 'Загрузить 50 фото, собравших 100 лайков', emoji: '📸', requiredCount: 50, trackKey: 'photos_with_likes', gradient: 'from-purple-500 to-fuchsia-600', karmaReward: 260, pointsReward: 820 },
  { id: 'own_party', category: 'crowdsource', tier: 3, title: 'Host Mode ON', description: 'Создать или участвовать в 5 локальных ивентах', emoji: '🎉', requiredCount: 5, trackKey: 'local_events_joined', gradient: 'from-indigo-500 to-purple-600', karmaReward: 230, pointsReward: 720 },
];

// Category info for UI
export const ACHIEVEMENT_CATEGORIES: Record<AchievementCategory, { name: string; emoji: string; color: string }> = {
  gastro: { name: 'Гастрономия', emoji: '🍽️', color: 'text-orange-400' },
  coffee: { name: 'Кофейные', emoji: '☕', color: 'text-amber-500' },
  nightlife: { name: 'Ночная жизнь', emoji: '🌃', color: 'text-purple-400' },
  events: { name: 'События', emoji: '🎉', color: 'text-pink-400' },
  exploration: { name: 'Исследование', emoji: '🗺️', color: 'text-teal-400' },
  social: { name: 'Социальные', emoji: '👥', color: 'text-blue-400' },
  travel: { name: 'Путешествия', emoji: '✈️', color: 'text-indigo-400' },
  content: { name: 'Контент', emoji: '📸', color: 'text-yellow-400' },
  crowdsource: { name: 'Краудсорсинг', emoji: '🏆', color: 'text-emerald-400' },
  general: { name: 'Общие', emoji: '⭐', color: 'text-gray-400' },
};