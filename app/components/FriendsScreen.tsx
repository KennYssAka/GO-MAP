import { useState } from 'react';
import { ArrowLeft, UserPlus, UserCheck, UserX, X, MapPin, Clock, Search, Sparkles, Users, MessageCircle, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFriends, type Person, type FriendStatus } from './FriendsContext';
import { useWeather } from './WeatherContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Tab = 'recommendations' | 'friends' | 'requests';

interface FriendsScreenProps {
  onBack: () => void;
  onViewOnMap: (person: Person) => void;
  onMessage: (person: Person) => void;
  onViewProfile: (person: Person) => void;
}

function PersonAvatar({ person, size = 'md' }: { person: Person; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-14 h-14' : 'w-20 h-20';
  const textSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-2xl';

  if (person.avatarUrl) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden border-2 border-gray-700 shrink-0 relative`}>
        <ImageWithFallback
          src={person.avatarUrl}
          alt={person.name}
          className="w-full h-full object-cover"
        />
        {person.status === 'online' && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-gray-900" />
        )}
        {person.status === 'active' && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-yellow-500 border-2 border-gray-900" />
        )}
      </div>
    );
  }

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br ${person.avatarGradient} flex items-center justify-center ${textSize} font-bold text-white border-2 border-gray-700 shrink-0 relative`}>
      {person.avatarInitial}
      {person.status === 'online' && (
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-gray-900" />
      )}
      {person.status === 'active' && (
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-yellow-500 border-2 border-gray-900" />
      )}
    </div>
  );
}

function FriendActionButton({ personId, status, onAdd, onCancel, onAccept, onDecline }: {
  personId: string;
  status: FriendStatus;
  onAdd: () => void;
  onCancel: () => void;
  onAccept: () => void;
  onDecline: () => void;
}) {
  if (status === 'friends') {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
        <UserCheck className="w-3.5 h-3.5" />
        Друзья
      </div>
    );
  }
  if (status === 'sent') {
    return (
      <button
        onClick={onCancel}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-700 text-gray-300 text-xs font-semibold hover:bg-gray-600 transition-colors"
      >
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Отправлено
      </button>
    );
  }
  if (status === 'received') {
    return (
      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
          Принять
        </button>
        <button
          onClick={onDecline}
          className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-gray-700 text-gray-400 text-xs hover:bg-gray-600 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={onAdd}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors"
    >
      <UserPlus className="w-3.5 h-3.5" />
      Добавить
    </button>
  );
}

export function FriendsScreen({ onBack, onViewOnMap, onMessage, onViewProfile }: FriendsScreenProps) {
  const { theme } = useWeather();
  const { friends, recommendations, receivedRequests, friendStatus, addFriend, removeFriend, acceptRequest, declineRequest, cancelRequest, dismissRecommendation } = useFriends();
  const [tab, setTab] = useState<Tab>('recommendations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filteredFriends = friends.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecs = recommendations.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-br ${theme.headerGradient} px-5 pt-10 pb-5`}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white flex-1">Люди</h1>
          {receivedRequests.length > 0 && (
            <button
              onClick={() => setTab('requests')}
              className="relative p-2 rounded-full bg-white/10"
            >
              <UserPlus className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {receivedRequests.length}
              </span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Поиск людей..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder:text-white/40 outline-none text-sm border border-white/10 focus:border-white/30 transition-colors"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'recommendations' as Tab, label: 'Рекомендации', icon: Sparkles, count: recommendations.length },
            { id: 'friends' as Tab, label: 'Друзья', icon: Users, count: friends.length },
            { id: 'requests' as Tab, label: 'Заявки', icon: UserPlus, count: receivedRequests.length },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t.id
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
              {t.count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  tab === t.id ? 'bg-gray-900 text-white' : 'bg-white/20'
                }`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* RECOMMENDATIONS TAB */}
          {tab === 'recommendations' && (
            <motion.div
              key="recs"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-5 space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className={`w-5 h-5 ${theme.textAccent}`} />
                <h2 className="text-white font-semibold">Возможно, вы знакомы</h2>
              </div>

              {/* Horizontal scroll cards for top 4 */}
              <div className="flex gap-3 overflow-x-auto pb-3 -mx-5 px-5 scrollbar-hide">
                {filteredRecs.slice(0, 5).map((person, i) => {
                  const status = friendStatus(person.id);
                  return (
                    <motion.div
                      key={person.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="w-[160px] shrink-0 bg-gray-800/80 rounded-2xl overflow-hidden border border-gray-700/50"
                    >
                      {/* Top gradient */}
                      <div className={`bg-gradient-to-br ${person.avatarGradient} p-3 pb-8 relative`}>
                        <button
                          onClick={() => dismissRecommendation(person.id)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/30 hover:bg-black/50"
                        >
                          <X className="w-3 h-3 text-white/70" />
                        </button>
                      </div>
                      <div className="px-3 pb-3 -mt-6 relative">
                        <div className="flex justify-center mb-2">
                          <PersonAvatar person={person} size="md" />
                        </div>
                        <h3 className="text-white font-semibold text-sm text-center truncate">{person.name.split(' ')[0]}</h3>
                        <p className="text-gray-500 text-xs text-center mb-1">@{person.username}</p>
                        {person.mutualFriends > 0 && (
                          <p className="text-gray-400 text-[10px] text-center mb-2">
                            {person.mutualFriends} общих {person.mutualFriends === 1 ? 'друг' : person.mutualFriends < 5 ? 'друга' : 'друзей'}
                          </p>
                        )}
                        <div className="flex justify-center">
                          <FriendActionButton
                            personId={person.id}
                            status={status}
                            onAdd={() => addFriend(person.id)}
                            onCancel={() => cancelRequest(person.id)}
                            onAccept={() => acceptRequest(person.id)}
                            onDecline={() => declineRequest(person.id)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Full list */}
              <div className="space-y-3">
                {filteredRecs.map((person, i) => {
                  const status = friendStatus(person.id);
                  return (
                    <motion.div
                      key={person.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="bg-gray-800/60 rounded-2xl p-4 border border-gray-700/30"
                    >
                      <div className="flex items-start gap-3">
                        <button onClick={() => onViewProfile(person)}>
                          <PersonAvatar person={person} size="md" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <button
                              onClick={() => onViewProfile(person)}
                              className="text-white font-semibold text-sm truncate hover:underline"
                            >
                              {person.name}
                            </button>
                          </div>
                          <p className="text-gray-500 text-xs mb-1">@{person.username}</p>
                          <p className="text-gray-400 text-xs line-clamp-1 mb-2">{person.bio}</p>

                          {/* Mutual & Match */}
                          <div className="flex items-center gap-3 text-xs">
                            {person.mutualFriends > 0 && (
                              <span className="text-gray-400">
                                <Users className="w-3 h-3 inline mr-1" />
                                {person.mutualFriends} общих
                              </span>
                            )}
                            <span className={`${theme.textAccent}`}>
                              <Sparkles className="w-3 h-3 inline mr-1" />
                              {person.matchPercent}% совпадение
                            </span>
                          </div>

                          {/* Common interests */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {person.interests.slice(0, 3).map(interest => (
                              <span key={interest} className="px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-400 text-[10px]">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="shrink-0">
                          <FriendActionButton
                            personId={person.id}
                            status={status}
                            onAdd={() => addFriend(person.id)}
                            onCancel={() => cancelRequest(person.id)}
                            onAccept={() => acceptRequest(person.id)}
                            onDecline={() => declineRequest(person.id)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {filteredRecs.length === 0 && (
                  <div className="text-center py-12">
                    <span className="text-4xl block mb-3">🎉</span>
                    <p className="text-gray-400 font-medium">Все рекомендации просмотрены!</p>
                    <p className="text-gray-600 text-sm mt-1">Загляни позже — появятся новые люди</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* FRIENDS TAB */}
          {tab === 'friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-5 space-y-3"
            >
              {/* Online friends first */}
              {filteredFriends.length > 0 && (
                <>
                  {/* Online section */}
                  {filteredFriends.filter(f => f.status === 'online').length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Онлайн сейчас
                      </h3>
                      <div className="space-y-2">
                        {filteredFriends.filter(f => f.status === 'online').map(friend => (
                          <FriendCard
                            key={friend.id}
                            person={friend}
                            onViewProfile={() => onViewProfile(friend)}
                            onViewOnMap={() => onViewOnMap(friend)}
                            onMessage={() => onMessage(friend)}
                            onRemove={() => removeFriend(friend.id)}
                            theme={theme}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Others */}
                  {filteredFriends.filter(f => f.status !== 'online').length > 0 && (
                    <div>
                      <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
                        Остальные
                      </h3>
                      <div className="space-y-2">
                        {filteredFriends.filter(f => f.status !== 'online').map(friend => (
                          <FriendCard
                            key={friend.id}
                            person={friend}
                            onViewProfile={() => onViewProfile(friend)}
                            onViewOnMap={() => onViewOnMap(friend)}
                            onMessage={() => onMessage(friend)}
                            onRemove={() => removeFriend(friend.id)}
                            theme={theme}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {filteredFriends.length === 0 && !searchQuery && (
                <div className="text-center py-16">
                  <span className="text-5xl block mb-4">👥</span>
                  <p className="text-gray-400 font-medium mb-2">Пока нет друзей</p>
                  <p className="text-gray-600 text-sm">Посмотри рекомендации и добавь людей!</p>
                  <button
                    onClick={() => setTab('recommendations')}
                    className={`mt-4 px-5 py-2.5 rounded-full ${theme.accent} text-white font-semibold text-sm`}
                  >
                    Смотреть рекомендации
                  </button>
                </div>
              )}

              {filteredFriends.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <span className="text-4xl block mb-3">🔍</span>
                  <p className="text-gray-400 font-medium">Никого не найдено</p>
                </div>
              )}
            </motion.div>
          )}

          {/* REQUESTS TAB */}
          {tab === 'requests' && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-5 space-y-3"
            >
              {receivedRequests.length > 0 ? (
                receivedRequests.map((person, i) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-gray-800/60 rounded-2xl p-4 border border-purple-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <PersonAvatar person={person} size="md" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm truncate">{person.name}</h3>
                        <p className="text-gray-500 text-xs">@{person.username}</p>
                        {person.mutualFriends > 0 && (
                          <p className="text-gray-400 text-xs mt-0.5">
                            {person.mutualFriends} общих друзей
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => acceptRequest(person.id)}
                          className="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors"
                        >
                          Принять
                        </button>
                        <button
                          onClick={() => declineRequest(person.id)}
                          className="px-3 py-2 rounded-xl bg-gray-700 text-gray-400 text-sm hover:bg-gray-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16">
                  <span className="text-5xl block mb-4">✅</span>
                  <p className="text-gray-400 font-medium">Нет новых заявок</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Person Detail Modal */}
      <AnimatePresence>
        {selectedPerson && (
          <PersonDetailModal
            person={selectedPerson}
            status={friendStatus(selectedPerson.id)}
            onClose={() => setSelectedPerson(null)}
            onAdd={() => addFriend(selectedPerson.id)}
            onRemove={() => removeFriend(selectedPerson.id)}
            onCancel={() => cancelRequest(selectedPerson.id)}
            onAccept={() => acceptRequest(selectedPerson.id)}
            onDecline={() => declineRequest(selectedPerson.id)}
            onViewOnMap={() => { onViewOnMap(selectedPerson); setSelectedPerson(null); }}
            onMessage={() => { onMessage(selectedPerson); setSelectedPerson(null); }}
            theme={theme}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Friend Card ─── */

function FriendCard({ person, onViewProfile, onViewOnMap, onMessage, onRemove, theme }: {
  person: Person;
  onViewProfile: () => void;
  onViewOnMap: () => void;
  onMessage: () => void;
  onRemove: () => void;
  theme: any;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800/60 rounded-2xl p-3.5 border border-gray-700/30"
    >
      <div className="flex items-center gap-3">
        <button onClick={onViewProfile}>
          <PersonAvatar person={person} size="md" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button onClick={onViewProfile} className="text-white font-semibold text-sm truncate hover:underline">
              {person.name}
            </button>
            <span className="text-xs">{person.vibeEmoji}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <MapPin className="w-3 h-3 text-gray-500" />
            <span className="text-gray-400 text-xs truncate">{person.location}</span>
            <span className="text-gray-600 text-xs">· {person.distance}</span>
          </div>
          {person.lastSeen && (
            <div className="flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-gray-600" />
              <span className="text-gray-600 text-xs">
                {person.status === 'online' ? 'Онлайн' : `Был(а) ${person.lastSeen} назад`}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={onViewOnMap}
            className={`p-2.5 rounded-xl ${theme.accentLight} ${theme.textAccent} transition-colors`}
            title="На карте"
          >
            <MapPin className="w-4 h-4" />
          </button>
          <button
            onClick={onMessage}
            className="p-2.5 rounded-xl bg-gray-700/60 text-gray-400 hover:text-white transition-colors"
            title="Написать"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2.5 rounded-xl bg-gray-700/60 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <span className="text-lg leading-none">⋮</span>
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute right-0 top-11 z-20 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl overflow-hidden min-w-[140px]"
                >
                  <button
                    onClick={() => { onRemove(); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 text-sm"
                  >
                    <UserX className="w-4 h-4" />
                    Удалить
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Person Detail Modal ─── */

function PersonDetailModal({ person, status, onClose, onAdd, onRemove, onCancel, onAccept, onDecline, onViewOnMap, onMessage, theme }: {
  person: Person;
  status: FriendStatus;
  onClose: () => void;
  onAdd: () => void;
  onRemove: () => void;
  onCancel: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onViewOnMap: () => void;
  onMessage: () => void;
  theme: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg bg-gray-900 rounded-t-3xl overflow-hidden max-h-[85vh] overflow-y-auto"
      >
        {/* Cover gradient */}
        <div className={`bg-gradient-to-br ${person.avatarGradient} p-6 pt-12 pb-16 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Match badge */}
          <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-semibold">{person.matchPercent}% совпадение</span>
          </div>
        </div>

        <div className="px-6 pb-8 -mt-12 relative">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="border-4 border-gray-900 rounded-full">
              <PersonAvatar person={person} size="lg" />
            </div>
          </div>

          {/* Name & info */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-white mb-0.5">{person.name}</h2>
            <p className="text-gray-500 text-sm">@{person.username} · {person.age} лет</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-lg">{person.vibeEmoji}</span>
              <span className={`text-sm font-medium ${theme.textAccent}`}>{person.vibe}</span>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-gray-800/60 rounded-xl p-3.5 mb-4">
            <p className="text-gray-300 text-sm text-center">{person.bio}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-800/60 rounded-xl p-3 text-center">
              <p className="text-white font-bold text-lg">{person.checkins}</p>
              <p className="text-gray-500 text-xs">Чек-инов</p>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-3 text-center">
              <p className="text-white font-bold text-lg">{person.mutualFriends}</p>
              <p className="text-gray-500 text-xs">Общих</p>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-3 text-center">
              <p className="text-white font-bold text-lg">{person.matchPercent}%</p>
              <p className="text-gray-500 text-xs">Match</p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-gray-800/60 rounded-xl p-3.5 mb-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${theme.accentLight} flex items-center justify-center`}>
              <MapPin className={`w-5 h-5 ${theme.textAccent}`} />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{person.location}</p>
              <p className="text-gray-500 text-xs">{person.distance} от тебя</p>
            </div>
            <button
              onClick={onViewOnMap}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${theme.accentLight} ${theme.textAccent}`}
            >
              На карте
            </button>
          </div>

          {/* Interests */}
          <div className="mb-5">
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Интересы</h3>
            <div className="flex flex-wrap gap-2">
              {person.interests.map(interest => (
                <span key={interest} className="px-3 py-1.5 rounded-full bg-gray-800 text-gray-300 text-xs font-medium border border-gray-700/50">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Mutual friends */}
          {person.mutualFriends > 0 && (
            <div className="mb-5">
              <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Общие друзья</h3>
              <p className="text-gray-400 text-sm">
                {person.mutualFriendsNames.join(', ')} и {Math.max(0, person.mutualFriends - person.mutualFriendsNames.length)} других
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {status === 'friends' ? (
              <>
                <button
                  onClick={onMessage}
                  className={`flex-1 py-3.5 rounded-xl bg-gradient-to-r ${person.avatarGradient} text-white font-semibold flex items-center justify-center gap-2`}
                >
                  <MessageCircle className="w-5 h-5" />
                  Написать
                </button>
                <button
                  onClick={onViewOnMap}
                  className="px-5 py-3.5 rounded-xl bg-gray-800 text-white font-semibold"
                >
                  <MapPin className="w-5 h-5" />
                </button>
              </>
            ) : status === 'sent' ? (
              <button
                onClick={onCancel}
                className="flex-1 py-3.5 rounded-xl bg-gray-800 text-gray-300 font-semibold flex items-center justify-center gap-2"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                Заявка отправлена
              </button>
            ) : status === 'received' ? (
              <>
                <button
                  onClick={onAccept}
                  className={`flex-1 py-3.5 rounded-xl bg-gradient-to-r ${person.avatarGradient} text-white font-semibold flex items-center justify-center gap-2`}
                >
                  <Check className="w-5 h-5" />
                  Принять
                </button>
                <button
                  onClick={onDecline}
                  className="px-5 py-3.5 rounded-xl bg-gray-800 text-gray-400 font-semibold"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={onAdd}
                className={`flex-1 py-3.5 rounded-xl bg-gradient-to-r ${person.avatarGradient} text-white font-semibold flex items-center justify-center gap-2`}
              >
                <UserPlus className="w-5 h-5" />
                Добавить в друзья
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}