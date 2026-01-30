// Root layout of the app

import { ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { store } from '../store';

import 'react-native-reanimated';
import "../global.css";

import {
  EBGaramond_400Regular,
  EBGaramond_500Medium,
  EBGaramond_600SemiBold,
  EBGaramond_700Bold,
} from '@expo-google-fonts/eb-garamond';
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '../hooks/use-color-scheme';
import { useAppTheme } from '../theme/useAppTheme';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function InitialLayout() {
  const { token, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (!token && segments[0] !== 'login') {
      // Redirect to login if not authenticated and not already on login page
      router.replace('/login');
    } else if (token && segments[0] === 'login') {
      // Redirect to home if authenticated and trying to access login page
      router.replace('/(tabs)');
    }
  }, [token, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="record"
        options={{
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          headerShown: false
        }}
      />
    </Stack>
  );
}

function ProviderWrapper({ children }: { children: React.ReactNode }): React.ReactNode {
  const colorScheme = useColorScheme();
  const theme = useAppTheme(colorScheme);

  return (
    <ThemeProvider value={theme.navigation}>
      <PaperProvider theme={theme.paper}>
        <SafeAreaProvider>
          {children}
        </SafeAreaProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Montserrat: Montserrat_400Regular,
    'Montserrat-Medium': Montserrat_500Medium,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Bold': Montserrat_700Bold,
    EBGaramond: EBGaramond_400Regular,
    'EBGaramond-Medium': EBGaramond_500Medium,
    'EBGaramond-SemiBold': EBGaramond_600SemiBold,
    'EBGaramond-Bold': EBGaramond_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Provider store={store}>
        <ProviderWrapper>
          <InitialLayout />
          <StatusBar style="auto" />
        </ProviderWrapper>
      </Provider>
    </AuthProvider>
  );
}
