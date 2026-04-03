import type { CityId } from './CityContext';

export interface EventItem {
  id: string;
  title: string;
  type: 'party' | 'food' | 'concert' | 'meetup' | 'sport' | 'art';
  date: string;
  time: string;
  location: string;
  lat: number;
  lng: number;
  attending: number;
  capacity: number;
  vibe: string;
  vibeLabel: string;
  tags: string[];
  color: string;
  price: string;
  hot: boolean;
  locked?: boolean;
  emoji: string;
  description: string;
  city: CityId;
  isCustom?: boolean;
}

export type EventType = 'all' | 'party' | 'food' | 'concert' | 'meetup' | 'sport' | 'art';

export const typeConfig: Record<string, { label: string; emoji: string; color: string }> = {
  all: { label: 'Все', emoji: '🔥', color: 'from-gray-500 to-gray-600' },
  party: { label: 'Вечеринки', emoji: '🎉', color: 'from-purple-500 to-pink-500' },
  food: { label: 'Еда', emoji: '🍽️', color: 'from-red-500 to-orange-500' },
  concert: { label: 'Концерты', emoji: '🎵', color: 'from-amber-500 to-orange-500' },
  meetup: { label: 'Встречи', emoji: '🤝', color: 'from-blue-500 to-indigo-500' },
  sport: { label: 'Спорт', emoji: '💪', color: 'from-green-400 to-emerald-500' },
  art: { label: 'Искусство', emoji: '🎨', color: 'from-pink-500 to-rose-500' },
};

export const tagsByType: Record<string, { label: string; emoji: string }[]> = {
  party: [
    { label: 'Техно', emoji: '🎧' }, { label: 'Танцы', emoji: '💃' }, { label: 'Ночь', emoji: '🌙' },
    { label: 'Музыка', emoji: '🎵' }, { label: 'Пиво', emoji: '🍺' }, { label: 'House', emoji: '🏠' },
    { label: 'Караоке', emoji: '🎤' }, { label: 'Крыша', emoji: '🏙️' }, { label: 'Латина', emoji: '💃' },
    { label: 'Кальян', emoji: '💨' }, { label: 'VIP', emoji: '👑' }, { label: 'Disco', emoji: '🪩' },
  ],
  food: [
    { label: 'Казахская кухня', emoji: '🍖' }, { label: 'Премиум', emoji: '⭐' }, { label: 'Кофе', emoji: '☕' },
    { label: 'Бранч', emoji: '🥐' }, { label: 'Суши', emoji: '🍣' }, { label: 'Мастер-класс', emoji: '👨‍🍳' },
    { label: 'Вино', emoji: '🍷' }, { label: 'Дегустация', emoji: '🥂' }, { label: 'BBQ', emoji: '🥩' },
    { label: 'Мясо', emoji: '🍗' }, { label: 'Итальянская', emoji: '🇮🇹' }, { label: 'Завтрак', emoji: '🥞' },
    { label: 'Бариста', emoji: '☕' },
  ],
  concert: [
    { label: 'Джаз', emoji: '🎷' }, { label: 'Живая музыка', emoji: '🎵' }, { label: 'Инди', emoji: '🎸' },
    { label: 'Рок', emoji: '🤘' }, { label: 'Классика', emoji: '🎻' }, { label: 'DJ', emoji: '🎧' },
    { label: 'Electronic', emoji: '⚡' }, { label: 'Open Mic', emoji: '🎤' }, { label: 'Стендап', emoji: '😂' },
    { label: 'Юмор', emoji: '🤣' },
  ],
  meetup: [
    { label: 'Стартапы', emoji: '🚀' }, { label: 'Нетворкинг', emoji: '🤝' }, { label: 'Бизнес', emoji: '💼' },
    { label: 'IT', emoji: '💻' }, { label: 'Tech', emoji: '⚙️' }, { label: 'Дизайн', emoji: '✏️' },
    { label: 'UX/UI', emoji: '🎨' }, { label: 'Языки', emoji: '🌍' }, { label: 'Настолки', emoji: '🎲' },
    { label: 'Игры', emoji: '🎮' },
  ],
  sport: [
    { label: 'Йога', emoji: '🧘' }, { label: 'Бег', emoji: '🏃' }, { label: 'CrossFit', emoji: '🏋️' },
    { label: 'Тренировка', emoji: '💪' }, { label: 'Скалодром', emoji: '🧗' }, { label: 'Велосипед', emoji: '🚴' },
    { label: 'Теннис', emoji: '🎾' }, { label: 'Медитация', emoji: '🕉️' }, { label: 'Природа', emoji: '🌿' },
    { label: 'Горы', emoji: '⛰️' },
  ],
  art: [
    { label: 'Выставка', emoji: '🖼️' }, { label: 'Искусство', emoji: '🎨' }, { label: 'Фотография', emoji: '📸' },
    { label: 'Театр', emoji: '🎭' }, { label: 'Драма', emoji: '🎪' }, { label: 'Керамика', emoji: '🏺' },
    { label: 'Граффити', emoji: '🖌️' }, { label: 'Стрит-арт', emoji: '🎨' }, { label: 'Кино', emoji: '🎬' },
    { label: 'Авторское', emoji: '🎞️' },
  ],
};

// ======================== ALMATY EVENTS ========================
const almatyEvents: EventItem[] = [
  // Вечеринки
  { id: 'a1', title: 'Techno Night', type: 'party', date: 'Сегодня', time: '22:00', location: 'Chukotka Bar', lat: 43.2380, lng: 76.9450, attending: 87, capacity: 150, vibe: '🎧', vibeLabel: 'Огонь', tags: ['Техно', 'Танцы', 'Ночь'], color: 'from-purple-500 to-pink-500', price: '3000₸', hot: true, emoji: '🎧', description: 'Лучшие техно диджеи Алматы', city: 'almaty' },
  { id: 'a2', title: 'Friday Night', type: 'party', date: 'Сегодня', time: '21:00', location: 'Line Brew', lat: 43.2350, lng: 76.9380, attending: 145, capacity: 200, vibe: '🍻', vibeLabel: 'Веселье', tags: ['Музыка', 'Пиво'], color: 'from-purple-500 to-pink-500', price: '2500₸', hot: true, emoji: '🍻', description: 'Живая музыка и крафтовое пиво', city: 'almaty' },
  { id: 'a3', title: 'House Party', type: 'party', date: 'Сегод��я', time: '23:00', location: 'Shaker', lat: 43.2410, lng: 76.9520, attending: 98, capacity: 120, vibe: '🎵', vibeLabel: 'Танцы', tags: ['House', 'Disco'], color: 'from-purple-500 to-pink-500', price: '4000₸', hot: false, emoji: '🎵', description: 'House и disco всю ночь', city: 'almaty' },
  { id: 'a4', title: 'Karaoke Night', type: 'party', date: 'Сегодня', time: '20:00', location: 'Sky Lounge', lat: 43.2280, lng: 76.9290, attending: 67, capacity: 80, vibe: '🎤', vibeLabel: 'Караоке', tags: ['Караоке', 'Крыша'], color: 'from-purple-500 to-pink-500', price: '3500₸', hot: false, emoji: '🎤', description: 'Караоке на крыше с видом', city: 'almaty' },
  { id: 'a5', title: 'Latin Night', type: 'party', date: 'Завтра', time: '21:30', location: 'Salsa Club', lat: 43.2190, lng: 76.9150, attending: 78, capacity: 100, vibe: '💃', vibeLabel: 'Сальса', tags: ['Латина', 'Танцы'], color: 'from-purple-500 to-pink-500', price: '2000₸', hot: false, emoji: '💃', description: 'Латинские ритмы и танцы', city: 'almaty' },
  { id: 'a36', title: 'Hookah Lounge', type: 'party', date: 'Сегодня', time: '18:00', location: 'Smoke House', lat: 43.2200, lng: 76.9080, attending: 56, capacity: 80, vibe: '💨', vibeLabel: 'Кальян', tags: ['Кальян'], color: 'from-purple-500 to-pink-500', price: '3000₸', hot: false, emoji: '💨', description: 'Премиум кальяны', city: 'almaty' },
  { id: 'a38', title: 'Rooftop Party', type: 'party', date: '25 фев', time: '21:00', location: 'Penthouse 43', lat: 43.2430, lng: 76.9390, attending: 134, capacity: 150, vibe: '🌃', vibeLabel: 'Крыша', tags: ['Крыша', 'VIP'], color: 'from-purple-500 to-pink-500', price: '5000₸', hot: true, emoji: '🌃', description: 'Вечеринка на крыше', city: 'almaty' },

  // Еда
  { id: 'a6', title: 'Ужин с видом', type: 'food', date: 'Сегодня', time: '19:00', location: 'Abay Restaurant', lat: 43.2630, lng: 76.9380, attending: 234, capacity: 300, vibe: '🍽️', vibeLabel: 'Гастрономия', tags: ['Казахская кухня', 'Премиум'], color: 'from-red-500 to-orange-500', price: '5000₸', hot: true, emoji: '🍽️', description: 'Авторская казахская кухня', city: 'almaty' },
  { id: 'a7', title: 'Бранч Weekend', type: 'food', date: 'Сегодня', time: '11:00', location: 'Coffee Boom', lat: 43.2450, lng: 76.9330, attending: 89, capacity: 120, vibe: '🥐', vibeLabel: 'Уютно', tags: ['Завтрак', 'Кофе', 'Бранч'], color: 'from-red-500 to-orange-500', price: '2500₸', hot: false, emoji: '🥐', description: 'Лучшие завтраки города', city: 'almaty' },
  { id: 'a8', title: 'Суши Мастер-класс', type: 'food', date: '24 фев', time: '18:00', location: 'Furusato', lat: 43.2310, lng: 76.9410, attending: 45, capacity: 50, vibe: '🍣', vibeLabel: 'Япония', tags: ['Суши', 'Мастер-класс'], color: 'from-red-500 to-orange-500', price: '8000₸', hot: false, emoji: '🍣', description: 'Научитесь готовить суши', city: 'almaty' },
  { id: 'a9', title: 'Wine Tasting', type: 'food', date: 'Сегодня', time: '19:30', location: 'Vino Grad', lat: 43.2400, lng: 76.9180, attending: 56, capacity: 60, vibe: '🍷', vibeLabel: 'Вино', tags: ['Вино', 'Дегустация'], color: 'from-red-500 to-orange-500', price: '6000₸', hot: false, emoji: '🍷', description: 'Дегустация французских вин', city: 'almaty' },
  { id: 'a10', title: 'BBQ Weekend', type: 'food', date: 'Завтра', time: '17:00', location: 'Grill House', lat: 43.2520, lng: 76.9150, attending: 123, capacity: 150, vibe: '🥩', vibeLabel: 'Гриль', tags: ['BBQ', 'Мясо'], color: 'from-red-500 to-orange-500', price: '4500₸', hot: true, emoji: '🥩', description: 'Мясо на углях', city: 'almaty' },
  { id: 'a11', title: 'Итальянский вечер', type: 'food', date: 'Сегодня', time: '20:00', location: 'La Strada', lat: 43.2340, lng: 76.9550, attending: 92, capacity: 100, vibe: '🍝', vibeLabel: 'Италия', tags: ['Итальянская', 'Премиум'], color: 'from-red-500 to-orange-500', price: '5500₸', hot: false, emoji: '🍝', description: 'Настоящая итальянская кухня', city: 'almaty' },
  { id: 'a35', title: 'Coffee Tasting', type: 'food', date: 'Сегодня', time: '14:00', location: 'Coffeedelia', lat: 43.2580, lng: 76.9460, attending: 34, capacity: 40, vibe: '☕', vibeLabel: 'Кофе', tags: ['Кофе', 'Дегустация', 'Бариста'], color: 'from-red-500 to-orange-500', price: '2000₸', hot: false, emoji: '☕', description: 'Дегустация редких сортов', city: 'almaty' },

  // Концерты
  { id: 'a13', title: 'Jazz Evening', type: 'concert', date: 'Сегодня', time: '20:00', location: 'Панфилов Парк', lat: 43.2567, lng: 76.9286, attending: 156, capacity: 200, vibe: '🎷', vibeLabel: 'Джаз', tags: ['Джаз', 'Живая музыка'], color: 'from-amber-500 to-orange-500', price: '2500₸', hot: true, emoji: '🎷', description: 'Живой джаз под открытым небом', city: 'almaty' },
  { id: 'a14', title: 'Indie Concert', type: 'concert', date: '26 фев', time: '21:00', location: 'Megapolis', lat: 43.2420, lng: 76.9010, attending: 189, capacity: 250, vibe: '🎸', vibeLabel: 'Рок', tags: ['Инди', 'Рок'], color: 'from-indigo-500 to-purple-500', price: '4000₸', hot: false, emoji: '🎸', description: 'Местные инди-группы', city: 'almaty' },
  { id: 'a15', title: 'Classical Concert', type: 'concert', date: '25 фев', time: '19:00', location: 'Театр оперы и балета', lat: 43.2380, lng: 76.9550, attending: 234, capacity: 300, vibe: '🎻', vibeLabel: 'Классика', tags: ['Классика'], color: 'from-amber-500 to-orange-500', price: '7000₸', hot: true, emoji: '🎻', description: 'Симфонический оркестр', city: 'almaty' },
  { id: 'a16', title: 'DJ Battle', type: 'concert', date: 'Сегодня', time: '22:00', location: 'Gorky Park', lat: 43.2700, lng: 76.9580, attending: 312, capacity: 400, vibe: '🎧', vibeLabel: 'Electronic', tags: ['DJ', 'Electronic'], color: 'from-amber-500 to-orange-500', price: '2000₸', hot: true, emoji: '🎧', description: 'Битва лучших диджеев', city: 'almaty' },
  { id: 'a17', title: 'Open Mic', type: 'concert', date: 'Завтра', time: '19:00', location: 'Art Space', lat: 43.2440, lng: 76.9260, attending: 78, capacity: 100, vibe: '🎤', vibeLabel: 'Live', tags: ['Open Mic'], color: 'from-amber-500 to-orange-500', price: 'Бесплатно', hot: false, emoji: '🎤', description: 'Открытый микрофон для всех', city: 'almaty' },
  { id: 'a40', title: 'Stand-up Comedy', type: 'concert', date: 'Сегодня', time: '20:00', location: 'Comedy Club', lat: 43.2270, lng: 76.9320, attending: 112, capacity: 150, vibe: '😂', vibeLabel: 'Юмор', tags: ['Стендап', 'Юмор'], color: 'from-amber-500 to-orange-500', price: '3000₸', hot: false, emoji: '😂', description: 'Стендап вечер', city: 'almaty' },

  // Встречи
  { id: 'a18', title: 'Startup Meetup', type: 'meetup', date: '24 фев', time: '18:00', location: 'Dostyk Plaza', lat: 43.2230, lng: 76.8512, attending: 124, capacity: 150, vibe: '💼', vibeLabel: 'Стартапы', tags: ['Стартапы', 'Нетворкинг'], color: 'from-blue-500 to-indigo-500', price: 'Бесплатно', hot: true, emoji: '💼', description: 'Networking для основателей', city: 'almaty' },
  { id: 'a19', title: 'Business Breakfast', type: 'meetup', date: 'Завтра', time: '08:00', location: 'Ritz Carlton', lat: 43.2210, lng: 76.8990, attending: 67, capacity: 80, vibe: '☕', vibeLabel: 'Бизнес', tags: ['Бизнес', 'Нетворкинг'], color: 'from-cyan-500 to-blue-500', price: '5000₸', hot: false, emoji: '☕', description: 'Завтрак с предпринимателями', city: 'almaty' },
  { id: 'a20', title: 'Tech Talk', type: 'meetup', date: 'Сегодня', time: '19:00', location: 'Astana Hub Almaty', lat: 43.2340, lng: 76.9090, attending: 156, capacity: 200, vibe: '💻', vibeLabel: 'Tech', tags: ['IT', 'Tech'], color: 'from-blue-500 to-indigo-500', price: 'Бесплатно', hot: true, emoji: '💻', description: 'IT-сообщество встречается', city: 'almaty' },
  { id: 'a21', title: 'Design Meetup', type: 'meetup', date: '25 фев', time: '18:30', location: 'Creative Hub', lat: 43.2490, lng: 76.9420, attending: 89, capacity: 100, vibe: '✏️', vibeLabel: 'Дизайн', tags: ['Дизайн', 'UX/UI'], color: 'from-blue-500 to-indigo-500', price: '1000₸', hot: false, emoji: '✏️', description: 'Встреча дизайнеров', city: 'almaty' },
  { id: 'a22', title: 'Language Exchange', type: 'meetup', date: 'Сегодня', time: '17:00', location: 'Starbucks Nauryzbay', lat: 43.2180, lng: 76.9250, attending: 45, capacity: 60, vibe: '🗣️', vibeLabel: 'Языки', tags: ['Языки'], color: 'from-blue-500 to-indigo-500', price: 'Бесплатно', hot: false, emoji: '🗣️', description: 'Практика иностранных языков', city: 'almaty' },
  { id: 'a37', title: 'Board Games Night', type: 'meetup', date: 'Завтра', time: '19:00', location: 'Geek Bar', lat: 43.2370, lng: 76.9300, attending: 42, capacity: 50, vibe: '🎲', vibeLabel: 'Игры', tags: ['Настолки', 'Игры'], color: 'from-blue-500 to-indigo-500', price: '1500₸', hot: false, emoji: '🎲', description: '��астольные игры', city: 'almaty' },

  // Спорт
  { id: 'a23', title: 'Yoga Sunrise', type: 'sport', date: 'Завтра', time: '06:00', location: 'Kok Tobe', lat: 43.2324, lng: 76.9574, attending: 45, capacity: 60, vibe: '🧘', vibeLabel: 'Йога', tags: ['Йога', 'Горы'], color: 'from-green-400 to-emerald-500', price: '1500₸', hot: false, emoji: '🧘', description: 'Йога на рассвете с видом', city: 'almaty' },
  { id: 'a24', title: 'Running Club', type: 'sport', date: 'Сегодня', time: '07:00', location: 'First President Park', lat: 43.2290, lng: 76.9360, attending: 78, capacity: 100, vibe: '🏃', vibeLabel: 'Бег', tags: ['Бег'], color: 'from-green-400 to-emerald-500', price: 'Бесплатно', hot: true, emoji: '🏃', description: 'Утренняя пробежка в парке', city: 'almaty' },
  { id: 'a25', title: 'CrossFit Session', type: 'sport', date: 'Сегодня', time: '18:00', location: 'CrossFit Almaty', lat: 43.2560, lng: 76.9220, attending: 34, capacity: 40, vibe: '💪', vibeLabel: 'Сила', tags: ['CrossFit', 'Тренировка'], color: 'from-green-400 to-emerald-500', price: '2000₸', hot: false, emoji: '💪', description: 'Интенсивная тренировка', city: 'almaty' },
  { id: 'a26', title: 'Climbing Session', type: 'sport', date: '26 фев', time: '16:00', location: 'Mountain Climbing Club', lat: 43.2150, lng: 76.9420, attending: 56, capacity: 70, vibe: '🧗', vibeLabel: 'Скалолазание', tags: ['Скалодром'], color: 'from-green-400 to-emerald-500', price: '3000₸', hot: false, emoji: '🧗', description: 'Скалодром для начинающих', city: 'almaty' },
  { id: 'a27', title: 'Bike Tour', type: 'sport', date: 'Завтра', time: '09:00', location: 'Big Almaty Lake', lat: 43.0530, lng: 76.9900, attending: 67, capacity: 80, vibe: '🚴', vibeLabel: 'Велопрогулка', tags: ['Велосипед', 'Природа'], color: 'from-green-400 to-emerald-500', price: '2500₸', hot: false, emoji: '🚴', description: 'Велопрогулка к озеру', city: 'almaty' },
  { id: 'a28', title: 'Tennis Tournament', type: 'sport', date: '25 фев', time: '14:00', location: 'Tennis Club', lat: 43.2620, lng: 76.9120, attending: 32, capacity: 40, vibe: '🎾', vibeLabel: 'Теннис', tags: ['Теннис'], color: 'from-green-400 to-emerald-500', price: '4000₸', hot: false, emoji: '🎾', description: 'Любительский турнир', city: 'almaty' },

  // Искусство
  { id: 'a29', title: 'Art Exhibition', type: 'art', date: '25 фев', time: '10:00', location: 'Kasteyev Museum', lat: 43.2390, lng: 76.9490, attending: 78, capacity: 100, vibe: '🎨', vibeLabel: 'Искусство', tags: ['Выставка', 'Искусство'], color: 'from-pink-500 to-rose-500', price: '1000₸', hot: false, emoji: '🎨', description: 'Современное казахстанское искусство', city: 'almaty' },
  { id: 'a30', title: 'Photo Workshop', type: 'art', date: 'Сегодня', time: '15:00', location: 'Photography Studio', lat: 43.2470, lng: 76.9510, attending: 23, capacity: 30, vibe: '📸', vibeLabel: 'Фото', tags: ['Фотография'], color: 'from-pink-500 to-rose-500', price: '5000₸', hot: false, emoji: '📸', description: 'Мастер-класс по фотографии', city: 'almaty' },
  { id: 'a31', title: 'Theater Play', type: 'art', date: '24 фев', time: '19:00', location: 'Russian Drama Theater', lat: 43.2610, lng: 76.9450, attending: 167, capacity: 200, vibe: '🎭', vibeLabel: 'Театр', tags: ['Театр', 'Драма'], color: 'from-pink-500 to-rose-500', price: '3500₸', hot: true, emoji: '🎭', description: 'Премьера спектакля', city: 'almaty' },
  { id: 'a32', title: 'Pottery Class', type: 'art', date: 'Завтра', time: '16:00', location: 'Clay Studio', lat: 43.2330, lng: 76.9190, attending: 18, capacity: 25, vibe: '🏺', vibeLabel: 'Керамика', tags: ['Керамика'], color: 'from-pink-500 to-rose-500', price: '4000₸', hot: false, emoji: '🏺', description: 'Гончарное мастерство', city: 'almaty' },
  { id: 'a33', title: 'Street Art Tour', type: 'art', date: 'Сегодня', time: '11:00', location: 'Арбат район', lat: 43.2540, lng: 76.9340, attending: 45, capacity: 60, vibe: '🖌️', vibeLabel: 'Граффити', tags: ['Граффити', 'Стрит-арт'], color: 'from-pink-500 to-rose-500', price: '1500₸', hot: false, emoji: '🖌️', description: 'Экскурсия по стрит-арту', city: 'almaty' },
  { id: 'a34', title: 'Film Screening', type: 'art', date: '26 фев', time: '20:00', location: 'Arman Cinema', lat: 43.2250, lng: 76.9380, attending: 89, capacity: 120, vibe: '🎬', vibeLabel: 'Кино', tags: ['Кино', 'Авторское'], color: 'from-pink-500 to-rose-500', price: '2000₸', hot: false, emoji: '🎬', description: 'Авторское кино', city: 'almaty' },
];

// ======================== ASTANA EVENTS ========================
const astanaEvents: EventItem[] = [
  // Вечеринки
  { id: 's1', title: 'EXPO Night Club', type: 'party', date: 'Сегодня', time: '22:00', location: 'EXPO ASTANA', lat: 51.0887, lng: 71.4155, attending: 210, capacity: 300, vibe: '🎧', vibeLabel: 'Мега', tags: ['Техно', 'Танцы', 'Ночь'], color: 'from-purple-500 to-pink-500', price: '5000₸', hot: true, emoji: '🎧', description: 'Техно-вечеринка на территории EXPO', city: 'astana' },
  { id: 's2', title: 'Barys Fan Party', type: 'party', date: 'Сегодня', time: '20:00', location: 'Barys Arena', lat: 51.1321, lng: 71.3983, attending: 320, capacity: 500, vibe: '🏒', vibeLabel: 'Фанаты', tags: ['Музыка', 'Пиво'], color: 'from-purple-500 to-pink-500', price: '2000₸', hot: true, emoji: '🏒', description: 'Вечеринка после матча Барыс', city: 'astana' },
  { id: 's3', title: 'Студенческая вечеринка', type: 'party', date: 'Завтра', time: '21:00', location: 'Назарбаев Университет', lat: 51.0906, lng: 71.3977, attending: 180, capacity: 250, vibe: '🎉', vibeLabel: 'Студенты', tags: ['Disco', 'Танцы'], color: 'from-purple-500 to-pink-500', price: '1500₸', hot: false, emoji: '🎉', description: 'Вечеринка для студентов НУ', city: 'astana' },
  { id: 's4', title: 'Karaoke Battle', type: 'party', date: 'Сегодня', time: '19:00', location: 'Mega Silk Way', lat: 51.0904, lng: 71.4076, attending: 89, capacity: 120, vibe: '🎤', vibeLabel: 'Караоке', tags: ['Караоке'], color: 'from-purple-500 to-pink-500', price: '3000₸', hot: false, emoji: '🎤', description: 'Караоке-батл с призами', city: 'astana' },
  { id: 's5', title: 'Rooftop Abu Dhabi Plaza', type: 'party', date: '25 фев', time: '21:00', location: 'Abu Dhabi Plaza', lat: 51.1285, lng: 71.4300, attending: 145, capacity: 180, vibe: '🌃', vibeLabel: 'Крыша', tags: ['Крыша', 'VIP'], color: 'from-purple-500 to-pink-500', price: '7000₸', hot: true, emoji: '🌃', description: 'Вечеринка на самом высоком здании ЦА', city: 'astana' },

  // Еда
  { id: 's6', title: 'Бешбармак Фест', type: 'food', date: 'Сегодня', time: '18:00', location: 'Rixos Khan Shatyr', lat: 51.1324, lng: 71.4040, attending: 280, capacity: 350, vibe: '🍖', vibeLabel: 'Казахская', tags: ['Казахская кухня', 'Премиум'], color: 'from-red-500 to-orange-500', price: '6000₸', hot: true, emoji: '🍖', description: 'Фестиваль казахской кухни', city: 'astana' },
  { id: 's7', title: 'Brunch at Hilton', type: 'food', date: 'Завтра', time: '10:00', location: 'Hilton Astana', lat: 51.1284, lng: 71.4261, attending: 95, capacity: 120, vibe: '🥐', vibeLabel: 'Бранч', tags: ['Бранч', 'Завтрак', 'Премиум'], color: 'from-red-500 to-orange-500', price: '4500₸', hot: false, emoji: '🥐', description: 'Воскресный бранч с видом на Ишим', city: 'astana' },
  { id: 's8', title: 'Wine & Cheese Night', type: 'food', date: 'Сегодня', time: '19:00', location: 'Тюбетейка', lat: 51.1443, lng: 71.4482, attending: 67, capacity: 80, vibe: '🍷', vibeLabel: 'Вино', tags: ['Вино', 'Дегустация'], color: 'from-red-500 to-orange-500', price: '5000₸', hot: false, emoji: '🍷', description: 'Дегустация вин и сыров', city: 'astana' },
  { id: 's9', title: 'Стейк Чемпионат', type: 'food', date: 'Завтра', time: '17:00', location: 'Selfie Astana', lat: 51.1567, lng: 71.4225, attending: 156, capacity: 200, vibe: '🥩', vibeLabel: 'Гриль', tags: ['BBQ', 'Мясо'], color: 'from-red-500 to-orange-500', price: '5500₸', hot: true, emoji: '🥩', description: 'Чемпионат по жарке стейков', city: 'astana' },
  { id: 's10', title: 'Coffee Festival', type: 'food', date: 'Сегодня', time: '12:00', location: 'Байтерек район', lat: 51.1284, lng: 71.4307, attending: 120, capacity: 200, vibe: '☕', vibeLabel: 'Кофе', tags: ['Кофе', 'Бариста'], color: 'from-red-500 to-orange-500', price: '1500₸', hot: false, emoji: '☕', description: 'Фестиваль кофе от лучших бариста', city: 'astana' },

  // Концерты
  { id: 's11', title: 'Казахстан Philharmonic', type: 'concert', date: 'Сегодня', time: '19:00', location: 'Конгресс-холл', lat: 51.1242, lng: 71.4322, attending: 350, capacity: 500, vibe: '🎻', vibeLabel: 'Классика', tags: ['Классика'], color: 'from-amber-500 to-orange-500', price: '5000₸', hot: true, emoji: '🎻', description: 'Государственная Филармония', city: 'astana' },
  { id: 's12', title: 'Dimash Fan Night', type: 'concert', date: '26 фев', time: '20:00', location: 'Barys Arena', lat: 51.1321, lng: 71.3983, attending: 450, capacity: 500, vibe: '🎤', vibeLabel: 'Поп', tags: ['Живая музыка'], color: 'from-amber-500 to-orange-500', price: '10000₸', hot: true, emoji: '🎤', description: 'Трибьют-концерт Димаша', city: 'astana' },
  { id: 's13', title: 'Electronic Fest', type: 'concert', date: 'Сегодня', time: '22:00', location: 'Khan Shatyr', lat: 51.1324, lng: 71.4040, attending: 230, capacity: 300, vibe: '🎧', vibeLabel: 'Electronic', tags: ['DJ', 'Electronic'], color: 'from-amber-500 to-orange-500', price: '3500₸', hot: false, emoji: '🎧', description: 'Электронный фестиваль в Хан Шатыре', city: 'astana' },
  { id: 's14', title: 'Jazz at Ritz', type: 'concert', date: 'Завтра', time: '20:00', location: 'The Ritz-Carlton', lat: 51.1240, lng: 71.4290, attending: 78, capacity: 100, vibe: '🎷', vibeLabel: 'Джаз', tags: ['Джаз'], color: 'from-amber-500 to-orange-500', price: '4000₸', hot: false, emoji: '🎷', description: 'Джазовый вечер в Ритце', city: 'astana' },
  { id: 's15', title: 'Comedy Night Astana', type: 'concert', date: 'Сегодня', time: '19:30', location: 'Stand Up Astana', lat: 51.1488, lng: 71.4495, attending: 98, capacity: 120, vibe: '😂', vibeLabel: 'Юмор', tags: ['Стендап', 'Юмор'], color: 'from-amber-500 to-orange-500', price: '2500₸', hot: false, emoji: '😂', description: 'Стендап комедии на русском и казахском', city: 'astana' },

  // Встречи
  { id: 's16', title: 'Astana Hub Meetup', type: 'meetup', date: 'Сегодня', time: '18:00', location: 'Astana Hub', lat: 51.0906, lng: 71.3977, attending: 180, capacity: 200, vibe: '💼', vibeLabel: 'Стартапы', tags: ['Стартапы', 'IT', 'Tech'], color: 'from-blue-500 to-indigo-500', price: 'Бесплатно', hot: true, emoji: '💼', description: 'Крупнейший IT-хаб Центральной Азии', city: 'astana' },
  { id: 's17', title: 'Government Innovation', type: 'meetup', date: '25 фев', time: '10:00', location: 'Дом Министерств', lat: 51.1256, lng: 71.4312, attending: 120, capacity: 150, vibe: '🏛️', vibeLabel: 'Инновации', tags: ['Бизнес', 'Нетворкинг'], color: 'from-blue-500 to-indigo-500', price: 'Бесплатно', hot: false, emoji: '🏛️', description: 'Форум инноваций в госсекторе', city: 'astana' },
  { id: 's18', title: 'Crypto Meetup', type: 'meetup', date: 'Завтра', time: '19:00', location: 'AIFC', lat: 51.0887, lng: 71.4155, attending: 90, capacity: 120, vibe: '💰', vibeLabel: 'Крипто', tags: ['IT', 'Нетворкинг'], color: 'from-blue-500 to-indigo-500', price: '2000₸', hot: false, emoji: '💰', description: 'Крипто и блокчейн в МФЦА', city: 'astana' },
  { id: 's19', title: 'Women in Tech', type: 'meetup', date: 'Сегодня', time: '17:00', location: 'NU Library', lat: 51.0906, lng: 71.3977, attending: 65, capacity: 80, vibe: '👩‍💻', vibeLabel: 'WIT', tags: ['IT', 'Нетворкинг'], color: 'from-blue-500 to-indigo-500', price: 'Бесплатно', hot: false, emoji: '👩‍💻', description: 'Женщины в технологиях', city: 'astana' },

  // Спорт
  { id: 's20', title: 'Ишим Набережная Run', type: 'sport', date: 'Завтра', time: '07:00', location: 'Набережная Ишима', lat: 51.1285, lng: 71.4200, attending: 120, capacity: 200, vibe: '🏃', vibeLabel: 'Бег', tags: ['Бег'], color: 'from-green-400 to-emerald-500', price: 'Бесплатно', hot: true, emoji: '🏃', description: 'Утренняя пробежка по набережной', city: 'astana' },
  { id: 's21', title: 'Ice Skating Party', type: 'sport', date: 'Сегодня', time: '16:00', location: 'Alau Ice Palace', lat: 51.1005, lng: 71.4191, attending: 180, capacity: 250, vibe: '⛸️', vibeLabel: 'Каток', tags: ['Тренировка'], color: 'from-green-400 to-emerald-500', price: '2000₸', hot: true, emoji: '⛸️', description: 'Ледовый дворец Алау', city: 'astana' },
  { id: 's22', title: 'Yoga at Khan Shatyr', type: 'sport', date: 'Завтра', time: '08:00', location: 'Khan Shatyr Indoor', lat: 51.1324, lng: 71.4040, attending: 45, capacity: 60, vibe: '🧘', vibeLabel: 'Йога', tags: ['Йога', 'Медитация'], color: 'from-green-400 to-emerald-500', price: '2500₸', hot: false, emoji: '🧘', description: 'Йога в Хан-Шатыре', city: 'astana' },
  { id: 's23', title: 'CrossFit Capital', type: 'sport', date: 'Сегодня', time: '18:30', location: 'CrossFit Astana', lat: 51.1500, lng: 71.4600, attending: 28, capacity: 35, vibe: '💪', vibeLabel: 'Сила', tags: ['CrossFit', 'Тренировка'], color: 'from-green-400 to-emerald-500', price: '2500₸', hot: false, emoji: '💪', description: 'Кроссфит в столице', city: 'astana' },

  // Искусство
  { id: 's24', title: 'National Museum Tour', type: 'art', date: 'Сегодня', time: '11:00', location: 'Национальный Музей', lat: 51.1245, lng: 71.4320, attending: 120, capacity: 200, vibe: '🏛️', vibeLabel: 'Музей', tags: ['Выставка', 'Искусство'], color: 'from-pink-500 to-rose-500', price: '1500₸', hot: false, emoji: '🏛️', description: 'Экскурсия по Нац. музею', city: 'astana' },
  { id: 's25', title: 'Astana Opera', type: 'art', date: '26 фев', time: '19:00', location: 'Astana Opera', lat: 51.1283, lng: 71.4283, attending: 280, capacity: 350, vibe: '🎭', vibeLabel: 'Опера', tags: ['Театр'], color: 'from-pink-500 to-rose-500', price: '8000₸', hot: true, emoji: '🎭', description: 'Опера «Абай» на сцене Astana Opera', city: 'astana' },
  { id: 's26', title: 'Modern Art Gallery', type: 'art', date: 'Завтра', time: '14:00', location: 'Hazret Sultan Gallery', lat: 51.1260, lng: 71.4350, attending: 55, capacity: 80, vibe: '🎨', vibeLabel: 'Совр. арт', tags: ['Искусство'], color: 'from-pink-500 to-rose-500', price: '2000₸', hot: false, emoji: '🎨', description: 'Современное искусство Казахстана', city: 'astana' },
  { id: 's27', title: 'Photo Walk', type: 'art', date: 'Сегодня', time: '15:00', location: 'Байтерек', lat: 51.1284, lng: 71.4307, attending: 35, capacity: 40, vibe: '📸', vibeLabel: 'Фото', tags: ['Фотография'], color: 'from-pink-500 to-rose-500', price: 'Бесплатно', hot: false, emoji: '📸', description: 'Фото-прогулка по столице', city: 'astana' },
];

export function getAllEvents(): EventItem[] {
  // Also load custom events from localStorage
  const customEvents = loadCustomEvents();
  return [...almatyEvents, ...astanaEvents, ...customEvents];
}

export function getEventsByCity(cityId: CityId): EventItem[] {
  const all = getAllEvents();
  return all.filter(e => e.city === cityId);
}

// Custom events management
export function loadCustomEvents(): EventItem[] {
  try {
    const stored = localStorage.getItem('custom_events');
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

export function saveCustomEvent(event: EventItem): void {
  const existing = loadCustomEvents();
  existing.push(event);
  localStorage.setItem('custom_events', JSON.stringify(existing));
}

export function deleteCustomEvent(id: string): void {
  const existing = loadCustomEvents();
  localStorage.setItem('custom_events', JSON.stringify(existing.filter(e => e.id !== id)));
}
