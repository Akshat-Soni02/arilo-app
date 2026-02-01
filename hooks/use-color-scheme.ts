import { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { useAppSelector } from '../store/hooks';

export function useColorScheme(): 'light' | 'dark' {
    const themeMode = useAppSelector((state) => state.theme.mode);
    const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(
        Appearance.getColorScheme()
    );

    useEffect(() => {
        // Listen to system theme changes for instant updates
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setSystemTheme(colorScheme);
        });

        return () => subscription.remove();
    }, []);

    // If user selected a specific theme, use it; otherwise use system theme
    if (themeMode === 'light' || themeMode === 'dark') {
        return themeMode;
    }

    // Default to light if system theme is null
    return systemTheme === 'dark' ? 'dark' : 'light';
}
