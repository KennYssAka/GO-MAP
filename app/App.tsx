import { useState, useCallback } from 'react';
import { Onboarding } from '@/app/components/Onboarding';
import { MapScreen } from '@/app/components/MapScreen';
import { ProfilePage } from '@/app/components/profile/ProfilePage';
import { EventsScreen } from '@/app/components/EventsScreen';
import { KarmaScreen } from '@/app/components/KarmaScreen';
import { MatchPage } from '@/app/components/match/MatchPage';
import { MessagesScreen } from '@/app/components/MessagesScreen';
import { FriendsScreen } from '@/app/components/FriendsScreen';
import { FriendProfileScreen } from '@/app/components/FriendProfileScreen';
import { FeedScreen } from '@/app/components/FeedScreen';
import { BottomNav } from '@/app/components/BottomNav';
import { AuthScreen } from '@/app/components/AuthScreen';
import { KarmaToastContainer } from '@/app/components/KarmaToast';
import { UserProvider, useUser } from '@/app/components/UserContext';
import { WeatherProvider } from '@/app/components/WeatherContext';
import { FriendsProvider } from '@/app/components/FriendsContext';
import { CityProvider } from '@/app/components/CityContext';
import { GeolocationProvider } from '@/app/components/GeolocationContext';
import { KarmaProvider } from '@/app/components/KarmaContext';
import { ThemeProvider } from '@/app/components/ThemeContext';
import { O2OScreen } from '@/app/components/O2OScreen';
import { AchievementsScreen } from '@/app/components/AchievementsScreen';
import { SubscriptionScreen } from '@/app/components/SubscriptionScreen';
import { AppearanceScreen } from '@/app/components/AppearanceScreen';
import { SettingsScreen } from '@/app/components/SettingsScreen';
import type { Person } from '@/app/components/FriendsContext';

// 'vibematch' removed — replaced by 'match'
export type Screen =
  | 'auth'
  | 'onboarding'
  | 'map'
  | 'feed'
  | 'events'
  | 'karma'
  | 'match'
  | 'messages'
  | 'profile'
  | 'friends'
  | 'friendProfile'
  | 'o2o'
  | 'achievements'
  | 'subscription'
  | 'appearance'
  | 'settings';

// Screens that should NOT show the bottom nav
const HIDE_NAV_SCREENS: Screen[] = [
  'onboarding',
  'friends',
  'friendProfile',
  'karma',
  'o2o',
  'achievements',
  'subscription',
  'appearance',
  'settings',
];

function AppContent() {
  const { user, isAuthenticated, setInterestsAndGoals, logout } = useUser();
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [focusFriendOnMap, setFocusFriendOnMap] = useState<Person | null>(null);
  const [chatWithPerson, setChatWithPerson] = useState<Person | null>(null);
  const [viewingFriendProfile, setViewingFriendProfile] = useState<Person | null>(null);
  const [friendProfileOrigin, setFriendProfileOrigin] = useState<Screen>('friends');

  const handleAuthComplete = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = (interests: string[], goals: string[]) => {
    setInterestsAndGoals(interests, goals);
    setCurrentScreen('map');
  };

  const handleLogout = () => {
    logout();
    setCurrentScreen('auth');
  };

  const handleViewFriendOnMap = useCallback((person: Person) => {
    setFocusFriendOnMap(person);
    setViewingFriendProfile(null);
    setCurrentScreen('map');
  }, []);

  const handleMessageFriend = useCallback((person: Person) => {
    setChatWithPerson(person);
    setViewingFriendProfile(null);
    setCurrentScreen('messages');
  }, []);

  const handleOpenFriendProfile = useCallback((person: Person, origin?: Screen) => {
    setViewingFriendProfile(person);
    setFriendProfileOrigin(origin || currentScreen);
    setCurrentScreen('friendProfile');
  }, [currentScreen]);

  // Auth gate
  if (!isAuthenticated || currentScreen === 'auth') {
    return <AuthScreen onAuthComplete={handleAuthComplete} />;
  }

  // Onboarding gate — also triggers if city is null (fresh user that got past auth)
  if (currentScreen === 'onboarding' || (isAuthenticated && user?.city === null)) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const showNav = !HIDE_NAV_SCREENS.includes(currentScreen);

  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex flex-col">
      <KarmaToastContainer />

      {/* ── Screens ── */}
      {currentScreen === 'map' && (
        <MapScreen
          focusFriend={focusFriendOnMap}
          onClearFocusFriend={() => setFocusFriendOnMap(null)}
          onMessageFriend={handleMessageFriend}
          onViewFriendProfile={(p) => handleOpenFriendProfile(p, 'map')}
          onNavigateToProfile={() => setCurrentScreen('profile')}
          onOpenO2O={() => setCurrentScreen('o2o')}
          onOpenAchievements={() => setCurrentScreen('achievements')}
          onOpenSubscription={() => setCurrentScreen('subscription')}
          onOpenKarma={() => setCurrentScreen('karma')}
          onOpenCommunities={() => setCurrentScreen('messages')}
        />
      )}

      {currentScreen === 'feed' && (
        <FeedScreen onOpenProfile={(p) => handleOpenFriendProfile(p, 'feed')} />
      )}

      {currentScreen === 'events' && <EventsScreen />}

      {currentScreen === 'karma' && (
        <KarmaScreen onBack={() => setCurrentScreen('profile')} />
      )}

      {currentScreen === 'match' && <MatchPage />}

      {currentScreen === 'messages' && (
        <MessagesScreen
          initialChatPerson={chatWithPerson}
          onClearInitialChat={() => setChatWithPerson(null)}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfilePage
          onLogout={handleLogout}
          onOpenFriends={() => setCurrentScreen('friends')}
          onOpenKarma={() => setCurrentScreen('karma')}
          onOpenO2O={() => setCurrentScreen('o2o')}
          onOpenAchievements={() => setCurrentScreen('achievements')}
          onOpenSubscription={() => setCurrentScreen('subscription')}
          onOpenAppearance={() => setCurrentScreen('appearance')}
          onOpenSettings={() => setCurrentScreen('settings')}
        />
      )}

      {currentScreen === 'friends' && (
        <FriendsScreen
          onBack={() => setCurrentScreen('profile')}
          onViewOnMap={handleViewFriendOnMap}
          onMessage={handleMessageFriend}
          onViewProfile={(p) => handleOpenFriendProfile(p, 'friends')}
        />
      )}

      {currentScreen === 'friendProfile' && viewingFriendProfile && (
        <FriendProfileScreen
          person={viewingFriendProfile}
          onBack={() => {
            setViewingFriendProfile(null);
            setCurrentScreen(friendProfileOrigin);
          }}
          onMessage={handleMessageFriend}
          onViewOnMap={handleViewFriendOnMap}
        />
      )}

      {currentScreen === 'o2o' && (
        <O2OScreen onBack={() => setCurrentScreen('profile')} />
      )}

      {currentScreen === 'achievements' && (
        <AchievementsScreen onBack={() => setCurrentScreen('profile')} />
      )}

      {currentScreen === 'subscription' && (
        <SubscriptionScreen onBack={() => setCurrentScreen('profile')} />
      )}

      {currentScreen === 'appearance' && (
        <AppearanceScreen onBack={() => setCurrentScreen('profile')} />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen
          onBack={() => setCurrentScreen('profile')}
          onOpenAppearance={() => setCurrentScreen('appearance')}
          onOpenSubscription={() => setCurrentScreen('subscription')}
          onLogout={handleLogout}
        />
      )}

      {showNav && (
        <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <WeatherProvider>
        <CityProvider>
          <GeolocationProvider>
            <KarmaProvider>
              <FriendsProvider>
                <ThemeProvider>
                  <AppContent />
                </ThemeProvider>
              </FriendsProvider>
            </KarmaProvider>
          </GeolocationProvider>
        </CityProvider>
      </WeatherProvider>
    </UserProvider>
  );
}
