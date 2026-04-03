import { useState, useMemo, useCallback } from 'react';
import {
  Calendar, Users, Lock, MapPin, Clock, Zap,
  X, SlidersHorizontal, Plus, ChevronDown, ArrowLeft, Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { useWeather } from './WeatherContext';
import { useCity, CITIES, type CityId } from './CityContext';
import { getEventsByCity, saveCustomEvent, typeConfig, tagsByType, type EventItem, type EventType } from './eventsData';

/* ── Join state per event ── */
type JoinState = 'idle' | 'joining' | 'joined' | 'error';

export function EventsScreen() {
  const { theme, weather } = useWeather();
  const { city, cityId, setCity } = useCity();
  const [filter, setFilter] = useState<EventType>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Join state: map from eventId → JoinState + local attending count delta
  const [joinStates, setJoinStates] = useState<Record<string, JoinState>>({});
  const [attendingDeltas, setAttendingDeltas] = useState<Record<string, number>>({});

  const events = useMemo(() => getEventsByCity(cityId), [cityId, refreshKey]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearTags = () => setSelectedTags([]);

  const availableTags = useMemo(() => {
    if (filter === 'all') {
      const all = new Set<string>();
      events.forEach(e => e.tags.forEach(t => all.add(t)));
      return Array.from(all).sort();
    }
    return tagsByType[filter]?.map(t => t.label) ?? [];
  }, [filter, events]);

  const filteredEvents = useMemo(() => {
    let result = events;
    if (filter !== 'all') result = result.filter(e => e.type === filter);
    if (selectedTags.length > 0) {
      result = result.filter(e => selectedTags.some(tag => e.tags.includes(tag)));
    }
    return result;
  }, [filter, selectedTags, events]);

  const headerGradient = weather
    ? `bg-gradient-to-br ${theme.headerGradient}`
    : 'bg-gradient-to-br from-violet-900 via-purple-800 to-pink-800';

  const handleEventCreated = useCallback(() => {
    setRefreshKey(k => k + 1);
    setShowCreateForm(false);
  }, []);

  /* ── Optimistic join with rollback ── */
  const handleJoin = async (eventId: string, isLocked: boolean) => {
    if (isLocked) return;
    if (joinStates[eventId] === 'joining' || joinStates[eventId] === 'joined') return;

    // Optimistic update
    setJoinStates(prev => ({ ...prev, [eventId]: 'joining' }));
    setAttendingDeltas(prev => ({ ...prev, [eventId]: (prev[eventId] ?? 0) + 1 }));

    // Simulate API call (replace with real fetch)
    try {
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // 90% success rate in prod; mock always succeeds
          resolve();
        }, 600);
      });
      setJoinStates(prev => ({ ...prev, [eventId]: 'joined' }));
    } catch {
      // Rollback on failure
      setJoinStates(prev => ({ ...prev, [eventId]: 'error' }));
      setAttendingDeltas(prev => ({ ...prev, [eventId]: (prev[eventId] ?? 1) - 1 }));
      setTimeout(() => {
        setJoinStates(prev => ({ ...prev, [eventId]: 'idle' }));
      }, 2000);
    }
  };

  if (showCreateForm) {
    return (
      <CreateEventForm
        cityId={cityId}
        onBack={() => setShowCreateForm(false)}
        onCreated={handleEventCreated}
        theme={theme}
      />
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-900 to-black overflow-y-auto pb-20">
      {/* Header */}
      <div className={`${headerGradient} p-6 pb-5`}>
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-3xl font-bold text-white">События</h1>
          <div className="flex items-center gap-2">
            {/* City selector */}
            <div className="relative">
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 hover:bg-white/25 transition-colors"
              >
                <span className="text-base">{city.emoji}</span>
                <span className="text-white text-sm font-semibold">{city.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-white/70 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showCityDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden w-48 z-50"
                  >
                    {(Object.keys(CITIES) as CityId[]).map((id) => {
                      const c = CITIES[id];
                      const isActive = cityId === id;
                      return (
                        <button
                          key={id}
                          onClick={() => { setCity(id); setShowCityDropdown(false); setFilter('all'); setSelectedTags([]); }}
                          className={`w-full px-4 py-3 flex items-center gap-2.5 transition-colors ${isActive ? 'bg-violet-600/20' : 'hover:bg-gray-800/80'}`}
                        >
                          <span className="text-xl">{c.emoji}</span>
                          <div className="flex-1 text-left">
                            <p className={`font-semibold text-sm ${isActive ? 'text-violet-300' : 'text-white'}`}>{c.name}</p>
                            <p className="text-gray-500 text-[11px]">{getEventsByCity(id).length} событий</p>
                          </div>
                          {isActive && <div className="w-2 h-2 rounded-full bg-violet-400" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {weather && (
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                <span className="text-lg">{weather.emoji}</span>
                <span className="text-white text-sm font-medium">{weather.temperature}°</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-white/70 mb-5 text-sm">Найди свою тусовку в {city.name}</p>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {Object.entries(typeConfig).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => { setFilter(key as EventType); setSelectedTags([]); }}
              className={`px-4 py-2 rounded-full font-semibold transition-all whitespace-nowrap text-sm flex items-center gap-1.5 ${
                filter === key
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <span>{cfg.emoji}</span>
              <span>{cfg.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tag filters */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowTagFilter(!showTagFilter)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              showTagFilter || selectedTags.length > 0
                ? `${theme.accentLight} ${theme.textAccent} border ${theme.cardBorder}`
                : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Теги</span>
            {selectedTags.length > 0 && (
              <span className={`${theme.accent} text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center`}>
                {selectedTags.length}
              </span>
            )}
          </button>
          {selectedTags.length > 0 && (
            <button onClick={clearTags} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors">
              <X className="w-3.5 h-3.5" />
              Сбросить
            </button>
          )}
        </div>

        <AnimatePresence>
          {showTagFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-800/50 rounded-2xl border border-gray-700/50">
                {availableTags.map(tag => {
                  const isActive = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isActive
                          ? `${theme.accent} text-white shadow-md`
                          : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/60'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-xs">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'событие' : filteredEvents.length < 5 ? 'события' : 'событий'}
          </span>
        </div>
      </div>

      {/* Events list */}
      <div className="px-5 pb-6 space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-gray-400 font-medium">Нет событий с такими фильтрами</p>
            <button onClick={clearTags} className={`mt-3 ${theme.textAccent} text-sm font-medium`}>
              Сбросить фильтры
            </button>
          </div>
        ) : (
          filteredEvents.map((event, i) => {
            const joinState = joinStates[event.id] ?? 'idle';
            const delta = attendingDeltas[event.id] ?? 0;
            const displayAttending = event.attending + delta;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-gray-800/80 rounded-2xl overflow-hidden border border-gray-700/30"
              >
                {/* Event header */}
                <div className={`bg-gradient-to-r ${event.color} p-4 relative`}>
                  {event.hot && (
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-white" />
                      <span className="text-white font-bold text-xs">HOT</span>
                    </div>
                  )}
                  {event.isCustom && (
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-xs font-bold">✨ Моё</span>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{event.vibe}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-lg mb-1 truncate">{event.title}</h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-white/90 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event body */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-gray-300 text-sm truncate">{event.location}</span>
                    {event.price && (
                      <span className={`ml-auto text-sm font-semibold whitespace-nowrap ${
                        event.price === 'Бесплатно' ? 'text-green-400' : theme.textAccent
                      }`}>
                        {event.price}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {event.tags.map((tag, j) => (
                      <button
                        key={j}
                        onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                          selectedTags.includes(tag)
                            ? `${theme.accent} text-white`
                            : 'bg-gray-700/70 text-gray-300 hover:bg-gray-600/70'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>

                  {/* Attendees */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-white font-semibold text-sm">{displayAttending}</span>
                      <span className="text-gray-500 text-sm">/ {event.capacity}</span>
                      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${event.color} transition-all duration-500`}
                          style={{ width: `${Math.min((displayAttending / event.capacity) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(n => (
                        <Avatar key={n} className="w-7 h-7 border-2 border-gray-800">
                          <AvatarFallback className={`bg-gradient-to-br ${event.color} text-white text-xs`}>
                            {String.fromCharCode(64 + n)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {displayAttending > 3 && (
                        <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center">
                          <span className="text-gray-400 text-[10px] font-bold">+{displayAttending - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Join button — optimistic UI */}
                  <button
                    onClick={() => handleJoin(event.id, !!event.locked)}
                    disabled={!!event.locked || joinState === 'joining'}
                    className={`w-full py-3 rounded-xl font-semibold transition-all text-sm relative overflow-hidden ${
                      event.locked
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : joinState === 'joined'
                          ? 'bg-green-600/80 text-white border border-green-500/50'
                          : joinState === 'error'
                            ? 'bg-red-600/60 text-white'
                            : `bg-gradient-to-r ${event.color} text-white active:scale-[0.98]`
                    }`}
                  >
                    {event.locked ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        Требуется приглашение
                      </span>
                    ) : joinState === 'joining' ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <motion.div
                          className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                        Записываюсь...
                      </span>
                    ) : joinState === 'joined' ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4" />
                        Иду!
                      </span>
                    ) : joinState === 'error' ? (
                      'Ошибка — попробуй снова'
                    ) : (
                      'Пойду!'
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Create event FAB */}
      <motion.button
        onClick={() => setShowCreateForm(true)}
        className="fixed right-6 bottom-24 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 shadow-2xl shadow-violet-500/40 flex items-center justify-center z-20"
        whileTap={{ scale: 0.9 }}
      >
        <Plus className="w-7 h-7 text-white" />
      </motion.button>
    </div>
  );
}

/* ── Create Event Form ── */

interface CreateEventFormProps {
  cityId: CityId;
  onBack: () => void;
  onCreated: () => void;
  theme: any;
}

function CreateEventForm({ cityId, onBack, onCreated, theme }: CreateEventFormProps) {
  const { city } = useCity();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('party');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('Сегодня');
  const [time, setTime] = useState('19:00');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('50');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const typeOptions = Object.entries(typeConfig).filter(([k]) => k !== 'all');
  const currentTags = tagsByType[type] || [];
  const currentTypeInfo = typeConfig[type as string] || typeConfig.party;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : prev.length < 5 ? [...prev, tag] : prev
    );
  };

  const canSubmit = title.trim() && location.trim() && time;

  const getCoords = (): [number, number] => {
    const center = CITIES[cityId].center;
    const offset = () => (Math.random() - 0.5) * 0.04;
    return [center[0] + offset(), center[1] + offset()];
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    const [lat, lng] = getCoords();
    const newEvent: EventItem = {
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title: title.trim(),
      type: type === 'all' ? 'party' : type,
      date,
      time,
      location: location.trim(),
      lat,
      lng,
      attending: 1,
      capacity: parseInt(capacity, 10) || 50,
      tags: selectedTags,
      vibe: currentTypeInfo.emoji,
      color: currentTypeInfo.color || 'from-violet-500 to-purple-600',
      hot: false,
      locked: false,
      price: price.trim() || 'Бесплатно',
      isCustom: true,
      city: cityId,
    };
    await new Promise(r => setTimeout(r, 400));
    saveCustomEvent(newEvent);
    setSaving(false);
    onCreated();
  };

  return (
    <div className="flex-1 bg-gray-900 overflow-y-auto pb-20">
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 bg-gray-900 sticky top-0 z-10 border-b border-gray-800">
        <button onClick={onBack} className="w-8 h-8 rounded-full bg-white/[0.07] flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <h1 className="text-white font-bold text-lg">Создать событие</h1>
        <div className="ml-auto text-gray-500 text-sm">{city.name}</div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Title */}
        <div>
          <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Название *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Название события"
            className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white text-[14px] placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors"
          />
        </div>

        {/* Type */}
        <div>
          <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Тип</label>
          <div className="grid grid-cols-3 gap-2">
            {typeOptions.slice(0, 6).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => { setType(key as EventType); setSelectedTags([]); }}
                className={`p-3 rounded-xl border text-center transition-all ${
                  type === key
                    ? 'bg-violet-500/20 border-violet-500/50'
                    : 'bg-gray-800/60 border-gray-700 hover:border-gray-600'
                }`}
              >
                <span className="text-2xl block mb-1">{cfg.emoji}</span>
                <span className={`text-xs font-medium ${type === key ? 'text-violet-300' : 'text-gray-400'}`}>{cfg.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Место *</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Адрес или название"
            className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white text-[14px] placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Дата</label>
            <input
              type="text"
              value={date}
              onChange={e => setDate(e.target.value)}
              placeholder="Сегодня"
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white text-[14px] placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Время *</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white text-[14px] outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Price & Capacity */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Цена</label>
            <input
              type="text"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Бесплатно"
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white text-[14px] placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Мест</label>
            <input
              type="number"
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
              min="1"
              max="10000"
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white text-[14px] outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Tags */}
        {currentTags.length > 0 && (
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
              Теги (до 5)
            </label>
            <div className="flex flex-wrap gap-2">
              {currentTags.map(t => {
                const isActive = selectedTags.includes(t.label);
                return (
                  <button
                    key={t.label}
                    onClick={() => toggleTag(t.label)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                      isActive
                        ? `${theme.accent} text-white`
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <span>{t.emoji}</span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || saving}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold text-[15px] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
        >
          {saving ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
              Создаётся...
            </>
          ) : (
            'Создать событие'
          )}
        </button>
      </div>
    </div>
  );
}
