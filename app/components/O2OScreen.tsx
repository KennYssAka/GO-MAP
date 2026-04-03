import { useState, useMemo, useCallback } from 'react';
import {
  ArrowLeft, Tag, Ticket, Clock, MapPin, Star, ChevronRight,
  Flame, Gift, Percent, Crown, Shield, Sparkles, QrCode,
  Copy, CheckCircle2, X, Timer, Store, Coffee, Dumbbell,
  Clapperboard, BookOpen, Martini, Heart, TrendingUp, Search,
  Filter, ChevronDown, Award, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useKarma, KARMA_RANKS, getRank } from './KarmaContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

// ─── Types ────────────────────────────────────────────────
type DealCategory = 'food' | 'fitness' | 'beauty' | 'entertainment' | 'nightlife' | 'education' | 'all';
type DealStatus = 'available' | 'activated' | 'used' | 'expired';

interface PartnerDeal {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerLogo: string;
  partnerImage: string;
  category: DealCategory;
  title: string;
  description: string;
  discount: string;
  discountValue: number; // percentage or fixed amount
  minKarma: number;
  pointsCost: number; // cost in points to activate
  address: string;
  city: string;
  distance: string;
  rating: number;
  usedCount: number;
  maxUses: number;
  expiresAt: string;
  validHours: string;
  conditions: string[];
  tags: string[];
  isHot: boolean;
  isNew: boolean;
  isExclusive: boolean;
}

interface ActivatedCoupon {
  dealId: string;
  activatedAt: number;
  expiresAt: number;
  code: string;
  status: DealStatus;
}

// ─── Mock Data ────────────────────────────────────────────
const PARTNER_DEALS: PartnerDeal[] = [
  {
    id: 'd1',
    partnerId: 'p1',
    partnerName: 'The Ritz Coffee',
    partnerLogo: '☕',
    partnerImage: 'https://images.unsplash.com/photo-1567600175325-3573c56bee05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwY2FmZSUyMHJlc3RhdXJhbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzMxNTEyMzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'food',
    title: 'Второй кофе бесплатно',
    description: 'Закажите любой кофе и получите второй такой же в подарок. Идеально для встречи с другом!',
    discount: '2-й бесплатно',
    discountValue: 50,
    minKarma: 0,
    pointsCost: 100,
    address: 'ул. Кабанбай Батыра, 15',
    city: 'Астана',
    distance: '1.2 км',
    rating: 4.8,
    usedCount: 342,
    maxUses: 500,
    expiresAt: '2026-04-15',
    validHours: '08:00 — 22:00',
    conditions: ['Не суммируется с другими акциями', 'Один раз в день'],
    tags: ['кофе', 'встреча', 'уютно'],
    isHot: true,
    isNew: false,
    isExclusive: false,
  },
  {
    id: 'd2',
    partnerId: 'p2',
    partnerName: 'FitLife Gym',
    partnerLogo: '💪',
    partnerImage: 'https://images.unsplash.com/photo-1771586791190-97ed536c54af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltJTIwbW9kZXJufGVufDF8fHx8MTc3MzE0OTY1MHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'fitness',
    title: '-30% на месячный абонемент',
    description: 'Скидка на полный абонемент с доступом ко всем залам и групповым занятиям.',
    discount: '-30%',
    discountValue: 30,
    minKarma: 200,
    pointsCost: 500,
    address: 'пр. Республики, 42',
    city: 'Астана',
    distance: '2.8 км',
    rating: 4.6,
    usedCount: 127,
    maxUses: 200,
    expiresAt: '2026-05-01',
    validHours: '06:00 — 23:00',
    conditions: ['Для новых клиентов', 'Нужен документ удостоверяющий личность'],
    tags: ['фитнес', 'здоровье', 'тренировка'],
    isHot: false,
    isNew: true,
    isExclusive: false,
  },
  {
    id: 'd3',
    partnerId: 'p3',
    partnerName: 'SPA Oasis',
    partnerLogo: '🧖',
    partnerImage: 'https://images.unsplash.com/photo-1757689314932-bec6e9c39e51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjB3ZWxsbmVzcyUyMG1hc3NhZ2V8ZW58MXx8fHwxNzczMTI0NjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'beauty',
    title: 'VIP массаж со скидкой 40%',
    description: 'Эксклюзивная скидка на часовой VIP-массаж с ароматерапией.',
    discount: '-40%',
    discountValue: 40,
    minKarma: 1000,
    pointsCost: 800,
    address: 'ул. Сыганак, 60',
    city: 'Астана',
    distance: '3.5 км',
    rating: 4.9,
    usedCount: 56,
    maxUses: 100,
    expiresAt: '2026-04-30',
    validHours: '10:00 — 21:00',
    conditions: ['Предварительная запись обязательна', 'Только VIP-кабинеты'],
    tags: ['спа', 'релакс', 'люкс'],
    isHot: false,
    isNew: false,
    isExclusive: true,
  },
  {
    id: 'd4',
    partnerId: 'p4',
    partnerName: 'Skybar Astana',
    partnerLogo: '🍸',
    partnerImage: 'https://images.unsplash.com/photo-1768510785894-070326bf8aa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBiYXIlMjBkcmlua3N8ZW58MXx8fHwxNzczMTcxODEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'nightlife',
    title: 'Бесплатный вход + коктейль',
    description: 'Бесплатный вход на любую тематическую вечеринку плюс фирменный коктейль в подарок.',
    discount: 'Бесплатно',
    discountValue: 100,
    minKarma: 500,
    pointsCost: 350,
    address: 'пр. Мангилик Ел, 54/1, 25 этаж',
    city: 'Астана',
    distance: '4.1 км',
    rating: 4.7,
    usedCount: 213,
    maxUses: 300,
    expiresAt: '2026-03-31',
    validHours: '21:00 — 04:00',
    conditions: ['Пт-Сб', '18+ с документом', 'Дресс-код smart casual'],
    tags: ['бар', 'вечеринка', 'коктейли'],
    isHot: true,
    isNew: false,
    isExclusive: false,
  },
  {
    id: 'd5',
    partnerId: 'p5',
    partnerName: 'Kinopark 7',
    partnerLogo: '🎬',
    partnerImage: 'https://images.unsplash.com/photo-1739433437912-cca661ba902f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHRoZWF0ZXJ8ZW58MXx8fHwxNzczMTAyNDU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'entertainment',
    title: '2 билета по цене 1',
    description: 'Купите один билет на любой фильм и получите второй бесплатно. Для вас и друга!',
    discount: '1+1',
    discountValue: 50,
    minKarma: 50,
    pointsCost: 200,
    address: 'ТРЦ Mega Silk Way',
    city: 'Астана',
    distance: '5.2 км',
    rating: 4.5,
    usedCount: 478,
    maxUses: 600,
    expiresAt: '2026-04-20',
    validHours: '10:00 — 23:30',
    conditions: ['Не в день премьеры', 'Кроме IMAX и VIP'],
    tags: ['кино', 'развлечения', 'друзья'],
    isHot: false,
    isNew: true,
    isExclusive: false,
  },
  {
    id: 'd6',
    partnerId: 'p6',
    partnerName: 'Marwin Books',
    partnerLogo: '📚',
    partnerImage: 'https://images.unsplash.com/photo-1646351388897-3f2ec459d6bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rc3RvcmUlMjBjb2ZmZWUlMjBzaG9wfGVufDF8fHx8MTc3MzE3MTgxMHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'education',
    title: '-25% на любую книгу',
    description: 'Скидка на любую книгу в магазине. Бонус: бесплатный кофе при покупке от 3000 тг.',
    discount: '-25%',
    discountValue: 25,
    minKarma: 50,
    pointsCost: 150,
    address: 'ул. Достык, 5/1',
    city: 'Астана',
    distance: '1.8 км',
    rating: 4.9,
    usedCount: 89,
    maxUses: 150,
    expiresAt: '2026-06-01',
    validHours: '09:00 — 21:00',
    conditions: ['Одна книга за визит', 'При покупке от 1500 тг'],
    tags: ['книги', 'образование', 'кофе'],
    isHot: false,
    isNew: false,
    isExclusive: false,
  },
  {
    id: 'd7',
    partnerId: 'p1',
    partnerName: 'The Ritz Coffee',
    partnerLogo: '☕',
    partnerImage: 'https://images.unsplash.com/photo-1567600175325-3573c56bee05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwY2FmZSUyMHJlc3RhdXJhbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzMxNTEyMzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'food',
    title: 'Архитектор: Завтрак бесплатно',
    description: 'Эксклюзивное предложение для Архитекторов города! Полный завтрак-сет в подарок при любом заказе.',
    discount: 'Бесплатно',
    discountValue: 100,
    minKarma: 10000,
    pointsCost: 0,
    address: 'ул. Кабанбай Батыра, 15',
    city: 'Астана',
    distance: '1.2 км',
    rating: 4.8,
    usedCount: 3,
    maxUses: 10,
    expiresAt: '2026-12-31',
    validHours: '08:00 — 12:00',
    conditions: ['Только ранг Архитектор', 'Раз в неделю'],
    tags: ['эксклюзив', 'VIP', 'завтрак'],
    isHot: false,
    isNew: false,
    isExclusive: true,
  },
];

const CATEGORIES: { id: DealCategory; label: string; icon: React.ReactNode; emoji: string }[] = [
  { id: 'all', label: 'Все', icon: <Sparkles className="w-4 h-4" />, emoji: '✨' },
  { id: 'food', label: 'Еда', icon: <Coffee className="w-4 h-4" />, emoji: '🍕' },
  { id: 'fitness', label: 'Фитнес', icon: <Dumbbell className="w-4 h-4" />, emoji: '💪' },
  { id: 'beauty', label: 'Красота', icon: <Heart className="w-4 h-4" />, emoji: '💅' },
  { id: 'entertainment', label: 'Досуг', icon: <Clapperboard className="w-4 h-4" />, emoji: '🎬' },
  { id: 'nightlife', label: 'Ночная', icon: <Martini className="w-4 h-4" />, emoji: '🍸' },
  { id: 'education', label: 'Знания', icon: <BookOpen className="w-4 h-4" />, emoji: '📚' },
];

function generatePromoCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'RM-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function formatTimeRemaining(expiresAt: number): string {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return 'Истёк';
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (hours > 24) return `${Math.floor(hours / 24)}д ${hours % 24}ч`;
  if (hours > 0) return `${hours}ч ${minutes}м`;
  return `${minutes}м`;
}

type Tab = 'deals' | 'wallet' | 'history';

// ─── Main Component ───────────────────────────────────────
export function O2OScreen({ onBack }: { onBack: () => void }) {
  const { state: karmaState, level, rank } = useKarma();
  const [tab, setTab] = useState<Tab>('deals');
  const [category, setCategory] = useState<DealCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeal, setSelectedDeal] = useState<PartnerDeal | null>(null);
  const [activatedCoupons, setActivatedCoupons] = useState<ActivatedCoupon[]>(() => {
    try {
      const stored = localStorage.getItem('o2o_coupons');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'nearest' | 'discount'>('popular');

  const saveCoupons = useCallback((coupons: ActivatedCoupon[]) => {
    setActivatedCoupons(coupons);
    localStorage.setItem('o2o_coupons', JSON.stringify(coupons));
  }, []);

  const filteredDeals = useMemo(() => {
    let deals = PARTNER_DEALS;
    if (category !== 'all') deals = deals.filter(d => d.category === category);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      deals = deals.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.partnerName.toLowerCase().includes(q) ||
        d.tags.some(t => t.includes(q))
      );
    }
    // Sort
    if (sortBy === 'popular') deals = [...deals].sort((a, b) => b.usedCount - a.usedCount);
    else if (sortBy === 'nearest') deals = [...deals].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    else deals = [...deals].sort((a, b) => b.discountValue - a.discountValue);
    return deals;
  }, [category, searchQuery, sortBy]);

  const activeCoupons = activatedCoupons.filter(c => c.status === 'activated' && c.expiresAt > Date.now());
  const usedCoupons = activatedCoupons.filter(c => c.status === 'used');

  const canActivate = (deal: PartnerDeal) => {
    if (karmaState.totalKarma < deal.minKarma) return { can: false, reason: `Нужно ${deal.minKarma} кармы` };
    if (karmaState.totalPoints < deal.pointsCost) return { can: false, reason: `Нужно ${deal.pointsCost} очков` };
    if (activatedCoupons.some(c => c.dealId === deal.id && c.status === 'activated' && c.expiresAt > Date.now())) {
      return { can: false, reason: 'Уже активирован' };
    }
    return { can: true, reason: '' };
  };

  const handleActivate = (deal: PartnerDeal) => {
    const code = generatePromoCode();
    const coupon: ActivatedCoupon = {
      dealId: deal.id,
      activatedAt: Date.now(),
      expiresAt: Date.now() + 48 * 3600000, // 48 hours
      code,
      status: 'activated',
    };
    const newCoupons = [...activatedCoupons, coupon];
    saveCoupons(newCoupons);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const handleUseCoupon = (coupon: ActivatedCoupon) => {
    const updated = activatedCoupons.map(c =>
      c.dealId === coupon.dealId && c.activatedAt === coupon.activatedAt
        ? { ...c, status: 'used' as DealStatus }
        : c
    );
    saveCoupons(updated);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const requiredRank = (minKarma: number) => getRank(minKarma);

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'deals', label: 'Скидки', icon: <Tag className="w-4 h-4" /> },
    { id: 'wallet', label: 'Кошелёк', icon: <Ticket className="w-4 h-4" />, count: activeCoupons.length },
    { id: 'history', label: 'История', icon: <Clock className="w-4 h-4" />, count: usedCoupons.length },
  ];

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-900 to-black overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 p-5 pb-4 relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />

        <div className="flex items-center gap-3 mb-4 relative z-10">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Партнёры & Скидки</h1>
            <p className="text-emerald-200 text-xs">O2O — превращай карму в реальные бонусы</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
            <span className="text-lg">{rank.emoji}</span>
            <span className="text-white text-xs font-bold">{karmaState.totalKarma}</span>
          </div>
        </div>

        {/* Points balance */}
        <div className="flex gap-3 relative z-10">
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">{karmaState.totalPoints.toLocaleString()}</p>
              <p className="text-white/60 text-xs">Очки для покупок</p>
            </div>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/30 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">{activeCoupons.length}</p>
              <p className="text-white/60 text-xs">Активных купонов</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="flex bg-gray-800/50 rounded-2xl p-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                tab === t.id
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : 'text-gray-400'
              }`}
            >
              {t.icon}
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  tab === t.id ? 'bg-white/20' : 'bg-gray-700'
                }`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* ─── DEALS TAB ──────────────────────── */}
        {tab === 'deals' && (
          <div className="px-4">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Поиск скидок..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    category === cat.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs">{filteredDeals.length} предложений</p>
              <div className="flex gap-1.5">
                {([
                  { id: 'popular', label: 'Популярные' },
                  { id: 'nearest', label: 'Ближайшие' },
                  { id: 'discount', label: 'Скидка' },
                ] as { id: typeof sortBy; label: string }[]).map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                      sortBy === s.id ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Deal cards */}
            <div className="space-y-3 pb-4">
              {filteredDeals.map((deal, idx) => {
                const { can, reason } = canActivate(deal);
                const isLocked = karmaState.totalKarma < deal.minKarma;
                const dealRank = requiredRank(deal.minKarma);

                return (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <button
                      onClick={() => setSelectedDeal(deal)}
                      className={`w-full text-left rounded-2xl overflow-hidden transition-all ${
                        isLocked ? 'opacity-60' : 'active:scale-[0.98]'
                      }`}
                    >
                      {/* Image */}
                      <div className="relative h-36">
                        <ImageWithFallback
                          src={deal.partnerImage}
                          alt={deal.partnerName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Badges */}
                        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                          {deal.isHot && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Flame className="w-3 h-3" /> HOT
                            </span>
                          )}
                          {deal.isNew && (
                            <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
                          )}
                          {deal.isExclusive && (
                            <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Crown className="w-3 h-3" /> VIP
                            </span>
                          )}
                        </div>

                        {/* Discount badge */}
                        <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white font-bold text-sm px-3 py-1 rounded-xl shadow-lg">
                          {deal.discount}
                        </div>

                        {/* Lock overlay */}
                        {isLocked && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="bg-black/70 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                              <Shield className="w-5 h-5 text-yellow-400" />
                              <div>
                                <p className="text-white text-xs font-bold">{dealRank.emoji} {dealRank.name}</p>
                                <p className="text-gray-400 text-[10px]">{deal.minKarma - karmaState.totalKarma} кармы до разблокировки</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Bottom info on image */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
                          <div>
                            <p className="text-white font-bold text-base leading-tight">{deal.title}</p>
                            <p className="text-white/70 text-xs">{deal.partnerName}</p>
                          </div>
                        </div>
                      </div>

                      {/* Info bar */}
                      <div className="bg-gray-800 px-3.5 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {deal.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400" /> {deal.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> {deal.usedCount}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {deal.pointsCost > 0 && (
                            <span className="text-yellow-400 text-xs font-bold">{deal.pointsCost}⚡</span>
                          )}
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── WALLET TAB ─────────────────────── */}
        {tab === 'wallet' && (
          <div className="px-4 pt-2">
            {activeCoupons.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-white font-bold text-lg mb-1">Кошелёк пуст</p>
                <p className="text-gray-500 text-sm mb-4">Активируйте скидку в разделе «Скидки»</p>
                <button
                  onClick={() => setTab('deals')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold"
                >
                  Смотреть скидки
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeCoupons.map((coupon, idx) => {
                  const deal = PARTNER_DEALS.find(d => d.id === coupon.dealId);
                  if (!deal) return null;
                  return (
                    <motion.div
                      key={`${coupon.dealId}-${coupon.activatedAt}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-gray-800 rounded-2xl overflow-hidden border border-emerald-500/20"
                    >
                      {/* Coupon header */}
                      <div className="flex items-center gap-3 p-4 border-b border-dashed border-gray-700">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl">
                          {deal.partnerLogo}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-bold text-sm">{deal.title}</p>
                          <p className="text-gray-500 text-xs">{deal.partnerName}</p>
                        </div>
                        <div className="bg-emerald-500 text-white font-bold text-sm px-3 py-1 rounded-lg">
                          {deal.discount}
                        </div>
                      </div>

                      {/* Code section */}
                      <div className="p-4">
                        <p className="text-gray-500 text-xs mb-2">Ваш промокод:</p>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex-1 bg-gray-900 rounded-xl py-3 px-4 text-center">
                            <p className="text-emerald-400 font-mono font-bold text-xl tracking-widest">{coupon.code}</p>
                          </div>
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            className="w-11 h-11 rounded-xl bg-gray-700 flex items-center justify-center active:scale-95 transition-transform"
                          >
                            {copiedCode === coupon.code ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Copy className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </div>

                        {/* Timer */}
                        <div className="flex items-center justify-between text-xs mb-3">
                          <div className="flex items-center gap-1.5 text-orange-400">
                            <Timer className="w-3.5 h-3.5" />
                            <span>Истекает через {formatTimeRemaining(coupon.expiresAt)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{deal.address}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUseCoupon(coupon)}
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm active:scale-[0.98] transition-transform"
                          >
                            ✅ Использовано
                          </button>
                          <button
                            onClick={() => setSelectedDeal(deal)}
                            className="py-2.5 px-4 rounded-xl bg-gray-700 text-gray-300 text-sm"
                          >
                            Детали
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── HISTORY TAB ────────────────────── */}
        {tab === 'history' && (
          <div className="px-4 pt-2">
            {usedCoupons.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-white font-bold text-lg mb-1">Нет использованных купонов</p>
                <p className="text-gray-500 text-sm">Активируйте и используйте скидки у партнёров</p>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Stats */}
                <div className="bg-gray-800 rounded-2xl p-4 mb-3">
                  <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    Статистика экономии
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-700/50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-emerald-400">{usedCoupons.length}</p>
                      <p className="text-gray-400 text-xs">Купонов использовано</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-yellow-400">
                        {usedCoupons.reduce((sum, c) => {
                          const d = PARTNER_DEALS.find(dd => dd.id === c.dealId);
                          return sum + (d?.discountValue || 0);
                        }, 0)}%
                      </p>
                      <p className="text-gray-400 text-xs">Суммарная экономия</p>
                    </div>
                  </div>
                </div>

                {usedCoupons.map((coupon, idx) => {
                  const deal = PARTNER_DEALS.find(d => d.id === coupon.dealId);
                  if (!deal) return null;
                  return (
                    <div key={`${coupon.dealId}-${coupon.activatedAt}`} className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-xl">
                        {deal.partnerLogo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{deal.title}</p>
                        <p className="text-gray-500 text-xs">{deal.partnerName} · {new Date(coupon.activatedAt).toLocaleDateString('ru-RU')}</p>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold">{deal.discount}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── DEAL DETAIL MODAL ────────────────── */}
      <AnimatePresence>
        {selectedDeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex flex-col"
            onClick={() => setSelectedDeal(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-gray-900 rounded-t-3xl overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Deal image */}
              <div className="relative h-48 flex-shrink-0">
                <ImageWithFallback
                  src={selectedDeal.partnerImage}
                  alt={selectedDeal.partnerName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
                <button
                  onClick={() => setSelectedDeal(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-1">
                    {selectedDeal.isHot && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">🔥 HOT</span>}
                    {selectedDeal.isExclusive && <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">👑 VIP</span>}
                  </div>
                  <h2 className="text-white font-bold text-xl">{selectedDeal.title}</h2>
                  <p className="text-white/70 text-sm">{selectedDeal.partnerName}</p>
                </div>
                <div className="absolute top-4 left-4 bg-emerald-500 text-white font-bold text-lg px-4 py-1.5 rounded-xl shadow-lg">
                  {selectedDeal.discount}
                </div>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed">{selectedDeal.description}</p>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-gray-800 rounded-xl p-3 flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-white text-xs font-medium">{selectedDeal.address}</p>
                      <p className="text-gray-500 text-[10px]">{selectedDeal.distance}</p>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-3 flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="text-white text-xs font-medium">{selectedDeal.validHours}</p>
                      <p className="text-gray-500 text-[10px]">Время работы</p>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-3 flex items-center gap-2.5">
                    <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <div>
                      <p className="text-white text-xs font-medium">{selectedDeal.rating} / 5.0</p>
                      <p className="text-gray-500 text-[10px]">Рейтинг</p>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-3 flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <div>
                      <p className="text-white text-xs font-medium">{selectedDeal.usedCount} / {selectedDeal.maxUses}</p>
                      <p className="text-gray-500 text-[10px]">Использовано</p>
                    </div>
                  </div>
                </div>

                {/* Required rank */}
                {selectedDeal.minKarma > 0 && (
                  <div className={`rounded-xl p-3.5 flex items-center gap-3 ${
                    karmaState.totalKarma >= selectedDeal.minKarma
                      ? 'bg-emerald-500/10 border border-emerald-500/20'
                      : 'bg-red-500/10 border border-red-500/20'
                  }`}>
                    <span className="text-2xl">{requiredRank(selectedDeal.minKarma).emoji}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${
                        karmaState.totalKarma >= selectedDeal.minKarma ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {karmaState.totalKarma >= selectedDeal.minKarma
                          ? '✓ Ранг достаточен'
                          : `Требуется: ${requiredRank(selectedDeal.minKarma).name}`}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {karmaState.totalKarma >= selectedDeal.minKarma
                          ? `Ваша карма: ${karmaState.totalKarma}`
                          : `Нужно ещё ${selectedDeal.minKarma - karmaState.totalKarma} кармы`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Cost */}
                {selectedDeal.pointsCost > 0 && (
                  <div className={`rounded-xl p-3.5 flex items-center gap-3 ${
                    karmaState.totalPoints >= selectedDeal.pointsCost
                      ? 'bg-yellow-500/10 border border-yellow-500/20'
                      : 'bg-red-500/10 border border-red-500/20'
                  }`}>
                    <Zap className={`w-6 h-6 ${
                      karmaState.totalPoints >= selectedDeal.pointsCost ? 'text-yellow-400' : 'text-red-400'
                    }`} />
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${
                        karmaState.totalPoints >= selectedDeal.pointsCost ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        Стоимость: {selectedDeal.pointsCost} очков
                      </p>
                      <p className="text-gray-500 text-xs">
                        У вас: {karmaState.totalPoints.toLocaleString()} очков
                      </p>
                    </div>
                  </div>
                )}

                {/* Conditions */}
                <div className="bg-gray-800 rounded-xl p-4">
                  <h4 className="text-white font-bold text-sm mb-2.5">Условия</h4>
                  <div className="space-y-1.5">
                    {selectedDeal.conditions.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                        <span className="text-gray-600 mt-0.5">•</span>
                        <span>{c}</span>
                      </div>
                    ))}
                    <div className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="text-gray-600 mt-0.5">•</span>
                      <span>Действует до {new Date(selectedDeal.expiresAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {selectedDeal.tags.map(tag => (
                    <span key={tag} className="bg-gray-800 text-gray-400 text-[10px] px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action button */}
              <div className="p-4 flex-shrink-0 border-t border-gray-800">
                {(() => {
                  const { can, reason } = canActivate(selectedDeal);
                  if (can) {
                    return (
                      <button
                        onClick={() => {
                          handleActivate(selectedDeal);
                          setSelectedDeal(null);
                          setTab('wallet');
                        }}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-base active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                      >
                        <Ticket className="w-5 h-5" />
                        Активировать{selectedDeal.pointsCost > 0 ? ` за ${selectedDeal.pointsCost}⚡` : ''}
                      </button>
                    );
                  }
                  return (
                    <div className="w-full py-3.5 rounded-2xl bg-gray-800 text-gray-500 font-bold text-base text-center flex items-center justify-center gap-2">
                      <Shield className="w-5 h-5" />
                      {reason}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
          >
            <div className="bg-emerald-500 rounded-3xl p-8 shadow-2xl shadow-emerald-500/30 text-center">
              <div className="text-6xl mb-3">🎉</div>
              <p className="text-white font-bold text-xl">Купон активирован!</p>
              <p className="text-white/80 text-sm mt-1">Проверьте кошелёк</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
