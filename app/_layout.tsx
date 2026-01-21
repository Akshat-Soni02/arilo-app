// Root layout of the app

import { DarkTheme as NavDarkTheme, DefaultTheme as NavDefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { palette } from '../constants/colors';
import { AuthProvider } from '../context/AuthContext';
import { store } from '../store';

import 'react-native-reanimated';
import "../global.css";

import { Inter_400Regular, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '../hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();



export const unstable_settings = {
  anchor: '(drawer)',
};

function ProviderWrapper({ children }: { children: React.ReactNode }): React.ReactNode {
  const colorScheme = useColorScheme();

  const themeColors = colorScheme === 'dark' ? palette.dark : palette.light;

  const CombinedDefaultTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...NavDefaultTheme.colors,
      primary: themeColors.primary,
      btnHighlight: themeColors.btnHighlight,
      background: themeColors.background,
      surface: themeColors.surface,
      outline: themeColors.border,
      text: themeColors.text,
    },
  };

  const CombinedDarkTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...NavDarkTheme.colors,
      primary: themeColors.primary,
      btnHighlight: themeColors.btnHighlight,
      background: themeColors.background,
      surface: themeColors.surface,
      outline: themeColors.border,
      text: themeColors.text,
    },
  };

  const paperTheme = colorScheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;
  return (
    <ThemeProvider value={colorScheme === 'dark' ? NavDarkTheme : NavDefaultTheme}>
      <PaperProvider theme={paperTheme}>
        <SafeAreaProvider>
          {children}
        </SafeAreaProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
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
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="(drawer)" />
          </Stack>
          <StatusBar style="auto" />
        </ProviderWrapper>
      </Provider>
    </AuthProvider>
  );
}
