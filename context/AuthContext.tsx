import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { UserInfo } from '../store/slices/userSlice';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

interface AuthContextType {
    token: string | null;
    user: UserInfo | null;
    setAuthData: (token: string | null, user: UserInfo | null) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setTokenState] = useState<string | null>(null);
    const [user, setUserState] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load token and user from AsyncStorage on mount
    useEffect(() => {
        loadAuthData();
    }, []);

    const loadAuthData = async () => {
        try {
            const [storedToken, storedUser] = await Promise.all([
                AsyncStorage.getItem(TOKEN_KEY),
                AsyncStorage.getItem(USER_KEY)
            ]);

            if (storedToken) {
                setTokenState(storedToken);
            }

            if (storedUser) {
                setUserState(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Error loading auth data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const setAuthData = async (newToken: string | null, newUser: UserInfo | null) => {
        try {
            const promises = [];

            if (newToken) {
                promises.push(AsyncStorage.setItem(TOKEN_KEY, newToken));
            } else {
                promises.push(AsyncStorage.removeItem(TOKEN_KEY));
            }

            if (newUser) {
                promises.push(AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser)));
            } else {
                promises.push(AsyncStorage.removeItem(USER_KEY));
            }

            await Promise.all(promises);

            setTokenState(newToken);
            setUserState(newUser);
        } catch (error) {
            console.error('Error saving auth data:', error);
        }
    };

    const logout = async () => {
        try {
            await Promise.all([
                AsyncStorage.removeItem(TOKEN_KEY),
                AsyncStorage.removeItem(USER_KEY)
            ]);
            setTokenState(null);
            setUserState(null);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ token, user, setAuthData, logout, isLoading }}>
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
