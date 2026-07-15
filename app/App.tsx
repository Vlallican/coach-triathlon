import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import type { InitialState } from '@react-navigation/native';
import { useFonts as useSpaceGrotesk, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { useFonts as useSora, Sora_400Regular, Sora_500Medium, Sora_600SemiBold, Sora_700Bold } from '@expo-google-fonts/sora';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AuthScreen } from './src/screens/AuthScreen';
import { colors } from './src/theme/colors';
import { usePersistedState } from './src/hooks/usePersistedState';
import { STORAGE_KEYS } from './src/storage/keys';
import { AuthProvider, useAuth } from './src/lib/AuthContext';

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.card,
    border: colors.divider,
    text: colors.text,
    primary: colors.accent,
  },
};

function LoadingView() {
  return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
}

function AppGate({
  navState,
  setNavState,
}: {
  navState: InitialState | undefined;
  setNavState: (state: InitialState | undefined) => void;
}) {
  const { session, loading, seeding } = useAuth();

  if (loading || seeding) {
    return <LoadingView />;
  }

  if (!session) {
    return (
      <SafeAreaProvider>
        <AuthScreen />
        <StatusBar style="light" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme} initialState={navState} onStateChange={setNavState}>
        <RootNavigator />
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  const [spaceGroteskLoaded] = useSpaceGrotesk({
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });
  const [soraLoaded] = useSora({
    Sora_400Regular,
    Sora_500Medium,
    Sora_600SemiBold,
    Sora_700Bold,
  });

  const [navState, setNavState, navStateLoading] = usePersistedState<InitialState | undefined>(
    STORAGE_KEYS.navigationState,
    undefined
  );

  const fontsLoaded = spaceGroteskLoaded && soraLoaded;

  if (!fontsLoaded || navStateLoading) {
    return <LoadingView />;
  }

  return (
    <AuthProvider>
      <AppGate navState={navState} setNavState={setNavState} />
    </AuthProvider>
  );
}
