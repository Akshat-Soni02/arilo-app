// theme/useAppTheme.ts
import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
} from "@react-navigation/native";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { palette } from "../constants/colors";

export function useAppTheme(colorScheme: "light" | "dark") {
  const themeColors = colorScheme === "dark" ? palette.dark : palette.light;

  const base = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;
  const nav = colorScheme === "dark" ? NavDarkTheme : NavDefaultTheme;

  return {
    paper: {
      ...base,
      colors: {
        ...base.colors,
        ...nav.colors,
        primary: themeColors.primary,
        btnHighlight: themeColors.btnHighlight,
        background: themeColors.background,
        surface: themeColors.surface,
        outline: themeColors.border,
        text: themeColors.text,
      },
    },
    navigation: nav,
  };
}
