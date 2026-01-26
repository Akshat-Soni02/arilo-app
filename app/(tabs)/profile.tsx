import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { handleGoogleSignOut } from '../../components/button/GoogleButton';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import { useAuth } from '../../context/AuthContext';
import { useAppSelector } from '../../store/hooks';
import { palette } from '../../constants/colors';

export default function Profile() {
    const { logout } = useAuth();
    const router = useRouter();
    const userInfo = useAppSelector((state) => state.user.userInfo);

    const onLogout = async () => {
        await handleGoogleSignOut(logout);
        router.replace('/login');
    };

    return (
        <SafeAreaWrapper className="flex-1 bg-white p-4">
            <View className="mt-auto mb-4">
                <Button
                    mode="outlined"
                    onPress={onLogout}
                    textColor={palette.light.primary}
                    icon="logout"
                    style={{ borderColor: palette.light.primary }}
                >
                    Logout
                </Button>
            </View>
        </SafeAreaWrapper>
    );
}