import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const TOKEN_KEY = 'auth_token';

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setTokenState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load token from AsyncStorage on mount
    useEffect(() => {
        loadToken();
    }, []);

    const loadToken = async () => {
        try {
            const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
            if (storedToken) {
                setTokenState(storedToken);
            }
        } catch (error) {
            console.error('Error loading token:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const setToken = async (newToken: string | null) => {
        try {
            if (newToken) {
                await AsyncStorage.setItem(TOKEN_KEY, newToken);
            } else {
                await AsyncStorage.removeItem(TOKEN_KEY);
            }
            setTokenState(newToken);
        } catch (error) {
            console.error('Error saving token:', error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
            setTokenState(null);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ token, setToken, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
