import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, MapPin, Users, Clock, Sparkles, ChevronDown, Navigation, X, Route, Footprints, Car, Bus, Mic, Menu, Bookmark, Plus, Minus, Share2, Star, History, Coffee, ShoppingBag, Pill, Fuel, Landmark, UtensilsCrossed, Copy, Heart } from 'lucide-react';
import { motion, AnimatePresence, type PanInfo } from 'motion/react';
import { useWeather } from './WeatherContext';
import { useFriends, type Person } from './FriendsContext';
import { useCity, CITIES, type CityId } from './CityContext';
import { useGeolocation } from './GeolocationContext';
import { useUser } from './UserContext';
import { useKarma } from './KarmaContext';
import { showKarmaToast } from './KarmaToast';
import { getEventsByCity } from './eventsData';
import { SideDrawer } from './SideDrawer';
import { useTheme } from './ThemeContext';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createCustomIcon = (emoji: string, color: string) => L.divIcon({
  className: 'custom-marker',
  html: `<div class="relative flex items-center justify-center">
    <div class="absolute w-16 h-16 rounded-full bg-gradient-to-br ${color} opacity-30 animate-pulse"></div>
    <div class="w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-2xl shadow-xl border-2 border-white z-10 cursor-pointer hover:scale-110 transition-transform">${emoji}</div>
  </div>`,
  iconSize: [48, 48], iconAnchor: [24, 24],
});

const createFriendIcon = (initial: string, gradient: string, isOnline: boolean) => L.divIcon({
  className: 'friend-marker',
  html: `<div class="relative flex items-center justify-center">
    <div class="w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-sm font-bold text-white shadow-lg border-3 border-white z-10" style="border:3px solid white;box-shadow:0 0 0 2px ${isOnline ? '#22c55e' : '#6b7280'};">${initial}</div>
    ${isOnline ? '<div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white z-20"></div>' : ''}
  </div>`,
  iconSize: [40, 40], iconAnchor: [20, 20],
});

const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `<div class="relative flex items-center justify-center">
    <div class="absolute w-20 h-20 rounded-full bg-blue-500 opacity-15 animate-ping" style="animation-duration:2s"></div>
    <div class="absolute w-14 h-14 rounded-full bg-blue-500 opacity-20 animate-pulse"></div>
    <div class="w-5 h-5 rounded-full bg-blue-500 border-3 border-white shadow-lg z-10" style="border:3px solid white;box-shadow:0 0 12px rgba(59,130,246,0.6);"></div>
  </div>`,
  iconSize: [20, 20], iconAnchor: [10, 10],
});

const destMarkerIcon = L.divIcon({
  className: 'dest-marker',
  html: `<div class="relative flex items-center justify-center">
    <div class="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-xl shadow-xl border-2 border-white z-10">📍</div>
    <div class="absolute -bottom-1 w-3 h-3 bg-red-500 rotate-45 z-0"></div>
  </div>`,
  iconSize: [40, 44], iconAnchor: [20, 44],
});

function MapRecenter({ center, zoom, skip }: { center: [number, number]; zoom: number; skip?: boolean }) {
  const map = useMap();
  useEffect(() => { if (!skip) map.setView(center, zoom, { animate: true, duration: 1 }); }, [center[0], center[1], zoom, skip]);
  return null;
}

function FlyToUser({ position, trigger }: { position: [number, number] | null; trigger: number }) {
  const map = useMap();
  useEffect(() => { if (position && trigger > 0) map.flyTo(position, 16, { duration: 1.2 }); }, [trigger]);
  return null;
}

function MapInstanceSetter({ onMap }: { onMap: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => { onMap(map); }, [map]);
  return null;
}

interface RouteInfo {
  coords: [number, number][];
  distance: number;
  duration: number;
  destinationName: string;
  destinationType: 'event' | 'friend' | 'address';
  mode: RouteMode;
}

type RouteMode = 'foot' | 'car' | 'bicycle';

interface GeoSearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address?: Record<string, string>;
}

const vibeZones: Record<CityId, { center: [number, number]; radius: number; color: string; name: string }[]> = {
  almaty: [
    { center: [43.2567, 76.9286], radius: 600, color: '#f59e0b', name: 'Центр' },
    { center: [43.2380, 76.9450], radius: 500, color: '#a855f7', name: 'Парти-зона' },
    { center: [43.2210, 76.8990], radius: 700, color: '#3b82f6', name: 'Бизнес' },
  ],
  astana: [
    { center: [51.1284, 71.4307], radius: 600, color: '#f59e0b', name: 'Байтерек' },
    { center: [51.1324, 71.4040], radius: 500, color: '#a855f7', name: 'Хан Шатыр' },
    { center: [51.0887, 71.4155], radius: 700, color: '#3b82f6', name: 'EXPO' },
  ],
};

// ─── Haversine distance helper (outside component for hoisting) ──────
const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/* ─── Neon Zone Component ─── */
function NeonZone({ center, radius, color, intensity, name, eventCount }: {
  center: [number, number]; radius: number; color: string; intensity: number; name: string; eventCount: number;
}) {
  const baseOpacity = 0.12 * intensity;
  const ringOpacity = 0.35 * intensity;
  const hotness = Math.min(eventCount / 5, 1); // 0-1 based on events
  const adjustedRadius = radius + hotness * 200;

  return (
    <>
      {/* Outer glow ring */}
      <Circle center={center} radius={adjustedRadius * 1.3}
        pathOptions={{ color, fillColor: color, fillOpacity: baseOpacity * 0.3, weight: 0, opacity: 0 }} />
      {/* Mid glow */}
      <Circle center={center} radius={adjustedRadius}
        pathOptions={{ color, fillColor: color, fillOpacity: baseOpacity * 0.6, weight: 1.5, opacity: ringOpacity * 0.5,
          dashArray: '8, 4' }} />
      {/* Inner hot zone */}
      <Circle center={center} radius={adjustedRadius * 0.5}
        pathOptions={{ color, fillColor: color, fillOpacity: baseOpacity, weight: 2, opacity: ringOpacity }} />
    </>
  );
}

interface MapScreenProps {
  focusFriend?: Person | null;
  onClearFocusFriend?: () => void;
  onMessageFriend?: (person: Person) => void;
  onViewFriendProfile?: (person: Person) => void;
  onNavigateToProfile?: () => void;
  onOpenO2O?: () => void;
  onOpenAchievements?: () => void;
  onOpenSubscription?: () => void;
  onOpenKarma?: () => void;
  onOpenCommunities?: () => void;
}

export function MapScreen({ focusFriend, onClearFocusFriend, onMessageFriend, onViewFriendProfile, onNavigateToProfile, onOpenO2O, onOpenAchievements, onOpenSubscription, onOpenKarma, onOpenCommunities }: MapScreenProps) {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showFriends, setShowFriends] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState<Person | null>(focusFriend || null);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showSideDrawer, setShowSideDrawer] = useState(false);
  const [flyToTrigger, setFlyToTrigger] = useState(0);
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeMode, setRouteMode] = useState<RouteMode>('foot');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [attendingEvents, setAttendingEvents] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('attending_events');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeoSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchMode, setSearchMode] = useState<'events' | 'address'>('events');
  const [destinationMarker, setDestinationMarker] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Recent searches
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('recent_searches') || '[]'); } catch { return []; }
  });
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('favorite_places') || '[]')); } catch { return new Set(); }
  });

  const mapRef = useRef<L.Map | null>(null);
  const { weather } = useWeather();
  const { friends } = useFriends();
  const { city, cityId, setCity } = useCity();
  const { position, status, requestPermission, setSimulatedPosition, isTracking } = useGeolocation();
  const { earnKarma } = useKarma();
  const { user } = useUser();
  const { settings: themeSettings, appTheme } = useTheme();

  const events = getEventsByCity(cityId);

  // ─── Keyboard handler ──────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSideDrawer) { setShowSideDrawer(false); return; }
        if (showSearchResults) { setShowSearchResults(false); return; }
        if (searchExpanded) { setSearchExpanded(false); return; }
        if (showCityPicker) { setShowCityPicker(false); return; }
        if (selectedEvent) { setSelectedEvent(null); return; }
        if (selectedFriend) { setSelectedFriend(null); onClearFocusFriend?.(); return; }
        if (route) { setRoute(null); setDestinationMarker(null); return; }
        if (destinationMarker) { setDestinationMarker(null); setSearchQuery(''); return; }
      }
      if (e.key === '/' && !searchExpanded && !selectedEvent && !selectedFriend && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setSearchExpanded(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [searchExpanded, showSearchResults, showCityPicker, selectedEvent, selectedFriend, route, destinationMarker]);

  // Focus search input when panel opens
  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchExpanded]);

  // ─── Recent search helpers ──────────────────────────
  const addRecentSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed || trimmed.length < 2) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, 8);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  }, []);

  // ─── Favorites helpers ──────────────────────────
  const toggleFavorite = useCallback((name: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      localStorage.setItem('favorite_places', JSON.stringify([...next]));
      return next;
    });
  }, []);

  // ─── Share / Copy location ──────────────────────────
  const [copiedCoords, setCopiedCoords] = useState(false);
  const shareLocation = useCallback(async () => {
    if (!position) return;
    const text = `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2000);
    } catch { /* ignore */ }
  }, [position]);

  // ─── Distance from user to point ──────────────────
  const distFromUser = useCallback((lat: number, lon: number) => {
    if (!position) return '';
    const d = haversineDistance(position.lat, position.lng, lat, lon);
    return d < 1000 ? `${Math.round(d)} м` : `${(d / 1000).toFixed(1)} км`;
  }, [position]);

  // ─── Quick category grid (2GIS style) ──────────────────
  const quickCategories = useMemo(() => [
    { icon: UtensilsCrossed, label: 'Еда', color: 'text-orange-400', bg: 'bg-orange-500/15', type: 'food' },
    { icon: Coffee, label: 'Кофе', color: 'text-amber-400', bg: 'bg-amber-500/15', type: 'food' },
    { icon: ShoppingBag, label: 'Магазины', color: 'text-pink-400', bg: 'bg-pink-500/15', type: 'mall' },
    { icon: Landmark, label: 'Музеи', color: 'text-blue-400', bg: 'bg-blue-500/15', type: 'attraction' },
    { icon: Pill, label: 'Аптеки', color: 'text-green-400', bg: 'bg-green-500/15', type: 'shop' },
    { icon: Fuel, label: 'АЗС', color: 'text-red-400', bg: 'bg-red-500/15', type: 'transport' },
    { icon: Heart, label: 'Парки', color: 'text-emerald-400', bg: 'bg-emerald-500/15', type: 'park' },
    { icon: Star, label: 'Избранное', color: 'text-yellow-400', bg: 'bg-yellow-500/15', type: '_fav' },
  ], []);

  const handleCategoryClick = useCallback((type: string) => {
    if (type === '_fav') {
      const favPois = (localPOIs[cityId] || []).filter(p => favorites.has(p.name));
      if (favPois.length > 0) {
        setSearchMode('address');
        const results: GeoSearchResult[] = favPois.map((p, i) => ({
          place_id: `fav-${i}`, display_name: `${p.name}, ${city.name}`, lat: String(p.lat), lon: String(p.lon), type: p.type,
        }));
        setSearchResults(results);
        setShowSearchResults(true);
      }
      return;
    }
    setSearchMode('address');
    const pois = (localPOIs[cityId] || []).filter(p => p.type === type);
    const results: GeoSearchResult[] = pois.map((p, i) => ({
      place_id: `cat-${i}`, display_name: `${p.name}, ${city.name}`, lat: String(p.lat), lon: String(p.lon), type: p.type,
    }));
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  }, [cityId, favorites, city.name]);

  useEffect(() => {
    if (focusFriend) { setSelectedFriend(focusFriend); setSelectedEvent(null); }
  }, [focusFriend]);

  const event = selectedEvent ? events.find((e) => e.id === selectedEvent) : null;

  const filteredEvents = events.filter(e => {
    const matchType = !filterType || e.type === filterType;
    const matchSearch = searchMode !== 'events' || !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const eventTypes = [
    { type: 'party', label: '🎧 Вечеринки', color: 'from-purple-500 to-pink-500' },
    { type: 'concert', label: '🎸 Концерты', color: 'from-amber-500 to-orange-500' },
    { type: 'meetup', label: '💼 Встречи', color: 'from-blue-500 to-indigo-500' },
    { type: 'sport', label: '🏃 Спорт', color: 'from-green-400 to-emerald-500' },
    { type: 'art', label: '🎨 Искусство', color: 'from-pink-500 to-rose-500' },
    { type: 'food', label: '🍜 Еда', color: 'from-red-500 to-orange-500' },
  ];

  const currentZones = vibeZones[cityId] || [];

  const handleCitySwitch = (id: CityId) => {
    setCity(id);
    setSelectedEvent(null);
    setSelectedFriend(null);
    setShowCityPicker(false);
    setFilterType(null);
    setRoute(null);
    setDestinationMarker(null);
  };

  const handleLocateMe = () => {
    if (status === 'denied') {
      alert('Доступ к геолокации запрещён. Разреши в настройках браузера и обнови страницу.');
      return;
    }
    if (!isTracking) {
      requestPermission();
      // fly will happen via the effect below once position arrives
      return;
    }
    if (position) {
      if (mapRef.current) {
        mapRef.current.flyTo([position.lat, position.lng], 16, { duration: 1.2 });
      } else {
        setFlyToTrigger(prev => prev + 1);
      }
    }
  };

  // Auto-fly to real position on first GPS fix
  const hasFlownToRealRef = useRef(false);
  useEffect(() => {
    if (position && !position.isSimulated && !hasFlownToRealRef.current) {
      hasFlownToRealRef.current = true;
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.flyTo([position.lat, position.lng], 15, { duration: 1.5 });
        }
      }, 500);
    }
  }, [position]);

  const handleSimulateLocation = () => {
    const offset = () => (Math.random() - 0.5) * 0.01;
    setSimulatedPosition(city.center[0] + offset(), city.center[1] + offset());
    setFlyToTrigger(prev => prev + 1);
  };

  const handleAttendEvent = (evtId: string) => {
    if (attendingEvents.has(evtId)) return;
    const newSet = new Set(attendingEvents);
    newSet.add(evtId);
    setAttendingEvents(newSet);
    localStorage.setItem('attending_events', JSON.stringify([...newSet]));
    const result = earnKarma('event_attend', event?.title);
    showKarmaToast('event_attend', result);
  };

  // ─── Address search via Nominatim (with local fallback) ─────────────────────

  // Local POI database for fallback when Nominatim is blocked
  const localPOIs: Record<CityId, { name: string; lat: number; lon: number; type: string }[]> = {
    almaty: [
      { name: 'Арбат (ул. Жибек Жолы)', lat: 43.2568, lon: 76.9455, type: 'street' },
      { name: 'ЦУМ Алматы', lat: 43.2563, lon: 76.9453, type: 'shop' },
      { name: 'Парк 28 Панфиловцев', lat: 43.2580, lon: 76.9575, type: 'park' },
      { name: 'Зелёный Базар', lat: 43.2565, lon: 76.9357, type: 'market' },
      { name: 'Медеу', lat: 43.1570, lon: 77.0580, type: 'sport' },
      { name: 'Кок-Тобе', lat: 43.2273, lon: 76.9835, type: 'attraction' },
      { name: 'Площадь Республики', lat: 43.2380, lon: 76.9450, type: 'square' },
      { name: 'MEGA Park Алматы', lat: 43.2062, lon: 76.8944, type: 'mall' },
      { name: 'Дворец Республики', lat: 43.2398, lon: 76.9503, type: 'venue' },
      { name: 'ТРЦ Dostyk Plaza', lat: 43.2344, lon: 76.9564, type: 'mall' },
      { name: 'Алматы Арена', lat: 43.2178, lon: 76.8907, type: 'sport' },
      { name: 'Центральный стадион', lat: 43.2610, lon: 76.9287, type: 'sport' },
      { name: 'КБТУ Университет', lat: 43.2421, lon: 76.9420, type: 'education' },
      { name: 'Вокзал Алматы-1', lat: 43.3166, lon: 76.9400, type: 'transport' },
      { name: 'Вокзал Алматы-2', lat: 43.2538, lon: 76.9097, type: 'transport' },
      { name: 'Аэропорт Алматы', lat: 43.3531, lon: 77.0405, type: 'transport' },
      { name: 'Горный парк (Алмаарасан)', lat: 43.1650, lon: 76.9680, type: 'park' },
      { name: 'ТРЦ Forum Almaty', lat: 43.2392, lon: 76.9283, type: 'mall' },
      { name: 'Первый Президент парк', lat: 43.2177, lon: 76.9277, type: 'park' },
      { name: 'Кафе Ланселот', lat: 43.2440, lon: 76.9410, type: 'food' },
    ],
    astana: [
      { name: 'Байтерек', lat: 51.1284, lon: 71.4307, type: 'attraction' },
      { name: 'Хан Шатыр', lat: 51.1324, lon: 71.4040, type: 'mall' },
      { name: 'EXPO Астана', lat: 51.0887, lon: 71.4155, type: 'venue' },
      { name: 'Астана Арена', lat: 51.1036, lon: 71.4039, type: 'sport' },
      { name: 'Мечеть Хазрет Султан', lat: 51.1240, lon: 71.4020, type: 'mosque' },
      { name: 'Национальный музей', lat: 51.1256, lon: 71.4103, type: 'museum' },
      { name: 'ТРЦ MEGA Silk Way', lat: 51.0907, lon: 71.4200, type: 'mall' },
      { name: 'Набережная Ишим', lat: 51.1275, lon: 71.4180, type: 'park' },
      { name: 'Аэропорт Астана', lat: 51.0222, lon: 71.4669, type: 'transport' },
      { name: 'Дворец Независимости', lat: 51.1176, lon: 71.4096, type: 'venue' },
      { name: 'Водно-зелёный бульвар', lat: 51.1262, lon: 71.4182, type: 'park' },
      { name: 'Центральный концертный зал', lat: 51.1300, lon: 71.4286, type: 'venue' },
    ],
  };

  const searchAddress = useCallback(async (query: string) => {
    if (query.length < 2) { setSearchResults([]); return; }
    setSearchLoading(true);

    // Try Nominatim first, fall back to local POIs
    try {
      const cityBound = cityId === 'almaty'
        ? '&viewbox=76.7,43.35,77.2,43.15&bounded=1'
        : '&viewbox=71.2,51.2,71.6,51.0&bounded=1';
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&addressdetails=1&countrycodes=kz${cityBound}`;
      const resp = await fetch(url, { headers: { 'Accept-Language': 'ru' } });
      if (!resp.ok) throw new Error('Nominatim returned error');
      const data: GeoSearchResult[] = await resp.json();
      if (data.length > 0) {
        setSearchResults(data);
        setShowSearchResults(true);
        setSearchLoading(false);
        return;
      }
    } catch {
      // Nominatim failed — use local fallback
      console.log('Nominatim unavailable, using local POI search');
    }

    // Local POI fallback search
    const q = query.toLowerCase();
    const pois = localPOIs[cityId] || [];
    const matched = pois.filter(p => p.name.toLowerCase().includes(q));

    // Also search events as locations
    const matchedEvents = events.filter(e =>
      e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
    ).map(e => ({
      name: `${e.emoji} ${e.title} — ${e.location}`,
      lat: e.lat,
      lon: e.lng,
      type: 'event',
    }));

    // Also search friends
    const matchedFriends = friends.filter(f =>
      f.name.toLowerCase().includes(q) || f.location.toLowerCase().includes(q)
    ).map(f => ({
      name: `👤 ${f.name} — ${f.location}`,
      lat: f.lat,
      lon: f.lng,
      type: 'friend',
    }));

    const allResults = [...matched, ...matchedEvents, ...matchedFriends].slice(0, 10);
    const fakeGeoResults: GeoSearchResult[] = allResults.map((p, i) => ({
      place_id: `local-${i}-${p.lat}`,
      display_name: `${p.name}, ${city.name}, Казахстан`,
      lat: String(p.lat),
      lon: String(p.lon),
      type: p.type,
    }));

    setSearchResults(fakeGeoResults);
    setShowSearchResults(fakeGeoResults.length > 0);
    setSearchLoading(false);
  }, [cityId, events, friends, city.name]);

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (searchMode === 'address' && value.length >= 3) {
      searchTimerRef.current = setTimeout(() => { searchAddress(value); addRecentSearch(value); }, 400);
    }
    if (searchMode === 'events') {
      setShowSearchResults(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchMode === 'address' && searchQuery.length >= 2) {
      searchAddress(searchQuery);
      addRecentSearch(searchQuery);
    }
    if (e.key === 'Enter' && searchMode === 'events' && filteredEvents.length > 0) {
      setSelectedEvent(filteredEvents[0].id);
      setSearchExpanded(false);
    }
  };

  const handleSelectAddress = (result: GeoSearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const shortName = result.display_name.split(',').slice(0, 2).join(',');
    setDestinationMarker({ lat, lng, name: shortName });
    setSearchQuery(shortName);
    setShowSearchResults(false);
    setSelectedEvent(null);
    setSelectedFriend(null);
    addRecentSearch(shortName);
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
    }
  };

  // Generate intermediate waypoints for a more natural-looking straight-line route
  const generateStraightRoute = (startLat: number, startLng: number, endLat: number, endLng: number): [number, number][] => {
    const steps = 20;
    const coords: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const jitter = i > 0 && i < steps ? (Math.sin(t * Math.PI) * 0.001 * (Math.random() - 0.5)) : 0;
      coords.push([
        startLat + (endLat - startLat) * t + jitter,
        startLng + (endLng - startLng) * t + jitter,
      ]);
    }
    return coords;
  };

  // ─── Build route via OSRM (with straight-line fallback) ──────────────────
  const buildRoute = useCallback(async (destLat: number, destLng: number, destName: string, type: 'event' | 'friend' | 'address', mode?: RouteMode) => {
    const useMode = mode || routeMode;
    if (!position) {
      handleSimulateLocation();
      return;
    }

    setRouteLoading(true);

    const applyRoute = (coords: [number, number][], distance: number, duration: number) => {
      setRoute({ coords, distance, duration, destinationName: destName, destinationType: type, mode: useMode });
      if (mapRef.current && coords.length > 0) {
        const bounds = L.latLngBounds(coords.map(c => L.latLng(c[0], c[1])));
        bounds.extend(L.latLng(position.lat, position.lng));
        mapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
      }
      const result = earnKarma('route_complete', destName);
      showKarmaToast('route_complete', result);
    };

    // Try OSRM first
    try {
      const profile = useMode === 'car' ? 'car' : useMode === 'bicycle' ? 'bike' : 'foot';
      const url = `https://router.project-osrm.org/route/v1/${profile}/${position.lng},${position.lat};${destLng},${destLat}?overview=full&geometries=geojson`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.routes && data.routes.length > 0) {
        const r = data.routes[0];
        const coords: [number, number][] = r.geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
        applyRoute(coords, r.distance, r.duration);
        setRouteLoading(false);
        return;
      }
    } catch {
      console.log('OSRM unavailable, using straight-line fallback');
    }

    // Fallback: straight-line route with estimated distance/duration
    const dist = haversineDistance(position.lat, position.lng, destLat, destLng);
    const roadFactor = 1.3;
    const estimatedDistance = dist * roadFactor;
    const speeds: Record<RouteMode, number> = { foot: 1.4, car: 11, bicycle: 4.2 };
    const estimatedDuration = estimatedDistance / speeds[useMode];
    const coords = generateStraightRoute(position.lat, position.lng, destLat, destLng);
    applyRoute(coords, estimatedDistance, estimatedDuration);
    setRouteLoading(false);
  }, [position, routeMode, earnKarma]);

  const cancelRoute = () => { setRoute(null); setDestinationMarker(null); };

  const changeRouteMode = (mode: RouteMode) => {
    setRouteMode(mode);
    if (route) {
      // Rebuild with new mode
      const dest = destinationMarker || (route ? { lat: route.coords[route.coords.length - 1][0], lng: route.coords[route.coords.length - 1][1], name: route.destinationName } : null);
      if (dest) {
        buildRoute(dest.lat, dest.lng, dest.name || route.destinationName, route.destinationType, mode);
      }
    }
  };

  const formatDistance = (m: number) => m < 1000 ? `${Math.round(m)} м` : `${(m / 1000).toFixed(1)} км`;
  const formatDuration = (s: number) => {
    if (s < 60) return `${Math.round(s)} сек`;
    if (s < 3600) return `${Math.round(s / 60)} мин`;
    return `${Math.floor(s / 3600)}ч ${Math.round((s % 3600) / 60)}мин`;
  };

  const userPos: [number, number] | null = position ? [position.lat, position.lng] : null;

  const modeIcons: Record<RouteMode, { icon: any; label: string; emoji: string }> = {
    foot: { icon: Footprints, label: 'Пешком', emoji: '🚶' },
    car: { icon: Car, label: 'Авто', emoji: '🚗' },
    bicycle: { icon: Bus, label: 'Вело', emoji: '🚴' },
  };

  const quickPlaces = (localPOIs[cityId] || []).slice(0, 6).map(p => ({
    name: p.name.length > 14 ? p.name.slice(0, 12) + '...' : p.name,
    fullName: p.name, lat: p.lat, lng: p.lon,
    emoji: p.type === 'mall' ? '🛍' : p.type === 'park' ? '🌳' : p.type === 'sport' ? '⚽' : p.type === 'transport' ? '🚂' : p.type === 'food' ? '🍽' : p.type === 'attraction' ? '🏛' : '📍',
  }));

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* ─── MAP ─── */}
      <div className="absolute inset-0">
        <MapContainer center={city.center} zoom={city.zoom} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <MapRecenter center={city.center} zoom={city.zoom} skip={!!userPos} />
          <FlyToUser position={userPos} trigger={flyToTrigger} />
          <MapInstanceSetter onMap={(m) => { mapRef.current = m; }} />
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {/* Vibe zones — neon glow when enabled */}
          {currentZones.map((zone, i) => (
            themeSettings.neonMapEnabled ? (
              <NeonZone key={`${cityId}-zone-${i}`} center={zone.center} radius={zone.radius}
                color={appTheme.neonColor} intensity={themeSettings.neonIntensity} name={zone.name}
                eventCount={filteredEvents.filter(e => haversineDistance(e.lat, e.lng, zone.center[0], zone.center[1]) < zone.radius).length} />
            ) : (
              <Circle key={`${cityId}-zone-${i}`} center={zone.center} radius={zone.radius}
                pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.15, weight: 2, opacity: 0.5 }} />
            )
          ))}
          {/* Neon event hotspots */}
          {themeSettings.neonMapEnabled && filteredEvents.map(evt => (
            <Circle key={`neon-evt-${evt.id}`} center={[evt.lat, evt.lng]} radius={120 + evt.attending * 2}
              pathOptions={{
                color: appTheme.neonColor, fillColor: appTheme.neonColor,
                fillOpacity: 0.08 * themeSettings.neonIntensity, weight: 1,
                opacity: 0.25 * themeSettings.neonIntensity
              }} />
          ))}
          {userPos && (
            <>
              <Circle center={userPos} radius={position?.accuracy || 50}
                pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.08, weight: 1, opacity: 0.3 }} />
              <Marker position={userPos} icon={userLocationIcon}>
                <Popup>
                  <div className="text-center min-w-[140px]">
                    <p className="font-bold text-sm mb-0.5">You are here</p>
                    {position?.address && (
                      <p className="text-xs text-gray-600 mb-0.5">{position.address}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {position?.isSimulated ? 'Simulated position' : `~${Math.round(position?.accuracy || 0)}m accuracy`}
                    </p>
                  </div>
                </Popup>
              </Marker>
            </>
          )}
          {destinationMarker && (
            <Marker position={[destinationMarker.lat, destinationMarker.lng]} icon={destMarkerIcon}>
              <Popup><div className="text-center min-w-[160px]"><p className="font-bold text-sm mb-1">📍 {destinationMarker.name}</p>
                <button onClick={() => buildRoute(destinationMarker.lat, destinationMarker.lng, destinationMarker.name, 'address')}
                  className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-bold">Маршрут сюда</button></div></Popup>
            </Marker>
          )}
          {route && (
            <Polyline positions={route.coords}
              pathOptions={{ color: route.mode === 'car' ? '#3b82f6' : route.mode === 'bicycle' ? '#22c55e' : '#8b5cf6',
                weight: 5, opacity: 0.85, dashArray: route.mode === 'foot' ? '10, 6' : undefined, lineCap: 'round', lineJoin: 'round' }} />
          )}
          {filteredEvents.map((evt) => (
            <Marker key={evt.id} position={[evt.lat, evt.lng]} icon={createCustomIcon(evt.emoji, evt.color)}
              eventHandlers={{ click: () => { setSelectedEvent(evt.id); setSelectedFriend(null); setSearchExpanded(false); } }}>
              <Popup><div className="text-center min-w-[200px]"><div className="text-4xl mb-2">{evt.emoji}</div>
                <p className="font-bold text-base mb-1">{evt.title}</p><p className="text-sm text-gray-600 mb-2">{evt.location}</p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-2"><span>🕐 {evt.time}</span><span>•</span><span>{evt.date}</span></div>
                <p className="text-xs mb-2">👥 <span className="font-bold">{evt.attending}</span> идут</p>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block">{evt.price}</div></div></Popup>
            </Marker>
          ))}
          {showFriends && friends.map((friend) => (
            <Marker key={`friend-${friend.id}`} position={[friend.lat, friend.lng]}
              icon={createFriendIcon(friend.avatarInitial, friend.avatarGradient, friend.status === 'online')}
              eventHandlers={{ click: () => { setSelectedFriend(friend); setSelectedEvent(null); setSearchExpanded(false); } }}>
              <Popup><div className="text-center min-w-[180px]"><div className="text-lg font-bold mb-1">{friend.name}</div>
                <div className="text-sm text-gray-600 mb-1">{friend.vibeEmoji} {friend.vibe}</div>
                <div className="text-xs text-gray-500">{friend.location}</div></div></Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* ═══ TOP BAR — Profile (left) + City (right) ═══ */}
      <div className="absolute top-0 left-0 right-0 z-[1000] pointer-events-none">
        <div className="flex items-center justify-between px-4 pt-3">
          <button onClick={onNavigateToProfile} aria-label="Профиль"
            className="pointer-events-auto w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white/30 active:scale-90 transition-transform focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none relative">
            {user?.avatarInitial || '?'}
            {user && <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-gray-900 flex items-center justify-center">
              <span className="text-[8px] font-bold text-purple-400">{user.level}</span>
            </div>}
          </button>
          <div className="pointer-events-auto relative">
            <button onClick={() => setShowCityPicker(!showCityPicker)}
              className="bg-gray-900/70 backdrop-blur-md rounded-full px-3 py-2 flex items-center gap-1.5 shadow-lg border border-gray-700/40">
              <span className="text-sm">{city.emoji}</span>
              <span className="text-white font-bold text-xs">{city.name}</span>
              <ChevronDown className={`w-3 h-3 text-white/70 transition-transform ${showCityPicker ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showCityPicker && (
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden w-52">
                  {(Object.keys(CITIES) as CityId[]).map((id) => {
                    const c = CITIES[id]; const isActive = cityId === id; const cityEvts = getEventsByCity(id);
                    return (
                      <button key={id} onClick={() => handleCitySwitch(id)}
                        className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${isActive ? 'bg-purple-600/20' : 'hover:bg-gray-800/80'}`}>
                        <span className="text-xl">{c.emoji}</span>
                        <div className="flex-1 text-left"><p className={`font-semibold text-sm ${isActive ? 'text-purple-300' : 'text-white'}`}>{c.name}</p>
                          <p className="text-gray-500 text-xs">{cityEvts.length} событий</p></div>
                        {isActive && <div className="w-2 h-2 rounded-full bg-purple-400" />}
                      </button>);
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT CONTROLS — Zoom, Friends, Locate, Share ═══ */}
      <div className="absolute right-3 z-[1000] pointer-events-auto flex flex-col gap-2" style={{ top: '45%', transform: 'translateY(-50%)' }}>
        <button onClick={() => mapRef.current?.zoomIn()} aria-label="Приблизить" className="w-10 h-10 rounded-xl bg-gray-900/70 backdrop-blur-md text-white flex items-center justify-center shadow-lg border border-gray-700/40 active:scale-90 transition-transform focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"><Plus className="w-5 h-5" /></button>
        <button onClick={() => mapRef.current?.zoomOut()} aria-label="Отдалить" className="w-10 h-10 rounded-xl bg-gray-900/70 backdrop-blur-md text-white flex items-center justify-center shadow-lg border border-gray-700/40 active:scale-90 transition-transform focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"><Minus className="w-5 h-5" /></button>
        <div className="h-1" />
        <button onClick={() => setShowFriends(!showFriends)} aria-label={showFriends ? 'Скрыть друзей' : 'Показать друзей'}
          className={`w-10 h-10 rounded-xl shadow-lg flex items-center justify-center border border-gray-700/40 active:scale-90 transition-transform focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none ${showFriends ? 'bg-green-600 text-white' : 'bg-gray-900/70 backdrop-blur-md text-white'}`}>
          <Users className="w-5 h-5" />
        </button>
        <button onClick={handleLocateMe} aria-label="My location"
          className={`w-10 h-10 rounded-xl shadow-lg flex items-center justify-center border active:scale-90 transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none ${
            status === 'granted'
              ? 'bg-blue-600 text-white border-blue-500/40'
              : status === 'requesting'
              ? 'bg-blue-600/50 text-white border-blue-500/30 animate-pulse'
              : status === 'denied'
              ? 'bg-red-900/70 text-red-400 border-red-700/40'
              : 'bg-gray-900/70 backdrop-blur-md text-white border-gray-700/40'
          }`}>
          <Navigation className="w-5 h-5" />
        </button>
        {position && (
          <button onClick={shareLocation} aria-label="Скопировать координаты"
            className="w-10 h-10 rounded-xl bg-gray-900/70 backdrop-blur-md text-white flex items-center justify-center shadow-lg border border-gray-700/40 active:scale-90 transition-transform focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none">
            {copiedCoords ? <Copy className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* ═══ BOTTOM LEFT — Weather ═══ */}
      {weather && !searchExpanded && !event && !selectedFriend && !route && !destinationMarker && (
        <div className="absolute bottom-44 left-3 z-[999] pointer-events-none">
          <div className="bg-gray-900/70 backdrop-blur-md rounded-xl px-3 py-2 shadow-lg border border-gray-700/40">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{weather.emoji}</span>
              <span className="text-white font-bold text-sm">{weather.temperature}°</span>
            </div>
            <p className="text-gray-400 text-[9px] mt-0.5">{weather.condition || city.name}</p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
           BOTTOM PANEL — 2GIS-style search + chips + expandable
         ═══════════════════════════════════════════════════════════ */}
      {/* Copied toast */}
      <AnimatePresence>
        {copiedCoords && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-[1100] bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-xl flex items-center gap-2 pointer-events-none">
            <Copy className="w-4 h-4" /> Координаты скопированы
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop overlay */}
      <AnimatePresence>
        {searchExpanded && !event && !selectedFriend && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSearchExpanded(false)}
            className="absolute inset-0 bg-black/40 z-[999]" />
        )}
      </AnimatePresence>

      {!event && !selectedFriend && !route && !destinationMarker && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000]">
          <AnimatePresence>
            {searchExpanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-gray-900/95 backdrop-blur-xl rounded-t-3xl border-t border-gray-700/50 overflow-hidden">
                {/* Drag handle */}
                <div className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing" onClick={() => setSearchExpanded(false)}>
                  <div className="w-10 h-1 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors" />
                </div>
                {/* Mode tabs */}
                <div className="flex gap-1.5 px-4 pb-3" role="tablist">
                  <button role="tab" aria-selected={searchMode === 'events'} onClick={() => { setSearchMode('events'); setShowSearchResults(false); setSearchQuery(''); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none ${searchMode === 'events' ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>🎉 События</button>
                  <button role="tab" aria-selected={searchMode === 'address'} onClick={() => { setSearchMode('address'); setShowSearchResults(false); setSearchQuery(''); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none ${searchMode === 'address' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>📍 Маршрут</button>
                </div>
                {/* Search input */}
                <div className="px-4 pb-3">
                  <div className="bg-gray-800/80 rounded-xl px-4 py-3 flex items-center gap-2 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all">
                    <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <input ref={searchInputRef} type="text"
                      placeholder={searchMode === 'events' ? `Поиск событий в ${city.name}...` : 'Куда поедем?'}
                      value={searchQuery} onChange={(e) => handleSearchInput(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      onFocus={() => { if (searchMode === 'address' && searchResults.length > 0) setShowSearchResults(true); }}
                      className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm" autoFocus
                      aria-label="Поиск" />
                    {searchLoading && <div className="w-4 h-4 border-2 border-gray-600 border-t-white rounded-full animate-spin" />}
                    {searchQuery && <button aria-label="Очистить" onClick={() => { setSearchQuery(''); setSearchResults([]); setShowSearchResults(false); }}
                      className="p-1 hover:bg-gray-700 rounded-full transition-colors"><X className="w-4 h-4 text-gray-500" /></button>}
                  </div>
                </div>
                {/* Quick category grid (2GIS style) */}
                {!searchQuery && searchMode === 'address' && !showSearchResults && (
                  <div className="px-4 pb-3">
                    <div className="grid grid-cols-4 gap-2">
                      {quickCategories.map((cat, i) => {
                        const Icon = cat.icon;
                        return (
                          <button key={i} onClick={() => handleCategoryClick(cat.type)}
                            className={`flex flex-col items-center gap-1.5 py-3 rounded-xl ${cat.bg} hover:opacity-80 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none`}>
                            <Icon className={`w-5 h-5 ${cat.color}`} />
                            <span className="text-[10px] text-gray-300 font-medium">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Recent searches */}
                {!searchQuery && recentSearches.length > 0 && !showSearchResults && (
                  <div className="px-4 pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5" /> Недавние
                      </h3>
                      <button onClick={clearRecentSearches} className="text-gray-600 text-[10px] hover:text-gray-400 transition-colors focus-visible:outline-none focus-visible:text-gray-400">Очистить</button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((q, i) => (
                        <button key={i} onClick={() => { setSearchQuery(q); if (searchMode === 'address') searchAddress(q); }}
                          className="px-3 py-1.5 rounded-full bg-gray-800 text-gray-300 text-xs hover:bg-gray-700 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none">
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {searchMode === 'events' && (
                  <div className="px-4 pb-3"><div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                    <button onClick={() => setFilterType(null)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${!filterType ? 'bg-white text-black' : 'bg-gray-800 text-gray-400'}`}>Все {events.length}</button>
                    {eventTypes.map((type, i) => { const count = events.filter(e => e.type === type.type).length; return (
                      <button key={i} onClick={() => setFilterType(filterType === type.type ? null : type.type)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${filterType === type.type ? `bg-gradient-to-r ${type.color} text-white` : 'bg-gray-800 text-gray-400'}`}>
                        {type.label} {count > 0 ? count : ''}</button>); })}
                  </div></div>
                )}
                {showSearchResults && searchResults.length > 0 && searchMode === 'address' && (
                  <div className="max-h-[40vh] overflow-y-auto" role="listbox">{searchResults.map((result) => {
                    const parts = result.display_name.split(','); const mainName = parts[0]; const subName = parts.slice(1, 3).join(',');
                    const dist = distFromUser(parseFloat(result.lat), parseFloat(result.lon));
                    return (<button key={result.place_id} role="option" onClick={() => { handleSelectAddress(result); setSearchExpanded(false); }}
                      className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-800/80 active:bg-gray-700/80 transition-colors border-b border-gray-800/50 last:border-0 focus-visible:bg-gray-800 focus-visible:outline-none">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0"><MapPin className="w-4 h-4 text-blue-400" /></div>
                      <div className="flex-1 text-left min-w-0"><p className="text-white font-semibold text-sm truncate">{mainName}</p>
                        <p className="text-gray-500 text-xs truncate">{subName}</p></div>
                      <div className="flex flex-col items-end flex-shrink-0">
                        <Route className="w-4 h-4 text-gray-600" />
                        {dist && <span className="text-gray-600 text-[10px] mt-0.5">{dist}</span>}
                      </div></button>);
                  })}</div>
                )}
                {!showSearchResults && searchMode === 'events' && (
                  <div className="max-h-[50vh] overflow-y-auto pb-4">
                    <div className="px-4 pb-2"><h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">🔥 Сейчас популярно</h3></div>
                    {filteredEvents.slice(0, 6).map((evt) => (
                      <button key={evt.id} onClick={() => { setSelectedEvent(evt.id); setSearchExpanded(false); }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-800/60 transition-colors">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${evt.color} flex items-center justify-center text-xl flex-shrink-0`}>{evt.emoji}</div>
                        <div className="flex-1 text-left min-w-0"><p className="text-white font-semibold text-sm truncate">{evt.title}</p>
                          <p className="text-gray-500 text-xs truncate">{evt.location} · {evt.time}</p></div>
                        <div className="text-right flex-shrink-0"><p className="text-purple-400 text-xs font-bold">👥 {evt.attending}</p><p className="text-gray-600 text-[10px]">{evt.price}</p></div>
                      </button>
                    ))}
                    <div className="px-4 py-3"><div className="bg-gradient-to-r from-purple-900/60 to-pink-900/60 rounded-2xl p-4 border border-purple-500/20">
                      <div className="flex items-center gap-3"><div className="text-3xl">✨</div>
                        <div className="flex-1"><p className="text-white font-bold text-sm">AI Reality Map Premium</p>
                          <p className="text-purple-300 text-xs">Эмоциональные маршруты, прогноз вайба и больше</p></div>
                        <div className="px-3 py-1.5 rounded-full bg-purple-500 text-white text-xs font-bold">Скоро</div></div></div></div>
                    <div className="px-4 pb-2 pt-1"><h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">👥 Друзья рядом</h3></div>
                    {friends.filter(f => f.status === 'online').slice(0, 4).map((f) => (
                      <button key={f.id} onClick={() => { setSelectedFriend(f); setSelectedEvent(null); setSearchExpanded(false); }}
                        className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-800/60 transition-colors">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${f.avatarGradient} flex items-center justify-center text-sm font-bold text-white relative`}>
                          {f.avatarInitial}<div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-gray-900" /></div>
                        <div className="flex-1 text-left min-w-0"><p className="text-white font-semibold text-sm">{f.name}</p>
                          <p className="text-gray-500 text-xs truncate">{f.vibeEmoji} {f.vibe}</p></div>
                        <span className="text-gray-600 text-xs">{f.distance}</span>
                      </button>
                    ))}
                    {filteredEvents.length > 6 && (<>
                      <div className="px-4 pb-2 pt-3"><h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">📅 Ещё события</h3></div>
                      {filteredEvents.slice(6, 12).map((evt) => (
                        <button key={evt.id} onClick={() => { setSelectedEvent(evt.id); setSearchExpanded(false); }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-800/60 transition-colors">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${evt.color} flex items-center justify-center text-xl flex-shrink-0`}>{evt.emoji}</div>
                          <div className="flex-1 text-left min-w-0"><p className="text-white font-semibold text-sm truncate">{evt.title}</p>
                            <p className="text-gray-500 text-xs truncate">{evt.location} · {evt.time}</p></div>
                          <p className="text-gray-600 text-xs flex-shrink-0">{evt.date}</p>
                        </button>
                      ))}</>)}
                  </div>
                )}
                {!showSearchResults && searchMode === 'address' && !searchQuery && (
                  <div className="max-h-[40vh] overflow-y-auto pb-4">
                    <div className="px-4 pb-2"><h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">📍 Популярные места</h3></div>
                    {(localPOIs[cityId] || []).slice(0, 12).map((poi, i) => (
                      <div key={i} className="flex items-center hover:bg-gray-800/60 transition-colors">
                        <button onClick={() => {
                          handleSelectAddress({ place_id: `poi-${i}`, display_name: `${poi.name}, ${city.name}`, lat: String(poi.lat), lon: String(poi.lon), type: poi.type });
                          setSearchExpanded(false); }}
                          className="flex-1 px-4 py-2.5 flex items-center gap-3 focus-visible:bg-gray-800 focus-visible:outline-none min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">
                            {poi.type === 'mall' ? '🛍' : poi.type === 'park' ? '🌳' : poi.type === 'sport' ? '⚽' : poi.type === 'transport' ? '🚂' : poi.type === 'food' ? '🍽' : poi.type === 'attraction' ? '🏛' : poi.type === 'venue' ? '🎭' : '📍'}</div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{poi.name}</p>
                            {position && <p className="text-gray-500 text-[10px]">{distFromUser(poi.lat, poi.lon)}</p>}
                          </div>
                          <Route className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        </button>
                        <button onClick={() => toggleFavorite(poi.name)} aria-label={favorites.has(poi.name) ? 'Убрать из избранного' : 'В избранное'}
                          className="pr-3 p-2 focus-visible:outline-none active:scale-90 transition-transform">
                          <Star className={`w-4 h-4 ${favorites.has(poi.name) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {!searchExpanded && (
            <div className="bg-gray-900/90 backdrop-blur-xl border-t border-gray-800/60">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2.5">
                <button onClick={() => { if (position) { if (mapRef.current) mapRef.current.flyTo([position.lat, position.lng], 16, { duration: 1 }); } else handleSimulateLocation(); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 text-white text-xs font-semibold whitespace-nowrap border border-gray-700/50 flex-shrink-0">
                  <Bookmark className="w-3.5 h-3.5 text-blue-400" /> Ваш дом</button>
                {quickPlaces.map((p, i) => (
                  <button key={i} onClick={() => { setDestinationMarker({ lat: p.lat, lng: p.lng, name: p.fullName }); if (mapRef.current) mapRef.current.flyTo([p.lat, p.lng], 16, { duration: 1.2 }); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 text-white text-xs font-semibold whitespace-nowrap border border-gray-700/50 flex-shrink-0">
                    <span>{p.emoji}</span>{p.name}</button>
                ))}
              </div>
            </div>
          )}
          <div className="bg-gray-900/95 backdrop-blur-xl px-4 py-3 border-t border-gray-800/40" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
            <div className="flex items-center gap-2">
              {/* Hamburger menu button — opens side drawer like 2GIS */}
              <button
                onClick={() => setShowSideDrawer(true)}
                aria-label="Открыть меню"
                className="w-12 h-12 rounded-xl bg-gray-800/80 flex items-center justify-center hover:bg-gray-700/80 active:scale-90 transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none relative flex-shrink-0"
              >
                <Menu className="w-5 h-5 text-gray-300" />
                {events.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white text-[8px] font-bold">{events.length > 9 ? '9+' : events.length}</span>
                  </div>
                )}
              </button>
              {/* Search bar */}
              <button onClick={() => setSearchExpanded(!searchExpanded)} aria-label="Открыть поиск"
                className="flex-1 bg-gray-800/80 rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-gray-700/80 active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none">
                <Search className="w-5 h-5 text-gray-400" />
                <span className="flex-1 text-left text-gray-400 text-sm">Поиск</span>
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-gray-700 text-gray-500 text-[10px] font-mono border border-gray-600">/</kbd>
                <Mic className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ROUTE INFO BAR ═══ */}
      <AnimatePresence>
        {route && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 z-[1001] bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50">
            <div className="flex border-b border-gray-800">
              {(['foot', 'car', 'bicycle'] as RouteMode[]).map(mode => {
                const m = modeIcons[mode]; const isActive = route.mode === mode;
                return (<button key={mode} onClick={() => changeRouteMode(mode)}
                  className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold ${isActive ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'}`}>
                  <span>{m.emoji}</span>{m.label}</button>);
              })}
            </div>
            <div className="p-4"><div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  {route.mode === 'car' ? <Car className="w-5 h-5 text-blue-400" /> : route.mode === 'bicycle' ? <Bus className="w-5 h-5 text-green-400" /> : <Footprints className="w-5 h-5 text-purple-400" />}</div>
                <div className="min-w-0"><p className="text-white font-bold text-sm truncate">→ {route.destinationName}</p>
                  <div className="flex items-center gap-3 text-xs"><span className="text-blue-400 font-bold">{formatDistance(route.distance)}</span>
                    <span className="text-gray-400">·</span><span className="text-green-400 font-bold">{formatDuration(route.duration)}</span></div></div>
              </div>
              <button onClick={cancelRoute} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center ml-2 flex-shrink-0"><X className="w-4 h-4 text-gray-400" /></button>
            </div></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Destination action bar ═══ */}
      <AnimatePresence>
        {destinationMarker && !route && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            drag="y" dragConstraints={{ top: 0 }} dragElastic={0.2}
            onDragEnd={(_: any, info: PanInfo) => { if (info.offset.y > 80) { setDestinationMarker(null); setSearchQuery(''); } }}
            className="absolute bottom-0 left-0 right-0 z-[1001] bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50 p-4" role="dialog" aria-label={destinationMarker.name}>
            <div className="flex justify-center -mt-2 mb-2"><div className="w-10 h-1 rounded-full bg-gray-700" /></div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center"><MapPin className="w-5 h-5 text-red-400" /></div>
              <div className="flex-1 min-w-0"><p className="text-white font-bold text-sm truncate">{destinationMarker.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-500 text-xs">{destinationMarker.lat.toFixed(4)}, {destinationMarker.lng.toFixed(4)}</p>
                  {position && <span className="text-blue-400 text-xs font-semibold">{distFromUser(destinationMarker.lat, destinationMarker.lng)}</span>}
                </div></div>
              <button onClick={() => toggleFavorite(destinationMarker.name)} aria-label="В избранное"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center active:scale-90 transition-transform">
                <Star className={`w-4 h-4 ${favorites.has(destinationMarker.name) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} />
              </button>
              <button onClick={() => { setDestinationMarker(null); setSearchQuery(''); }} aria-label="Закрыть"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center active:scale-90 transition-transform"><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <div className="flex gap-2">
              {(['foot', 'car', 'bicycle'] as RouteMode[]).map(mode => { const m = modeIcons[mode]; return (
                <button key={mode} onClick={() => { setRouteMode(mode); buildRoute(destinationMarker.lat, destinationMarker.lng, destinationMarker.name, 'address', mode); }}
                  disabled={routeLoading} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-1.5 disabled:opacity-50">
                  {routeLoading ? '...' : <><span>{m.emoji}</span>{m.label}</>}</button>); })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── FRIEND DETAIL PANEL ───────────────── */}
      <AnimatePresence>
        {selectedFriend && !event && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y" dragConstraints={{ top: 0 }} dragElastic={0.2}
            onDragEnd={(_: any, info: PanInfo) => { if (info.offset.y > 100) { setSelectedFriend(null); onClearFocusFriend?.(); } }}
            className="absolute bottom-0 left-0 right-0 z-[1001] bg-gray-900 rounded-t-3xl shadow-2xl" role="dialog" aria-label="Информация о друге">
            <div className="flex justify-center pt-2"><div className="w-10 h-1 rounded-full bg-gray-700" /></div>
            <div className="p-5 pt-3">
              <button onClick={() => { setSelectedFriend(null); onClearFocusFriend?.(); }} aria-label="Закрыть"
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 active:scale-90 transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none">
                <X className="w-4 h-4 text-gray-400" />
              </button>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedFriend.avatarGradient} flex items-center justify-center text-2xl font-bold text-white relative`}>
                  {selectedFriend.avatarInitial}
                  {selectedFriend.status === 'online' && <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-gray-900" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{selectedFriend.name}</h3>
                  <p className="text-gray-400 text-sm">{selectedFriend.vibeEmoji} {selectedFriend.vibe}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <MapPin className="w-4 h-4 text-purple-400" /><span>{selectedFriend.location}</span>
                  <span className="text-gray-500">· {selectedFriend.distance}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>{selectedFriend.status === 'online' ? 'Онлайн сейчас' : `Был(а) ${selectedFriend.lastSeen} назад`}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-3">{selectedFriend.bio}</p>
              {/* Distance to friend */}
              {position && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-gray-800/50 rounded-xl">
                  <Navigation className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300 text-sm">Расстояние: <strong className="text-blue-400">{distFromUser(selectedFriend.lat, selectedFriend.lng)}</strong></span>
                </div>
              )}
              <div className="flex gap-2.5">
                <button onClick={() => onMessageFriend?.(selectedFriend)}
                  className={`flex-1 py-3.5 rounded-2xl bg-gradient-to-r ${selectedFriend.avatarGradient} text-white font-bold text-sm active:scale-95 transition-transform focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none`}>
                  Написать
                </button>
                <button onClick={() => buildRoute(selectedFriend.lat, selectedFriend.lng, selectedFriend.name, 'friend')}
                  disabled={routeLoading}
                  className="px-4 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm flex items-center gap-1.5 disabled:opacity-50 active:scale-95 transition-transform focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none">
                  {routeLoading ? '...' : <><Route className="w-4 h-4" /> Путь</>}
                </button>
                <button onClick={() => onViewFriendProfile?.(selectedFriend)}
                  className="px-4 py-3.5 rounded-2xl bg-gray-800 text-white font-bold text-sm border border-gray-700/50 active:scale-95 transition-transform focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none">
                  👤
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── EVENT DETAIL MODAL ────────────────── */}
      <AnimatePresence>
        {event && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y" dragConstraints={{ top: 0 }} dragElastic={0.2}
            onDragEnd={(_: any, info: PanInfo) => { if (info.offset.y > 100) setSelectedEvent(null); }}
            className="absolute bottom-0 left-0 right-0 z-[1001] bg-gray-900 rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto" role="dialog" aria-label={event.title}>
            <div className="flex justify-center pt-2"><div className="w-10 h-1 rounded-full bg-gray-700" /></div>
            <div className="p-6 pt-3">
              <button onClick={() => setSelectedEvent(null)} aria-label="Закрыть"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 active:scale-90 transition-all focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none">
                <X className="w-5 h-5 text-gray-400" />
              </button>
              <div className="text-6xl mb-4 text-center">{event.emoji}</div>
              <h2 className="text-3xl font-bold text-white mb-2 text-center">{event.title}</h2>
              {event.isCustom && (
                <div className="flex justify-center mb-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">✨ Моё событие</span>
                </div>
              )}
              <div className="flex justify-center mb-4">
                <span className={`px-4 py-2 rounded-full bg-gradient-to-r ${event.color} text-white font-semibold text-sm`}>
                  {event.vibe} {event.vibeLabel}
                </span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-300"><MapPin className="w-5 h-5 text-purple-400" /><span>{event.location}</span></div>
                <div className="flex items-center gap-3 text-gray-300"><Clock className="w-5 h-5 text-purple-400" /><span>{event.date} в {event.time}</span></div>
                <div className="flex items-center gap-3 text-gray-300"><Users className="w-5 h-5 text-purple-400" /><span>{event.attending} человек идут</span></div>
                <div className="flex items-center gap-3 text-gray-300"><Sparkles className="w-5 h-5 text-purple-400" /><span>{event.price}</span></div>
              </div>
              <p className="text-gray-400 mb-4">{event.description}</p>
              {/* Distance from user */}
              {position && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-gray-800/50 rounded-xl">
                  <Navigation className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300 text-sm">До места: <strong className="text-blue-400">{distFromUser(event.lat, event.lng)}</strong></span>
                </div>
              )}
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAttendEvent(event.id)}
                  className={`flex-1 py-4 rounded-2xl font-bold text-lg shadow-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${attendingEvents.has(event.id) ? 'bg-green-600 text-white' : `bg-gradient-to-r ${event.color} text-white`}`}>
                  {attendingEvents.has(event.id) ? '✅ Иду!' : 'Пойду! 🎉'}
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }}
                  onClick={() => buildRoute(event.lat, event.lng, event.title, 'event')}
                  disabled={routeLoading}
                  className="px-5 py-4 rounded-2xl bg-blue-600 text-white font-bold text-base flex items-center gap-2 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none">
                  {routeLoading ? '...' : <><Route className="w-5 h-5" /> Маршрут</>}
                </motion.button>
              </div>
              {/* Share event hint */}
              <p className="text-center text-gray-600 text-[10px] mt-3">Нажмите <kbd className="px-1 py-0.5 rounded bg-gray-800 text-gray-500 text-[9px] font-mono border border-gray-700">Esc</kbd> чтобы закрыть</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SIDE DRAWER (2GIS-style) ═══ */}
      <SideDrawer
        isOpen={showSideDrawer}
        onClose={() => setShowSideDrawer(false)}
        onNavigateToProfile={onNavigateToProfile}
        onOpenO2O={onOpenO2O}
        onOpenAchievements={onOpenAchievements}
        onOpenSubscription={onOpenSubscription}
        onOpenKarma={onOpenKarma}
        favoritesCount={favorites.size}
        recentSearches={recentSearches}
        onClearRecentSearches={clearRecentSearches}
      />
    </div>
  );
}