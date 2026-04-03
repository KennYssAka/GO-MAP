import { useState } from 'react';
import { ArrowLeft, Check, X, Zap, Eye, Palette, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useKarma } from './KarmaContext';

interface SubscriptionScreenProps {
  onBack: () => void;
}

const GO_PLUS_FEATURES = [
  {
    icon: Eye,
    title: 'Ghost Mode',
    desc: 'Читай сообщения без отметки "Прочитано". Скрой историю чекинов.',
    highlight: true,
  },
  {
    icon: Zap,
    title: 'Karma Boost ×2',
    desc: 'Двойные очки за чекины, квесты и встречи. Быстрее в топ города.',
    highlight: true,
  },
  {
    icon: Palette,
    title: 'Premium Визуал',
    desc: 'Неоновые пины, 3D-модели на карте, анимированные рамки профиля.',
    highlight: false,
  },
  {
    icon: Star,
    title: 'Эксклюзивные темы',
    desc: 'Dark Cyberpunk, GTA-style, Barbie, Retro 8-bit — только для Go+.',
    highlight: false,
  },
];

export function SubscriptionScreen({ onBack }: SubscriptionScreenProps) {
  const { rank, state: karmaState } = useKarma();
  const [yearly, setYearly] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubscribed] = useState(false);

  const monthlyPrice = 1990;
  const yearlyPriceTotal = monthlyPrice * 10; // 2 months free
  const displayPrice = yearly ? Math.round(yearlyPriceTotal / 12) : monthlyPrice;

  return (
    <div className="flex-1 bg-[#0a0a0f] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center"
        >
          <ArrowLeft className="w-[18px] h-[18px] text-gray-400" />
        </button>
        <div className="flex-1">
          <h1 className="text-[17px] font-semibold text-white">Go+</h1>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <span>{rank.emoji}</span>
          <span className="font-medium tabular-nums">{karmaState.totalKarma}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-32">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden mb-6 mt-2">
          <div className="bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-800 p-6 pt-8 pb-7">
            {/* Neon glow effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(167,139,250,0.3),transparent_60%)]" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-yellow-300" />
                </div>
                <span className="text-white/60 text-[13px] font-medium uppercase tracking-wider">Go+</span>
              </div>
              <h2 className="text-white text-2xl font-bold mb-1">Следующий уровень</h2>
              <p className="text-white/60 text-[13px] leading-relaxed">
                Приватность, статус и ускорение кармы — всё в одной подписке.
              </p>

              {/* Price */}
              <div className="mt-5 flex items-end gap-2">
                <span className="text-white text-4xl font-bold tabular-nums">{displayPrice.toLocaleString('ru-RU')}</span>
                <div className="pb-1">
                  <span className="text-white/70 text-base">₸</span>
                  <span className="text-white/50 text-[12px] block">/месяц</span>
                </div>
                {yearly && (
                  <div className="ml-1 pb-1">
                    <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">−17%</span>
                  </div>
                )}
              </div>
              <p className="text-white/40 text-[11px] mt-1">≈ одна чашка кофе в месяц</p>
            </div>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="flex bg-white/[0.05] rounded-2xl p-1 gap-1 mb-6">
          <button
            onClick={() => setYearly(false)}
            className={`flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
              !yearly ? 'bg-white/[0.1] text-white' : 'text-gray-500'
            }`}
          >
            Помесячно
            <span className="block text-[10px] mt-0.5 opacity-60">{monthlyPrice.toLocaleString('ru-RU')} ₸</span>
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
              yearly ? 'bg-white/[0.1] text-white' : 'text-gray-500'
            }`}
          >
            Год (×2 мес в подарок)
            <span className="block text-[10px] mt-0.5 text-emerald-400">{yearlyPriceTotal.toLocaleString('ru-RU')} ₸/год</span>
          </button>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider px-1">Что входит</p>
          {GO_PLUS_FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-4 flex items-start gap-4 ${
                  f.highlight
                    ? 'bg-violet-500/10 border border-violet-500/20'
                    : 'bg-white/[0.03] border border-white/[0.05]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  f.highlight ? 'bg-violet-500/20' : 'bg-white/[0.06]'
                }`}>
                  <Icon className={`w-5 h-5 ${f.highlight ? 'text-violet-300' : 'text-gray-400'}`} />
                </div>
                <div>
                  <p className={`text-[14px] font-semibold mb-0.5 ${f.highlight ? 'text-white' : 'text-gray-300'}`}>
                    {f.title}
                  </p>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Free tier comparison */}
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.05] p-4 mb-4">
          <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider mb-3">Бесплатный план</p>
          {['Карта и чекины', 'Базовая карма', 'Профиль и посты', '3 O2O купона в месяц'].map((item) => (
            <div key={item} className="flex items-center gap-3 py-1.5">
              <Check className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="text-[13px] text-gray-500">{item}</span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-gray-600 text-center leading-relaxed px-2">
          Отмена в любое время · Возврат в течение 7 дней
        </p>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-8 pt-4 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/95 to-transparent">
        <button
          onClick={() => !isSubscribed && setShowCheckout(true)}
          disabled={isSubscribed}
          className={`w-full py-4 rounded-2xl text-[15px] font-bold transition-all active:scale-[0.98] ${
            isSubscribed
              ? 'bg-white/[0.04] text-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25'
          }`}
        >
          {isSubscribed ? 'Подписка активна' : `Подключить Go+ · ${displayPrice.toLocaleString('ru-RU')} ₸/мес`}
        </button>
      </div>

      {/* Checkout sheet */}
      <AnimatePresence>
        {showCheckout && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
              className="fixed inset-0 bg-black/70 z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 bg-[#161618] rounded-t-3xl z-50 max-w-md mx-auto"
            >
              <div className="p-5">
                <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-5" />
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[16px] font-semibold text-white">Подключить Go+</h3>
                  <button onClick={() => setShowCheckout(false)} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-4 mb-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">Go+</p>
                      <p className="text-violet-300/70 text-[12px]">{yearly ? 'Годовая подписка' : 'Помесячная подписка'}</p>
                    </div>
                    <p className="text-white text-[18px] font-bold tabular-nums">
                      {(yearly ? yearlyPriceTotal : monthlyPrice).toLocaleString('ru-RU')} ₸
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => { alert('Оплата будет интегрирована позже'); setShowCheckout(false); }}
                    className="w-full py-3.5 rounded-2xl text-[14px] font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 active:scale-[0.98] transition-transform"
                  >
                    Оплатить
                  </button>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="w-full py-3 rounded-2xl text-[13px] font-medium text-gray-500 bg-white/[0.04]"
                  >
                    Отмена
                  </button>
                </div>
              </div>
              <div className="h-6" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}