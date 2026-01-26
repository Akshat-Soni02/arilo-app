import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { handleGoogleSignOut } from '../../components/button/GoogleButton';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import { useAuth } from '../../context/AuthContext';
import { palette } from '../../constants/colors';

export default function Setting() {
    const { logout } = useAuth();
    const router = useRouter();

    const onLogout = async () => {
        await handleGoogleSignOut(logout);
        router.replace('/login');
    };

    return (
        <SafeAreaWrapper className="flex-1 bg-white p-4">

            <View className="mt-auto mb-4">
                <Button
                    mode="contained"
                    onPress={onLogout}
                    buttonColor={palette.light.primary}
                    textColor="white"
                    icon="logout"
                >
                    Logout
                </Button>
            </View>
        </SafeAreaWrapper>
    );
}