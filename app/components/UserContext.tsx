import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  city: string | null;
  avatarInitial: string;
  avatarGradient: string;
  avatarUrl: string;
  interests: string[];
  goals: string[];
  socialLinks: {
    instagram: string;
    telegram: string;
    twitter: string;
  };
  level: number;
  points: number;
  nextLevelPoints: number;
  karma: number;
  karmaRank: string;
  karmaEmoji: string;
  checkins: number;
  placesVisited: number;
  friends: number;
  joinedAt: string;
  authProvider: 'google' | 'email' | 'apple';
  isPrivate: boolean;
  ghostMode: boolean;
  hiddenFromUsers: string[];
  hideCheckinHistory: boolean;
  isGoPlus: boolean;
}

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (provider: 'google' | 'email' | 'apple', data?: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setInterestsAndGoals: (interests: string[], goals: string[]) => void;
  setUserCity: (city: string) => void;
  toggleGhostMode: () => void;
  togglePrivateAccount: () => void;
  hideFromUser: (userId: string) => void;
  unhideFromUser: (userId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultAvatarGradients = [
  'from-yellow-400 to-orange-500',
  'from-purple-400 to-pink-500',
  'from-blue-400 to-cyan-500',
  'from-green-400 to-emerald-500',
  'from-red-400 to-rose-500',
];

function createDefaultUser(name: string, email: string, provider: 'google' | 'email' | 'apple'): UserProfile {
  const gradient = defaultAvatarGradients[Math.floor(Math.random() * defaultAvatarGradients.length)];
  return {
    id: `user_${Date.now()}`,
    name,
    username: name.toLowerCase().replace(/\s+/g, '_'),
    email,
    phone: '',
    bio: '',
    city: null,
    avatarInitial: name.charAt(0).toUpperCase(),
    avatarGradient: gradient,
    avatarUrl: '',
    interests: [],
    goals: [],
    socialLinks: { instagram: '', telegram: '', twitter: '' },
    level: 1,
    points: 0,
    nextLevelPoints: 500,
    karma: 0,
    karmaRank: 'Новичок',
    karmaEmoji: '🌱',
    checkins: 0,
    placesVisited: 0,
    friends: 0,
    joinedAt: new Date().toISOString(),
    authProvider: provider,
    isPrivate: false,
    ghostMode: false,
    hiddenFromUsers: [],
    hideCheckinHistory: false,
    isGoPlus: false,
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.isPrivate === undefined) parsed.isPrivate = false;
        if (parsed.ghostMode === undefined) parsed.ghostMode = false;
        if (parsed.hiddenFromUsers === undefined) parsed.hiddenFromUsers = [];
        if (parsed.hideCheckinHistory === undefined) parsed.hideCheckinHistory = false;
        if (parsed.isGoPlus === undefined) parsed.isGoPlus = false;
        // Migrate old hardcoded Almaty: treat as null if fresh user without interests
        if (parsed.city === 'Алматы' && parsed.interests?.length === 0) {
          parsed.city = null;
        }
        setAccessToken(storedToken);
        setUser(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  const saveUser = (u: UserProfile) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const login = async (provider: 'google' | 'email' | 'apple', data?: { email: string; password: string }) => {
    try {
      if (provider === 'email' && data) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-47c9cc4e/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` },
            body: JSON.stringify(data),
          }
        );
        const result = await response.json();
        if (result.error) throw new Error(result.error);
        const u = { ...createDefaultUser(result.user.name || data.email, data.email, provider), ...result.user };
        saveUser(u);
        setAccessToken(result.accessToken);
        localStorage.setItem('accessToken', result.accessToken);
      } else {
        const mockUser = createDefaultUser(
          provider === 'google' ? 'Алексей Иванов' : 'Пользователь Apple',
          provider === 'google' ? 'alexey.ivanov@gmail.com' : 'user@icloud.com',
          provider
        );
        saveUser(mockUser);
        const mockToken = 'mock_token_' + Date.now();
        setAccessToken(mockToken);
        localStorage.setItem('accessToken', mockToken);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-47c9cc4e/auth/signup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      const u = { ...createDefaultUser(data.name, data.email, 'email'), ...result.user };
      saveUser(u);
      setAccessToken(result.accessToken);
      localStorage.setItem('accessToken', result.accessToken);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    if (updates.name) updated.avatarInitial = updates.name.charAt(0).toUpperCase();
    saveUser(updated);
    if (accessToken) {
      try {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-47c9cc4e/users/profile`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
            body: JSON.stringify(updates),
          }
        );
      } catch {
        // silent — local update already applied
      }
    }
  };

  const setInterestsAndGoals = (interests: string[], goals: string[]) => {
    if (!user) return;
    const updated = { ...user, interests, goals };
    saveUser(updated);
    if (accessToken) updateProfile({ interests, goals });
  };

  const setUserCity = (city: string) => {
    if (!user) return;
    saveUser({ ...user, city });
    // Keep CityContext localStorage in sync
    const cityIdMap: Record<string, string> = {
      'Алматы': 'almaty',
      'Астана': 'astana',
    };
    const cityId = cityIdMap[city];
    if (cityId) localStorage.setItem('selected_city', cityId);
  };

  const toggleGhostMode = () => {
    if (!user) return;
    saveUser({ ...user, ghostMode: !user.ghostMode });
  };

  const togglePrivateAccount = () => {
    if (!user) return;
    saveUser({ ...user, isPrivate: !user.isPrivate });
  };

  const hideFromUser = (userId: string) => {
    if (!user) return;
    saveUser({ ...user, hiddenFromUsers: [...new Set([...user.hiddenFromUsers, userId])] });
  };

  const unhideFromUser = (userId: string) => {
    if (!user) return;
    saveUser({ ...user, hiddenFromUsers: user.hiddenFromUsers.filter(id => id !== userId) });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        accessToken,
        login,
        register,
        logout,
        updateProfile,
        setInterestsAndGoals,
        setUserCity,
        toggleGhostMode,
        togglePrivateAccount,
        hideFromUser,
        unhideFromUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('useUser must be used within a UserProvider');
  return context;
}
