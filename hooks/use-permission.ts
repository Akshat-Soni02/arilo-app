import { useCallback, useState } from 'react';
import { Alert, Linking } from 'react-native';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'loading';

interface PermissionResponse {
    granted: boolean;
    canAskAgain?: boolean;
    status?: string;
    [key: string]: any;
}

type PermissionRequester = () => Promise<PermissionResponse>;

interface UsePermissionOptions {
    /** 
     * Custom message to show when permission is denied. 
     * If not provided, a default message will be used.
     */
    deniedMessage?: string;
    /**
     * Title for the denied alert.
     */
    deniedTitle?: string;
}

/**
 * A generic hook to manage permissions.
 * 
 * @param requestPermissionFn The function to request permission (e.g. AudioModule.requestRecordingPermissionsAsync)
 * @param options Custom messages for alerts
 */
export function usePermission(
    requestPermissionFn: PermissionRequester,
    options: UsePermissionOptions = {}
) {
    const [status, setStatus] = useState<PermissionStatus>('undetermined');
    const [isLoading, setIsLoading] = useState(false);

    const requestPermission = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await requestPermissionFn();

            if (result.granted) {
                setStatus('granted');
                return true;
            } else {
                setStatus('denied');

                // Show alert if denied
                Alert.alert(
                    options.deniedTitle || "Permission Required",
                    options.deniedMessage || "This feature requires permission to access your device's capabilities. Please enable it in settings.",
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Open Settings",
                            onPress: () => Linking.openSettings()
                        }
                    ]
                );
                return false;
            }
        } catch (error) {
            console.error("Error requesting permission:", error);
            setStatus('denied');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [requestPermissionFn, options.deniedMessage, options.deniedTitle]);

    return {
        status,
        isLoading,
        requestPermission
    };
}
