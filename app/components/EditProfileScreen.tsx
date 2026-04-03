import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Camera, Check, X, User, Mail, Phone, MapPin,
  Instagram, Send, Twitter, Globe, Sparkles, Palette
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useUser, UserProfile } from './UserContext';

interface EditProfileScreenProps {
  onClose: () => void;
}

const avatarGradients = [
  { id: 'yellow-orange', gradient: 'from-yellow-400 to-orange-500', label: 'Закат' },
  { id: 'purple-pink', gradient: 'from-purple-400 to-pink-500', label: 'Пурпур' },
  { id: 'blue-cyan', gradient: 'from-blue-400 to-cyan-500', label: 'Океан' },
  { id: 'green-emerald', gradient: 'from-green-400 to-emerald-500', label: 'Природа' },
  { id: 'red-rose', gradient: 'from-red-400 to-rose-500', label: 'Пламя' },
  { id: 'indigo-violet', gradient: 'from-indigo-400 to-violet-500', label: 'Космос' },
  { id: 'amber-yellow', gradient: 'from-amber-400 to-yellow-500', label: 'Золото' },
  { id: 'teal-green', gradient: 'from-teal-400 to-green-500', label: 'Мята' },
];

const interestOptions = [
  { id: 'music', label: 'Музыка', emoji: '🎶' },
  { id: 'business', label: 'Бизнес', emoji: '💼' },
  { id: 'party', label: 'Тусовки', emoji: '🎉' },
  { id: 'sport', label: 'Спорт', emoji: '💪' },
  { id: 'chill', label: 'Спокойный отдых', emoji: '☕' },
  { id: 'art', label: 'Искусство', emoji: '🎨' },
  { id: 'food', label: 'Еда', emoji: '🍕' },
  { id: 'tech', label: 'Технологии', emoji: '💻' },
  { id: 'travel', label: 'Путешествия', emoji: '✈️' },
  { id: 'gaming', label: 'Игры', emoji: '🎮' },
];

const goalOptions = [
  { id: 'dating', label: 'Знакомства', emoji: '❤️' },
  { id: 'networking', label: 'Нетворкинг', emoji: '💼' },
  { id: 'leisure', label: 'Досуг', emoji: '🎉' },
  { id: 'learning', label: 'Обучение', emoji: '📚' },
  { id: 'health', label: 'Здоровье', emoji: '🏃' },
  { id: 'creativity', label: 'Творчество', emoji: '🎨' },
];

const cityOptions = ['Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе', 'Тараз', 'Павлодар', 'Атырау'];

type EditSection = 'main' | 'avatar' | 'interests' | 'goals' | 'social' | 'city';

export function EditProfileScreen({ onClose }: EditProfileScreenProps) {
  const { user, updateProfile } = useUser();
  if (!user) return null;

  const [section, setSection] = useState<EditSection>('main');
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [city, setCity] = useState(user.city);
  const [avatarGradient, setAvatarGradient] = useState(user.avatarGradient);
  const [interests, setInterests] = useState<string[]>(user.interests);
  const [goals, setGoals] = useState<string[]>(user.goals);
  const [instagram, setInstagram] = useState(user.socialLinks.instagram);
  const [telegram, setTelegram] = useState(user.socialLinks.telegram);
  const [twitter, setTwitter] = useState(user.socialLinks.twitter);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleInterest = (id: string) => {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleGoal = (id: string) => {
    setGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    updateProfile({
      name: name.trim() || user.name,
      username: username.trim() || user.username,
      bio: bio.trim(),
      email: email.trim() || user.email,
      phone: phone.trim(),
      city,
      avatarGradient,
      interests,
      goals,
      socialLinks: {
        instagram: instagram.trim(),
        telegram: telegram.trim(),
        twitter: twitter.trim(),
      },
    });

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const currentInitial = (name.trim() || user.name).charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-gray-950 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button
          onClick={section === 'main' ? onClose : () => setSection('main')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">{section === 'main' ? 'Отмена' : 'Назад'}</span>
        </button>

        <h2 className="text-white font-semibold">
          {section === 'main' && 'Редактировать профиль'}
          {section === 'avatar' && 'Стиль аватара'}
          {section === 'interests' && 'Интересы'}
          {section === 'goals' && 'Цели'}
          {section === 'social' && 'Соц. сети'}
          {section === 'city' && 'Город'}
        </h2>

        {section === 'main' ? (
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl text-sm disabled:opacity-50"
          >
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : saveSuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              'Сохранить'
            )}
          </Button>
        ) : (
          <button
            onClick={() => setSection('main')}
            className="text-purple-400 text-sm font-semibold"
          >
            Готово
          </button>
        )}
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-50 bg-gray-950/90 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-10 h-10 text-green-400" />
              </motion.div>
              <p className="text-white text-xl font-semibold">Профиль обновлён!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* MAIN SECTION */}
          {section === 'main' && (
            <motion.div
              key="main"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 space-y-6"
            >
              {/* Avatar Preview & Change */}
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  id="edit-avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (!file.type.startsWith('image/')) return;
                    if (file.size > 5 * 1024 * 1024) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const dataUrl = ev.target?.result as string;
                      if (dataUrl) updateProfile({ avatarUrl: dataUrl });
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                <button
                  onClick={() => setSection('avatar')}
                  className="relative group"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover shadow-xl"
                    />
                  ) : (
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-3xl font-bold shadow-xl`}>
                      {currentInitial}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </button>
                <div className="flex gap-3 mt-2">
                  <label
                    htmlFor="edit-avatar-upload"
                    className="text-purple-400 text-sm font-semibold cursor-pointer hover:text-purple-300"
                  >
                    Загрузить фото
                  </label>
                  <span className="text-gray-600">|</span>
                  <button
                    onClick={() => setSection('avatar')}
                    className="text-purple-400 text-sm font-semibold hover:text-purple-300"
                  >
                    Изменить стиль
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Имя</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ваше имя"
                    className="pl-12 py-5 rounded-2xl bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Юзернейм</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
                  <Input
                    value={username}
                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="username"
                    className="pl-10 py-5 rounded-2xl bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">О себе</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value.slice(0, 200))}
                  placeholder="Расскажите о себе..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-800/80 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                />
                <p className="text-gray-600 text-xs text-right mt-1">{bio.length}/200</p>
              </div>

              {/* Email */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="pl-12 py-5 rounded-2xl bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Телефон</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    className="pl-12 py-5 rounded-2xl bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* City */}
              <button
                onClick={() => setSection('city')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-800/80 border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div className="text-left">
                    <p className="text-gray-400 text-xs">Город</p>
                    <p className="text-white">{city}</p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-gray-500 rotate-180" />
              </button>

              {/* Interests */}
              <button
                onClick={() => setSection('interests')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-800/80 border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <div className="text-left">
                    <p className="text-gray-400 text-xs">Интересы</p>
                    <p className="text-white">
                      {interests.length > 0
                        ? interests.map(i => interestOptions.find(o => o.id === i)?.emoji).join(' ')
                        : 'Не выбрано'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 text-sm">{interests.length}</span>
                  <ArrowLeft className="w-4 h-4 text-gray-500 rotate-180" />
                </div>
              </button>

              {/* Goals */}
              <button
                onClick={() => setSection('goals')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-800/80 border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-pink-400" />
                  <div className="text-left">
                    <p className="text-gray-400 text-xs">Цели</p>
                    <p className="text-white">
                      {goals.length > 0
                        ? goals.map(g => goalOptions.find(o => o.id === g)?.emoji).join(' ')
                        : 'Не выбрано'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-400 text-sm">{goals.length}</span>
                  <ArrowLeft className="w-4 h-4 text-gray-500 rotate-180" />
                </div>
              </button>

              {/* Social Links */}
              <button
                onClick={() => setSection('social')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-800/80 border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <Instagram className="w-5 h-5 text-pink-400" />
                  <div className="text-left">
                    <p className="text-gray-400 text-xs">Социальные сети</p>
                    <p className="text-white text-sm">
                      {[instagram, telegram, twitter].filter(Boolean).length > 0
                        ? `${[instagram, telegram, twitter].filter(Boolean).length} привязано`
                        : 'Не привязано'}
                    </p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-gray-500 rotate-180" />
              </button>
            </motion.div>
          )}

          {/* AVATAR SECTION */}
          {section === 'avatar' && (
            <motion.div
              key="avatar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              {/* Preview */}
              <div className="flex justify-center mb-8">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-5xl font-bold shadow-2xl`}>
                  {currentInitial}
                </div>
              </div>

              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-400" />
                Выберите стиль
              </h3>

              <div className="grid grid-cols-4 gap-3">
                {avatarGradients.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setAvatarGradient(g.gradient)}
                    className="relative"
                  >
                    <div className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${g.gradient} flex items-center justify-center text-white text-xl font-bold transition-transform ${
                      avatarGradient === g.gradient ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-gray-950' : 'hover:scale-105'
                    }`}>
                      {currentInitial}
                    </div>
                    {avatarGradient === g.gradient && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                    <p className="text-gray-400 text-xs text-center mt-1">{g.label}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* INTERESTS SECTION */}
          {section === 'interests' && (
            <motion.div
              key="interests"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <p className="text-gray-400 text-sm mb-4">Выберите до 5 интересов</p>
              <div className="space-y-3">
                {interestOptions.map((item) => {
                  const isSelected = interests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (!isSelected && interests.length >= 5) return;
                        toggleInterest(item.id);
                      }}
                      className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50'
                          : 'bg-gray-800/80 border border-gray-700 hover:border-gray-600'
                      } ${!isSelected && interests.length >= 5 ? 'opacity-40' : ''}`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-white flex-1 text-left">{item.label}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* GOALS SECTION */}
          {section === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <p className="text-gray-400 text-sm mb-4">Что вы хотите получить от приложения?</p>
              <div className="space-y-3">
                {goalOptions.map((item) => {
                  const isSelected = goals.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleGoal(item.id)}
                      className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-pink-600/30 to-purple-600/30 border border-pink-500/50'
                          : 'bg-gray-800/80 border border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-white flex-1 text-left">{item.label}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SOCIAL SECTION */}
          {section === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-5"
            >
              <p className="text-gray-400 text-sm mb-2">Привяжите ваши соц. сети для профиля</p>

              {/* Instagram */}
              <div>
                <label className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-400" /> Instagram
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
                  <Input
                    value={instagram}
                    onChange={e => setInstagram(e.target.value)}
                    placeholder="username"
                    className="pl-10 py-5 rounded-2xl bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Telegram */}
              <div>
                <label className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-400" /> Telegram
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
                  <Input
                    value={telegram}
                    onChange={e => setTelegram(e.target.value)}
                    placeholder="username"
                    className="pl-10 py-5 rounded-2xl bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Twitter / X */}
              <div>
                <label className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-gray-400" /> X (Twitter)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
                  <Input
                    value={twitter}
                    onChange={e => setTwitter(e.target.value)}
                    placeholder="username"
                    className="pl-10 py-5 rounded-2xl bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* CITY SECTION */}
          {section === 'city' && (
            <motion.div
              key="city"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <p className="text-gray-400 text-sm mb-4">Выберите ваш город</p>
              <div className="space-y-2">
                {cityOptions.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCity(c); setSection('main'); }}
                    className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${
                      city === c
                        ? 'bg-purple-600/30 border border-purple-500/50'
                        : 'bg-gray-800/80 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className={`w-5 h-5 ${city === c ? 'text-purple-400' : 'text-gray-500'}`} />
                      <span className="text-white">{c}</span>
                    </div>
                    {city === c && (
                      <Check className="w-5 h-5 text-purple-400" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}