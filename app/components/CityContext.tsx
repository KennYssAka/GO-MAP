import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CityId = 'almaty' | 'astana';

export interface CityInfo {
  id: CityId;
  name: string;
  nameEn: string;
  emoji: string;
  center: [number, number];
  zoom: number;
}

export const CITIES: Record<CityId, CityInfo> = {
  almaty: {
    id: 'almaty',
    name: 'Алматы',
    nameEn: 'Almaty',
    emoji: '🏔️',
    center: [43.2380, 76.9450],
    zoom: 13,
  },
  astana: {
    id: 'astana',
    name: 'Астана',
    nameEn: 'Astana',
    emoji: '🏙️',
    center: [51.1694, 71.4491],
    zoom: 13,
  },
};

interface CityContextType {
  city: CityInfo;
  cityId: CityId;
  setCity: (id: CityId) => void;
}

const CityContext = createContext<CityContextType>({
  city: CITIES.almaty,
  cityId: 'almaty',
  setCity: () => {},
});

export function CityProvider({ children }: { children: ReactNode }) {
  const [cityId, setCityId] = useState<CityId>(() => {
    const stored = localStorage.getItem('selected_city');
    return (stored === 'astana' ? 'astana' : 'almaty') as CityId;
  });

  useEffect(() => {
    localStorage.setItem('selected_city', cityId);
  }, [cityId]);

  return (
    <CityContext.Provider value={{ city: CITIES[cityId], cityId, setCity: setCityId }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}
