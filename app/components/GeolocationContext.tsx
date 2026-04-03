import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';

export interface UserPosition {
  lat: number;
  lng: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  timestamp: number;
  isSimulated: boolean;
  address?: string;
}

export type GeoStatus =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'unavailable'
  | 'error'
  | 'simulated';

interface GeolocationContextType {
  position: UserPosition | null;
  status: GeoStatus;
  error: string | null;
  address: string | null;
  requestPermission: () => void;
  setSimulatedPosition: (lat: number, lng: number) => void;
  isTracking: boolean;
}

const GeolocationContext = createContext<GeolocationContextType>({
  position: null,
  status: 'idle',
  error: null,
  address: null,
  requestPermission: () => {},
  setSimulatedPosition: () => {},
  isTracking: false,
});

// ─── Reverse geocode via Nominatim (no API key needed) ───────────────
async function fetchAddress(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ru`,
      {
        headers: { 'User-Agent': 'RealityMap/1.0 (contact@realitymap.app)' },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const a = data.address || {};
    const parts: string[] = [];
    if (a.road || a.pedestrian || a.footway) parts.push(a.road || a.pedestrian || a.footway);
    if (a.suburb || a.quarter || a.neighbourhood) parts.push(a.suburb || a.quarter || a.neighbourhood);
    if (parts.length === 0 && (a.city || a.town || a.village)) parts.push(a.city || a.town || a.village);
    return parts.slice(0, 2).join(', ') || null;
  } catch {
    return null;
  }
}

export function GeolocationProvider({ children }: { children: ReactNode }) {
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [status, setStatus] = useState<GeoStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const geocodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastGeocodedRef = useRef<{ lat: number; lng: number } | null>(null);

  // ── Persist / restore last known real position ──────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem('geo_last_real');
      if (stored) {
        const p: UserPosition = JSON.parse(stored);
        // Only restore if less than 10 minutes old
        if (Date.now() - p.timestamp < 10 * 60 * 1000) {
          setPosition(p);
          setStatus('granted');
          if (p.address) setAddress(p.address);
        }
      }
    } catch { /* ignore */ }
  }, []);

  // ── Geocode debounced — only when moved >50m ────────────────────────
  const scheduleGeocode = useCallback((lat: number, lng: number) => {
    if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
    geocodeTimerRef.current = setTimeout(async () => {
      const last = lastGeocodedRef.current;
      if (last) {
        // Skip if less than 50m moved
        const dlat = (lat - last.lat) * 111320;
        const dlng = (lng - last.lng) * 111320 * Math.cos(lat * Math.PI / 180);
        if (Math.sqrt(dlat * dlat + dlng * dlng) < 50) return;
      }
      lastGeocodedRef.current = { lat, lng };
      const addr = await fetchAddress(lat, lng);
      if (addr) {
        setAddress(addr);
        setPosition(prev => {
          if (!prev) return prev;
          const updated = { ...prev, address: addr };
          if (!prev.isSimulated) {
            localStorage.setItem('geo_last_real', JSON.stringify(updated));
          }
          return updated;
        });
      }
    }, 1500); // debounce 1.5s
  }, []);

  // ── Handle real GPS success ──────────────────────────────────────────
  const onSuccess = useCallback((pos: GeolocationPosition) => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    const newPos: UserPosition = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      heading: pos.coords.heading,
      speed: pos.coords.speed,
      timestamp: pos.timestamp,
      isSimulated: false,
    };

    setPosition(newPos);
    setStatus('granted');
    setError(null);
    localStorage.setItem('geo_last_real', JSON.stringify(newPos));
    scheduleGeocode(newPos.lat, newPos.lng);
  }, [scheduleGeocode]);

  // ── Handle GPS error ─────────────────────────────────────────────────
  const onError = useCallback((err: GeolocationPositionError) => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    if (err.code === err.PERMISSION_DENIED) {
      setStatus('denied');
      setError('Разреши доступ к геолокации в настройках браузера');
    } else if (err.code === err.TIMEOUT) {
      setStatus('error');
      setError('Не удалось определить местоположение — слабый сигнал');
    } else {
      setStatus('unavailable');
      setError('Геолокация недоступна на этом устройстве');
    }
  }, []);

  // ── Start watching real GPS ──────────────────────────────────────────
  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('unavailable');
      setError('Ваш браузер не поддерживает геолокацию');
      return;
    }

    setStatus('requesting');
    setError(null);

    // First: fast low-accuracy fix to show something quickly
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 60000,
    });

    // Then: high-accuracy continuous watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 5000,
    });
  }, [onSuccess, onError]);

  // ── Public: request permission ────────────────────────────────────────
  const requestPermission = useCallback(() => {
    if (status === 'requesting') return;
    startWatching();
  }, [status, startWatching]);

  // ── Public: set manual/simulated position ────────────────────────────
  const setSimulatedPosition = useCallback((lat: number, lng: number) => {
    const simPos: UserPosition = {
      lat, lng,
      accuracy: 50,
      heading: null,
      speed: null,
      timestamp: Date.now(),
      isSimulated: true,
    };
    setPosition(simPos);
    setStatus('simulated');
    setAddress(null);
    scheduleGeocode(lat, lng);
  }, [scheduleGeocode]);

  // ── Auto-start silently on mount ─────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('unavailable');
      return;
    }
    // Silent attempt — no UI change until success
    navigator.geolocation.getCurrentPosition(
      onSuccess,
      () => { /* silent fail — user can press the button */ },
      { enableHighAccuracy: false, timeout: 6000, maximumAge: 120000 }
    );
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isTracking = status === 'granted' || status === 'simulated';

  return (
    <GeolocationContext.Provider value={{
      position,
      status,
      error,
      address,
      requestPermission,
      setSimulatedPosition,
      isTracking,
    }}>
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocation() {
  return useContext(GeolocationContext);
}