import { useState } from 'react';
import { ChevronDown, ChevronRight, Check, ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { CITIES, type CityId } from '@/app/components/CityContext';
import { useUser } from '@/app/components/UserContext';

interface OnboardingProps {
  onComplete: (interests: string[], goals: string[]) => void;
}

interface InterestCategory {
  id: string;
  label: string;
  emoji: string;
  items: { id: string; label: string; emoji: string }[];
}

interface GoalCategory {
  id: string;
  label: string;
  emoji: string;
  description: string;
  subgoals: { id: string; label: string; emoji: string }[];
}

const interestCategories: InterestCategory[] = [
  {
    id: 'music', label: 'Музыка', emoji: '🎵',
    items: [
      { id: 'music_techno', label: 'Техно / Электроника', emoji: '🎧' },
      { id: 'music_hiphop', label: 'Хип-хоп / Рэп', emoji: '🎤' },
      { id: 'music_rock', label: 'Рок / Инди', emoji: '🎸' },
      { id: 'music_jazz', label: 'Джаз / Блюз', emoji: '🎷' },
      { id: 'music_classical', label: 'Классическая музыка', emoji: '🎻' },
      { id: 'music_pop', label: 'Поп / K-pop', emoji: '🎶' },
      { id: 'music_live', label: 'Живые концерты', emoji: '🎪' },
    ],
  },
  {
    id: 'nightlife', label: 'Ночная жизнь', emoji: '🌃',
    items: [
      { id: 'night_clubs', label: 'Клубы / Вечеринки', emoji: '🪩' },
      { id: 'night_bars', label: 'Бары / Пабы', emoji: '🍻' },
      { id: 'night_karaoke', label: 'Караоке', emoji: '🎤' },
      { id: 'night_rooftop', label: 'Руфтопы / Лаунжи', emoji: '🏙️' },
    ],
  },
  {
    id: 'food', label: 'Еда и напитки', emoji: '🍽️',
    items: [
      { id: 'food_restaurants', label: 'Рестораны', emoji: '🍷' },
      { id: 'food_cafes', label: 'Кофейни / Кафе', emoji: '☕' },
      { id: 'food_street', label: 'Стрит-фуд', emoji: '🌯' },
      { id: 'food_brunch', label: 'Бранчи / Завтраки', emoji: '🥐' },
      { id: 'food_vegan', label: 'Вегетарианское / ЗОЖ', emoji: '🥗' },
    ],
  },
  {
    id: 'sport', label: 'Спорт и активности', emoji: '💪',
    items: [
      { id: 'sport_gym', label: 'Тренажёрный зал / CrossFit', emoji: '🏋️' },
      { id: 'sport_running', label: 'Бег / Марафоны', emoji: '🏃' },
      { id: 'sport_yoga', label: 'Йога / Медитация', emoji: '🧘' },
      { id: 'sport_climbing', label: 'Скалолазание / Походы', emoji: '🧗' },
      { id: 'sport_cycling', label: 'Велоспорт', emoji: '🚴' },
    ],
  },
  {
    id: 'culture', label: 'Искусство и культура', emoji: '🎨',
    items: [
      { id: 'culture_exhibitions', label: 'Выставки / Галереи', emoji: '🖼️' },
      { id: 'culture_theater', label: 'Театр / Балет', emoji: '🎭' },
      { id: 'culture_cinema', label: 'Кино', emoji: '🎬' },
      { id: 'culture_photo', label: 'Фотография', emoji: '📸' },
      { id: 'culture_streetart', label: 'Стрит-арт / Граффити', emoji: '🖌️' },
      { id: 'culture_literature', label: 'Литература / Поэзия', emoji: '📚' },
    ],
  },
  {
    id: 'tech', label: 'IT и технологии', emoji: '💻',
    items: [
      { id: 'tech_dev', label: 'Разработка / Код', emoji: '⌨️' },
      { id: 'tech_ai', label: 'AI / Machine Learning', emoji: '🤖' },
      { id: 'tech_startups', label: 'Стартапы / Продукт', emoji: '🚀' },
      { id: 'tech_design', label: 'UX/UI / Дизайн', emoji: '✏️' },
      { id: 'tech_crypto', label: 'Крипто / Web3', emoji: '🪙' },
    ],
  },
  {
    id: 'social', label: 'Общение и люди', emoji: '🤝',
    items: [
      { id: 'social_networking', label: 'Нетворкинг', emoji: '🌐' },
      { id: 'social_languages', label: 'Языковые клубы', emoji: '🗣️' },
      { id: 'social_boardgames', label: 'Настольные игры', emoji: '🎲' },
      { id: 'social_volunteering', label: 'Волонтёрство', emoji: '❤️' },
    ],
  },
];

const goalCategories: GoalCategory[] = [
  {
    id: 'social', label: 'Социальные цели', emoji: '🤝', description: 'Как ты хочешь взаимодействовать с людьми',
    subgoals: [
      { id: 'goal_friends', label: 'Найти новых друзей', emoji: '👫' },
      { id: 'goal_network', label: 'Профессиональный нетворкинг', emoji: '💼' },
      { id: 'goal_date', label: 'Романтические знакомства', emoji: '❤️' },
      { id: 'goal_collab', label: 'Найти коллаборации', emoji: '🤜🤛' },
    ],
  },
  {
    id: 'explore', label: 'Исследование города', emoji: '🗺️', description: 'Что ты хочешь открыть для себя',
    subgoals: [
      { id: 'goal_places', label: 'Открыть новые места', emoji: '📍' },
      { id: 'goal_events', label: 'Ходить на события', emoji: '🎟️' },
      { id: 'goal_food', label: 'Гастрономические открытия', emoji: '🍜' },
      { id: 'goal_culture', label: 'Культурные мероприятия', emoji: '🏛️' },
    ],
  },
  {
    id: 'growth', label: 'Личный рост', emoji: '🌱', description: 'Как ты хочешь развиваться',
    subgoals: [
      { id: 'goal_skills', label: 'Новые навыки и хобби', emoji: '🎯' },
      { id: 'goal_health', label: 'Здоровье и спорт', emoji: '💪' },
      { id: 'goal_creativity', label: 'Творческое самовыражение', emoji: '🎨' },
    ],
  },
];

type Step = 'city' | 'interests' | 'goals';

export function Onboarding({ onComplete }: OnboardingProps) {
  const { setUserCity } = useUser();

  const [step, setStep] = useState<Step>('city');
  const [selectedCityId, setSelectedCityId] = useState<CityId | null>(null);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [expandedInterest, setExpandedInterest] = useState<string | null>(null);

  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  /* ── City ── */
  const handleCitySelect = (id: CityId) => {
    setSelectedCityId(id);
  };

  const handleCityConfirm = () => {
    if (!selectedCityId) return;
    const city = CITIES[selectedCityId];
    setUserCity(city.name);
    setStep('interests');
  };

  /* ── Interests ── */
  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleInterestCategory = (catId: string) => {
    setExpandedInterest(prev => (prev === catId ? null : catId));
  };

  const getCategorySelectedCount = (cat: InterestCategory) =>
    cat.items.filter(i => selectedInterests.includes(i.id)).length;

  /* ── Goals ── */
  const toggleGoal = (id: string) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const toggleGoalCategory = (catId: string) => {
    setExpandedGoal(prev => (prev === catId ? null : catId));
  };

  const getGoalCategorySelectedCount = (cat: GoalCategory) =>
    cat.subgoals.filter(s => selectedGoals.includes(s.id)).length;

  /* ── Navigation ── */
  const handleBack = () => {
    if (step === 'interests') setStep('city');
    else if (step === 'goals') setStep('interests');
  };

  const handleNext = () => {
    if (step === 'interests') {
      setStep('goals');
    } else if (step === 'goals') {
      onComplete(selectedInterests, selectedGoals);
    }
  };

  const stepIndex = step === 'city' ? 0 : step === 'interests' ? 1 : 2;

  const stepTitle: Record<Step, string> = {
    city: 'Выбери свой город',
    interests: 'Твои интересы',
    goals: 'Твои цели',
  };

  const stepSubtitle: Record<Step, string> = {
    city: 'Это обязательный шаг — мы подберём места и людей рядом',
    interests: 'Выбери хотя бы один интерес',
    goals: 'Что ты ищешь в этом городе?',
  };

  return (
    <div className="h-screen w-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-5 pt-14 pb-4">
        <div className="flex items-center gap-3 mb-5">
          {step !== 'city' && (
            <button onClick={handleBack} className="w-8 h-8 rounded-full bg-white/[0.07] flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
          )}
          <div className="flex gap-2 flex-1">
            {(['city', 'interests', 'goals'] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  i <= stepIndex ? 'bg-violet-500' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
        <h1 className="text-white font-black text-2xl mb-1">{stepTitle[step]}</h1>
        <p className="text-gray-400 text-sm">{stepSubtitle[step]}</p>
      </div>

      {/* Scrollable step content */}
      <div className="flex-1 overflow-y-auto px-5 relative z-10">
        <AnimatePresence mode="wait">

          {/* STEP 0: City */}
          {step === 'city' && (
            <motion.div
              key="city"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-3 pb-4"
            >
              {(Object.keys(CITIES) as CityId[]).map((id) => {
                const city = CITIES[id];
                const isSelected = selectedCityId === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleCitySelect(id)}
                    className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all text-left ${
                      isSelected
                        ? 'bg-violet-500/20 border-violet-500'
                        : 'bg-white/[0.04] border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <span className="text-4xl">{city.emoji}</span>
                    <div className="flex-1">
                      <p className={`font-bold text-lg ${isSelected ? 'text-violet-200' : 'text-white'}`}>
                        {city.name}
                      </p>
                      <p className="text-gray-500 text-sm">{city.nameEn}</p>
                    </div>
                    {isSelected && (
                      <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {!isSelected && (
                      <MapPin className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                );
              })}
              <p className="text-gray-600 text-xs text-center pt-2">
                Можно изменить позже в настройках
              </p>
            </motion.div>
          )}

          {/* STEP 1: Interests */}
          {step === 'interests' && (
            <motion.div
              key="interests"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-3 pb-4"
            >
              {interestCategories.map((cat) => {
                const isExpanded = expandedInterest === cat.id;
                const selectedCount = getCategorySelectedCount(cat);
                return (
                  <div key={cat.id} className="rounded-2xl overflow-hidden">
                    <button
                      onClick={() => toggleInterestCategory(cat.id)}
                      className={`w-full p-4 flex items-center gap-3 transition-all ${
                        isExpanded
                          ? 'bg-violet-600/20 border border-violet-500/40'
                          : selectedCount > 0
                            ? 'bg-violet-900/30 border border-violet-500/20'
                            : 'bg-white/[0.04] border border-white/[0.08]'
                      } rounded-2xl ${isExpanded ? 'rounded-b-none' : ''}`}
                    >
                      <span className="text-2xl">{cat.emoji}</span>
                      <span className="flex-1 text-left text-white font-semibold text-base">{cat.label}</span>
                      {selectedCount > 0 && (
                        <span className="bg-violet-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                          {selectedCount}
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-violet-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-gray-800/50 border border-t-0 border-violet-500/20 rounded-b-2xl p-3 space-y-2">
                            {cat.items.map((item) => {
                              const isSelected = selectedInterests.includes(item.id);
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => toggleInterest(item.id)}
                                  className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                                    isSelected
                                      ? 'bg-violet-500/30 border border-violet-400/50'
                                      : 'bg-white/[0.04] border border-transparent'
                                  }`}
                                >
                                  <span className="text-lg">{item.emoji}</span>
                                  <span className={`flex-1 text-left text-sm font-medium ${
                                    isSelected ? 'text-violet-200' : 'text-gray-300'
                                  }`}>
                                    {item.label}
                                  </span>
                                  {isSelected && (
                                    <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                                      <Check className="w-3 h-3 text-white" />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* STEP 2: Goals */}
          {step === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-3 pb-4"
            >
              {goalCategories.map((cat) => {
                const isExpanded = expandedGoal === cat.id;
                const selectedCount = getGoalCategorySelectedCount(cat);
                return (
                  <div key={cat.id} className="rounded-2xl overflow-hidden">
                    <button
                      onClick={() => toggleGoalCategory(cat.id)}
                      className={`w-full p-4 flex items-start gap-3 transition-all ${
                        isExpanded
                          ? 'bg-pink-600/20 border border-pink-500/40'
                          : selectedCount > 0
                            ? 'bg-pink-900/30 border border-pink-500/20'
                            : 'bg-white/[0.04] border border-white/[0.08]'
                      } rounded-2xl ${isExpanded ? 'rounded-b-none' : ''}`}
                    >
                      <span className="text-3xl mt-0.5">{cat.emoji}</span>
                      <div className="flex-1 text-left">
                        <span className="text-white font-semibold text-base block">{cat.label}</span>
                        <span className="text-gray-400 text-xs mt-0.5 block">{cat.description}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {selectedCount > 0 && (
                          <span className="bg-pink-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                            {selectedCount}
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-pink-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-gray-800/50 border border-t-0 border-pink-500/20 rounded-b-2xl p-3 space-y-2">
                            {cat.subgoals.map((sg) => {
                              const isSelected = selectedGoals.includes(sg.id);
                              return (
                                <button
                                  key={sg.id}
                                  onClick={() => toggleGoal(sg.id)}
                                  className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                                    isSelected
                                      ? 'bg-pink-500/30 border border-pink-400/50'
                                      : 'bg-white/[0.04] border border-transparent'
                                  }`}
                                >
                                  <span className="text-lg">{sg.emoji}</span>
                                  <span className={`flex-1 text-left text-sm font-medium ${
                                    isSelected ? 'text-pink-200' : 'text-gray-300'
                                  }`}>
                                    {sg.label}
                                  </span>
                                  {isSelected && (
                                    <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center">
                                      <Check className="w-3 h-3 text-white" />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 p-5 pb-8 bg-gradient-to-t from-gray-950 via-gray-950/95 to-transparent">
        {step === 'city' ? (
          <Button
            onClick={handleCityConfirm}
            disabled={!selectedCityId}
            className="w-full py-6 text-base font-bold bg-gradient-to-r from-violet-600 to-cyan-600 text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          >
            Выбрать {selectedCityId ? CITIES[selectedCityId].name : 'город'}
          </Button>
        ) : (
          <>
            <Button
              onClick={handleNext}
              disabled={step === 'interests' && selectedInterests.length === 0}
              className="w-full py-6 text-base font-bold bg-gradient-to-r from-violet-600 to-pink-600 text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl"
            >
              {step === 'interests' ? 'Далее' : 'Начать'}
            </Button>
            {step === 'interests' && (
              <button
                onClick={() => setStep('goals')}
                className="w-full mt-3 text-center text-gray-500 text-sm"
              >
                Пропустить
              </button>
            )}
            {step === 'goals' && (
              <button
                onClick={() => onComplete(selectedInterests, selectedGoals)}
                className="w-full mt-3 text-center text-gray-500 text-sm"
              >
                Пропустить
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
