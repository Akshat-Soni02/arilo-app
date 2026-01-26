import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import logo from '../assets/images/logo.png';
import GoogleButton from '../components/button/GoogleButton';
import { palette } from '../constants/colors';
import { useColorScheme } from '../hooks/use-color-scheme';

export default function LoginScreen() {
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? palette.dark : palette.light;

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image
                    source={logo}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* App Name */}
            <Text
                variant="headlineLarge"
                style={[styles.appName, { color: themeColors.text }]}
            >
                Arilo
            </Text>

            {/* Tagline */}
            <Text
                variant="bodyLarge"
                style={[styles.tagline, { color: themeColors.textMuted }]}
            >
                Your personal voice journal
            </Text>

            {/* Google Sign In Button */}
            <View style={styles.buttonContainer}>
                <GoogleButton />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logoContainer: {
        marginBottom: 24,
    },
    logo: {
        width: 120,
        height: 120,
    },
    appName: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    tagline: {
        marginBottom: 48,
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 20,
    },
});
