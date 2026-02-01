import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

interface ApiRequestOptions extends RequestInit {
    skipAuth?: boolean;
}

/**
 * Centralized API request handler that automatically handles token expiration
 * @param url - The API endpoint URL
 * @param options - Fetch options (method, headers, body, etc.)
 * @returns Response object
 * @throws Error if request fails or token is expired
 */
export async function apiRequest(url: string, options: ApiRequestOptions = {}): Promise<Response> {
    const { skipAuth = false, ...fetchOptions } = options;

    // Get token from AsyncStorage if not skipping auth
    let headers = { ...fetchOptions.headers };

    if (!skipAuth) {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
            headers = {
                ...headers,
                'Authorization': token,
            };
        }
    }

    // Make the request
    const response = await fetch(url, {
        ...fetchOptions,
        headers,
    });

    // Check for authentication errors (401 Unauthorized or 403 Forbidden)
    if (response.status === 401 || response.status === 403) {
        console.log('[apiClient] Token expired or unauthorized. Logging out...');

        // Clear auth data from AsyncStorage
        await Promise.all([
            AsyncStorage.removeItem(TOKEN_KEY),
            AsyncStorage.removeItem(USER_KEY),
        ]);

        // Navigate to login screen
        router.replace('/login');

        // Throw error to stop further processing
        throw new Error('Session expired. Please login again.');
    }

    return response;
}

/**
 * Helper to handle common API response patterns
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    return response.json();
}
