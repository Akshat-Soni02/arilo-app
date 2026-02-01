import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import icon from '../../assets/images/logo.png';
import { handleGoogleSignOut } from '../../components/button/GoogleButton';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import ThemeSelector from '../../components/ThemeSelector';
import { palette } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchNoteUsage } from '../../store/slices/noteSlice';


export default function Profile() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? palette.dark : palette.light;

    const dispatch = useAppDispatch();
    const { usage } = useAppSelector((state) => state.notes);

    useEffect(() => {
        dispatch(fetchNoteUsage());
    }, []);


    const onLogout = async () => {
        await handleGoogleSignOut(logout);
        router.replace('/login');
    };

    const openPrivacy = () => {
        Linking.openURL('https://arilo.in/#privacy');
    };

    const contactUs = () => {
        Linking.openURL('mailto:info@arilo.in');
    };

    const SettingItem = ({ icon, label, onPress, rightContent, color, iconBg }: {
        icon: string,
        label: string,
        onPress?: () => void,
        rightContent?: React.ReactNode,
        color?: string,
        iconBg?: string
    }) => (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-row items-center justify-between py-4 border-b"
            style={{ borderColor: colors.border }}
        >
            <View className="flex-row items-center flex-1">
                <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: iconBg || colors.iconBg }}
                >
                    <Ionicons name={icon as any} size={20} color={color || colors.text} />
                </View>
                <Text className="text-base font-medium" style={{ fontFamily: 'Montserrat-Medium', color: colors.text }}>
                    {label}
                </Text>
            </View>
            {rightContent || <Ionicons name="chevron-forward" size={18} color={colors.chevronColor} />}
        </TouchableOpacity>
    );

    const InfoCard = ({ icon, label, value }: { icon: string, label: string, value: string | number }) => (
        <Surface
            elevation={0}
            style={{
                width: '48%',
                borderRadius: 16,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 16,
            }}
        >
            <View className="mb-3">
                <Ionicons name={icon as any} size={24} color={colors.primary} />
            </View>
            <Text className="text-xs mb-1" style={{ fontFamily: 'Montserrat', color: colors.textMuted }}>{label}</Text>
            <Text className="text-lg font-bold" style={{ fontFamily: 'Montserrat-Bold', color: colors.text }}>{value}</Text>
        </Surface>
    );

    return (
        <SafeAreaWrapper className="flex-1" style={{ backgroundColor: colors.background }}>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 20 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View className="flex-row items-center justify-between mb-8">
                    <View className="flex-row items-center">
                        <View className="mr-4">
                            {user?.photo ? (
                                <Image
                                    source={{ uri: user.photo }}
                                    className="w-20 h-20 rounded-full bg-gray-100"
                                />
                            ) : (
                                <View className="w-20 h-20 rounded-full items-center justify-center" style={{ backgroundColor: colors.iconBg }}>
                                    <Ionicons name="person" size={32} color={colors.gray400} />
                                </View>
                            )}
                        </View>
                        <View>
                            <Text className="text-xl font-bold mb-1" style={{ fontFamily: 'Montserrat-Bold', color: colors.text }}>
                                {user?.name || 'User'}
                            </Text>
                            <Text className="text-sm" style={{ fontFamily: 'Montserrat', color: colors.textMuted }}>
                                {user?.email || 'Email not available'}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity className="p-2">
                        <Ionicons name="pencil-outline" size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Membership Banner */}
                {/* <TouchableOpacity activeOpacity={0.9} className="mb-8">
                    <Surface
                        elevation={0}
                        style={{
                            borderRadius: 16,
                            backgroundColor: '#1E1B2E', // Deep midnight purple-ish
                            overflow: 'hidden'
                        }}
                    >
                        <View className="flex-row items-center justify-between p-5">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 bg-white/10 rounded-lg items-center justify-center mr-4">
                                    <Ionicons name="star" size={20} color="#FBBF24" />
                                </View>
                                <View>
                                    <View className="flex-row items-center">
                                        <Text className="text-white font-bold text-base" style={{ fontFamily: 'Montserrat-Bold' }}>ARILO</Text>
                                        <View className="bg-white/20 px-2 py-0.5 rounded ml-2">
                                            <Text className="text-white text-[10px] font-bold">PASS</Text>
                                        </View>
                                    </View>
                                    <Text className="text-white/60 text-xs" style={{ fontFamily: 'Montserrat' }}>
                                        You are a {userInfo?.subscription?.planName || 'Free'} member
                                    </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="white" />
                        </View>
                    </Surface>
                </TouchableOpacity> */}

                {/* Usage Section */}
                <View className="mb-8">
                    <Text className="text-lg font-bold mb-4" style={{ fontFamily: 'Montserrat-Bold', color: colors.text }}>
                        Usage & Limits
                    </Text>
                    <View className="flex-row justify-between">
                        <InfoCard
                            icon="calendar-outline"
                            label="Daily Note Limit"
                            value={usage ? `${usage.dailyUsed}/${usage.dailyLimit == -1 ? 'Unlimited' : usage.dailyLimit}` : '0/0'}
                        />
                        <InfoCard
                            icon="layers-outline"
                            label="Monthly Note Limit"
                            value={usage ? `${usage.monthlyUsed}/${usage.monthlyLimit == -1 ? 'Unlimited' : usage.monthlyLimit}` : '0/0'}
                        />
                    </View>
                </View>

                {/* Appearance Section */}
                <View className="mb-8">
                    <Text className="text-lg font-bold mb-2" style={{ fontFamily: 'Montserrat-Bold', color: colors.text }}>
                        Appearance
                    </Text>
                    <Surface elevation={0} style={{ borderRadius: 16, backgroundColor: 'transparent' }}>
                        <ThemeSelector />
                    </Surface>
                </View>

                {/* Support Section */}
                <View className="mb-8">
                    <Text className="text-lg font-bold mb-2" style={{ fontFamily: 'Montserrat-Bold', color: colors.text }}>
                        Support
                    </Text>
                    <Surface elevation={0} style={{ borderRadius: 16, backgroundColor: 'transparent' }}>
                        <SettingItem
                            icon="mail-outline"
                            label="Contact us"
                            onPress={contactUs}
                            iconBg="#EEF2FF"
                            color="#6366F1"
                        />
                        <SettingItem
                            icon="shield-checkmark-outline"
                            label="Privacy Policy"
                            onPress={openPrivacy}
                            iconBg="#ECFDF5"
                            color="#10B981"
                        />
                    </Surface>
                </View>

                {/* More Section */}
                <View className="mb-8">
                    <Text className="text-lg font-bold mb-2" style={{ fontFamily: 'Montserrat-Bold', color: colors.text }}>
                        More
                    </Text>
                    <Surface elevation={0} style={{ borderRadius: 16, backgroundColor: 'transparent' }}>
                        <SettingItem
                            icon="log-out-outline"
                            label="Logout"
                            onPress={onLogout}
                            iconBg="#FEF2F2"
                            color="#EF4444"
                            rightContent={<View />} // No chevron for logout usually or keep it
                        />
                    </Surface>
                </View>

                {/* Version Info */}
                <View className="mt-4">
                    <Image source={icon} className="w-10 h-10" />
                    <Text className="text-xs mt-1" style={{ fontFamily: 'Montserrat', color: colors.textMuted }}>v1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaWrapper>
    );
}
