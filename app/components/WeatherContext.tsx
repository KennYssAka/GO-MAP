import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  condition: string;
  emoji: string;
  colorTheme: WeatherColorTheme;
  isDay: boolean;
  windSpeed: number;
  humidity: number;
}

export interface WeatherColorTheme {
  gradient: string;
  headerGradient: string;
  accent: string;
  accentLight: string;
  bgTint: string;
  textAccent: string;
  cardBorder: string;
  glowColor: string;
}

// WMO Weather interpretation codes
function getWeatherInfo(code: number, isDay: boolean): { condition: string; emoji: string; theme: WeatherColorTheme } {
  // Clear sky
  if (code === 0) {
    return isDay ? {
      condition: 'Ясно',
      emoji: '☀️',
      theme: {
        gradient: 'from-amber-500 via-orange-400 to-yellow-300',
        headerGradient: 'from-amber-700 via-orange-600 to-yellow-500',
        accent: 'bg-amber-500',
        accentLight: 'bg-amber-500/20',
        bgTint: 'bg-gradient-to-b from-amber-950/30 via-gray-900 to-black',
        textAccent: 'text-amber-400',
        cardBorder: 'border-amber-500/20',
        glowColor: 'bg-amber-500/15',
      }
    } : {
      condition: 'Ясная ночь',
      emoji: '🌙',
      theme: {
        gradient: 'from-indigo-600 via-purple-700 to-slate-900',
        headerGradient: 'from-indigo-900 via-purple-900 to-slate-900',
        accent: 'bg-indigo-500',
        accentLight: 'bg-indigo-500/20',
        bgTint: 'bg-gradient-to-b from-indigo-950/40 via-gray-900 to-black',
        textAccent: 'text-indigo-400',
        cardBorder: 'border-indigo-500/20',
        glowColor: 'bg-indigo-500/15',
      }
    };
  }

  // Partly cloudy
  if (code === 1 || code === 2) {
    return {
      condition: code === 1 ? 'Малооблачно' : 'Переменная облачность',
      emoji: isDay ? '⛅' : '☁️',
      theme: {
        gradient: 'from-sky-500 via-blue-400 to-cyan-300',
        headerGradient: 'from-sky-800 via-blue-700 to-cyan-600',
        accent: 'bg-sky-500',
        accentLight: 'bg-sky-500/20',
        bgTint: 'bg-gradient-to-b from-sky-950/30 via-gray-900 to-black',
        textAccent: 'text-sky-400',
        cardBorder: 'border-sky-500/20',
        glowColor: 'bg-sky-500/15',
      }
    };
  }

  // Overcast
  if (code === 3) {
    return {
      condition: 'Пасмурно',
      emoji: '☁️',
      theme: {
        gradient: 'from-slate-500 via-gray-500 to-zinc-400',
        headerGradient: 'from-slate-800 via-gray-700 to-zinc-600',
        accent: 'bg-slate-500',
        accentLight: 'bg-slate-500/20',
        bgTint: 'bg-gradient-to-b from-slate-950/40 via-gray-900 to-black',
        textAccent: 'text-slate-400',
        cardBorder: 'border-slate-500/20',
        glowColor: 'bg-slate-500/15',
      }
    };
  }

  // Fog
  if (code === 45 || code === 48) {
    return {
      condition: 'Туман',
      emoji: '🌫️',
      theme: {
        gradient: 'from-gray-400 via-slate-400 to-zinc-300',
        headerGradient: 'from-gray-700 via-slate-600 to-zinc-500',
        accent: 'bg-gray-500',
        accentLight: 'bg-gray-500/20',
        bgTint: 'bg-gradient-to-b from-gray-900/50 via-gray-900 to-black',
        textAccent: 'text-gray-400',
        cardBorder: 'border-gray-500/20',
        glowColor: 'bg-gray-500/15',
      }
    };
  }

  // Drizzle
  if (code >= 51 && code <= 57) {
    return {
      condition: 'Морось',
      emoji: '🌦️',
      theme: {
        gradient: 'from-teal-500 via-cyan-500 to-sky-400',
        headerGradient: 'from-teal-800 via-cyan-700 to-sky-600',
        accent: 'bg-teal-500',
        accentLight: 'bg-teal-500/20',
        bgTint: 'bg-gradient-to-b from-teal-950/30 via-gray-900 to-black',
        textAccent: 'text-teal-400',
        cardBorder: 'border-teal-500/20',
        glowColor: 'bg-teal-500/15',
      }
    };
  }

  // Rain
  if (code >= 61 && code <= 67) {
    return {
      condition: code <= 63 ? 'Дождь' : 'Сильный дождь',
      emoji: '🌧️',
      theme: {
        gradient: 'from-blue-600 via-indigo-500 to-cyan-500',
        headerGradient: 'from-blue-900 via-indigo-800 to-cyan-700',
        accent: 'bg-blue-500',
        accentLight: 'bg-blue-500/20',
        bgTint: 'bg-gradient-to-b from-blue-950/40 via-gray-900 to-black',
        textAccent: 'text-blue-400',
        cardBorder: 'border-blue-500/20',
        glowColor: 'bg-blue-500/15',
      }
    };
  }

  // Snow
  if (code >= 71 && code <= 77) {
    return {
      condition: code <= 73 ? 'Снег' : 'Сильный снег',
      emoji: '❄️',
      theme: {
        gradient: 'from-sky-300 via-blue-200 to-white',
        headerGradient: 'from-sky-700 via-blue-600 to-sky-500',
        accent: 'bg-sky-400',
        accentLight: 'bg-sky-400/20',
        bgTint: 'bg-gradient-to-b from-sky-950/30 via-gray-900 to-black',
        textAccent: 'text-sky-300',
        cardBorder: 'border-sky-400/20',
        glowColor: 'bg-sky-400/15',
      }
    };
  }

  // Rain showers
  if (code >= 80 && code <= 82) {
    return {
      condition: 'Ливень',
      emoji: '⛈️',
      theme: {
        gradient: 'from-violet-600 via-purple-500 to-blue-500',
        headerGradient: 'from-violet-900 via-purple-800 to-blue-700',
        accent: 'bg-violet-500',
        accentLight: 'bg-violet-500/20',
        bgTint: 'bg-gradient-to-b from-violet-950/40 via-gray-900 to-black',
        textAccent: 'text-violet-400',
        cardBorder: 'border-violet-500/20',
        glowColor: 'bg-violet-500/15',
      }
    };
  }

  // Thunderstorm
  if (code >= 95 && code <= 99) {
    return {
      condition: 'Гроза',
      emoji: '⛈️',
      theme: {
        gradient: 'from-yellow-500 via-purple-600 to-slate-800',
        headerGradient: 'from-yellow-800 via-purple-900 to-slate-900',
        accent: 'bg-yellow-500',
        accentLight: 'bg-yellow-500/20',
        bgTint: 'bg-gradient-to-b from-purple-950/50 via-gray-900 to-black',
        textAccent: 'text-yellow-400',
        cardBorder: 'border-yellow-500/20',
        glowColor: 'bg-yellow-500/15',
      }
    };
  }

  // Default
  return {
    condition: 'Облачно',
    emoji: '☁️',
    theme: {
      gradient: 'from-purple-500 via-pink-500 to-orange-400',
      headerGradient: 'from-purple-900 via-purple-800 to-pink-800',
      accent: 'bg-purple-500',
      accentLight: 'bg-purple-500/20',
      bgTint: 'bg-gradient-to-b from-gray-900 to-black',
      textAccent: 'text-purple-400',
      cardBorder: 'border-purple-500/20',
      glowColor: 'bg-purple-500/15',
    }
  };
}

const defaultTheme: WeatherColorTheme = {
  gradient: 'from-purple-500 via-pink-500 to-orange-400',
  headerGradient: 'from-purple-900 via-purple-800 to-pink-800',
  accent: 'bg-purple-500',
  accentLight: 'bg-purple-500/20',
  bgTint: 'bg-gradient-to-b from-gray-900 to-black',
  textAccent: 'text-purple-400',
  cardBorder: 'border-purple-500/20',
  glowColor: 'bg-purple-500/15',
};

interface WeatherContextType {
  weather: WeatherData | null;
  theme: WeatherColorTheme;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const WeatherContext = createContext<WeatherContextType>({
  weather: null,
  theme: defaultTheme,
  isLoading: true,
  error: null,
  refresh: () => {},
});

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Almaty coordinates: 43.2220, 76.8512
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=43.222&longitude=76.8512&current=temperature_2m,weather_code,is_day,wind_speed_10m,relative_humidity_2m&timezone=Asia/Almaty'
      );
      if (!res.ok) throw new Error('Weather API error');
      const data = await res.json();
      const current = data.current;
      const code = current.weather_code;
      const isDay = current.is_day === 1;
      const info = getWeatherInfo(code, isDay);

      setWeather({
        temperature: Math.round(current.temperature_2m),
        weatherCode: code,
        condition: info.condition,
        emoji: info.emoji,
        colorTheme: info.theme,
        isDay,
        windSpeed: current.wind_speed_10m,
        humidity: current.relative_humidity_2m,
      });
    } catch (err: any) {
      console.error('Weather fetch error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // Refresh every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const theme = weather?.colorTheme ?? defaultTheme;

  return (
    <WeatherContext.Provider value={{ weather, theme, isLoading, error, refresh: fetchWeather }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  return useContext(WeatherContext);
}
