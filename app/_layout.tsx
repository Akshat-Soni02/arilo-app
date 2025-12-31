// Root layout of the app

import { DarkTheme as NavDarkTheme, DefaultTheme as NavDefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import 'react-native-reanimated';
import "../global.css";


import { useColorScheme } from '../hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(drawer)',
};


function StackScreens() {
  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="record-screen" options={{ headerShown: false }} />
    </Stack>
  );
}

function ProviderWrapper({ children }: { children: React.ReactNode }): React.ReactNode {
  const colorScheme = useColorScheme();

  const CombinedDefaultTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...NavDefaultTheme.colors,
    },
  };

  const CombinedDarkTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...NavDarkTheme.colors,
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
  return (
    <ProviderWrapper>
      <StackScreens />
      <StatusBar style="auto" />
    </ProviderWrapper>
  );
}
