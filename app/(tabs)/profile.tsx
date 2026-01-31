import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import icon from '../../assets/images/logo.png';
import { handleGoogleSignOut } from '../../components/button/GoogleButton';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import { palette } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
    const { user,logout } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();

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

    const SettingItem = ({ icon, label, onPress, rightContent, color = "#2d2d2d", iconBg = "#f3f4f6" }: {
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
            className="flex-row items-center justify-between py-4 border-b border-gray-50"
        >
            <View className="flex-row items-center flex-1">
                <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: iconBg }}
                >
                    <Ionicons name={icon as any} size={20} color={color} />
                </View>
                <Text className="text-base font-medium text-[#2d2d2d]" style={{ fontFamily: 'Montserrat-Medium' }}>
                    {label}
                </Text>
            </View>
            {rightContent || <Ionicons name="chevron-forward" size={18} color="#9ca3af" />}
        </TouchableOpacity>
    );

    const InfoCard = ({ icon, label, value }: { icon: string, label: string, value: string | number }) => (
        <Surface
            elevation={0}
            style={{
                width: '48%',
                borderRadius: 16,
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#f3f4f6',
                padding: 16,
            }}
        >
            <View className="mb-3">
                <Ionicons name={icon as any} size={24} color={palette.light.primary} />
            </View>
            <Text className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Montserrat' }}>{label}</Text>
            <Text className="text-lg font-bold text-[#2d2d2d]" style={{ fontFamily: 'Montserrat-Bold' }}>{value}</Text>
        </Surface>
    );

    return (
        <SafeAreaWrapper className="flex-1 bg-white">
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
                                <View className="w-20 h-20 rounded-full bg-[#f3f4f6] items-center justify-center">
                                    <Ionicons name="person" size={32} color="#9ca3af" />
                                </View>
                            )}
                        </View>
                        <View>
                            <Text className="text-xl font-bold text-[#2d2d2d] mb-1" style={{ fontFamily: 'Montserrat-Bold' }}>
                                {user?.name || 'User'}
                            </Text>
                            <Text className="text-sm text-gray-400" style={{ fontFamily: 'Montserrat' }}>
                                {user?.email || 'Email not available'}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity className="p-2">
                        <Ionicons name="pencil-outline" size={20} color="#2d2d2d" />
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
                    <Text className="text-lg font-bold text-[#2d2d2d] mb-4" style={{ fontFamily: 'Montserrat-Bold' }}>
                        Usage & Limits
                    </Text>
                    <View className="flex-row justify-between">
                        <InfoCard
                            icon="calendar-outline"
                            label="Daily Note Limit"
                            value={user?.subscription?.noteDailyLimit ?? 0}
                        />
                        <InfoCard
                            icon="layers-outline"
                            label="Monthly Note Limit"
                            value={user?.subscription?.noteMonthlyLimit ?? 0}
                        />
                    </View>
                </View>

                {/* Support Section */}
                <View className="mb-8">
                    <Text className="text-lg font-bold text-[#2d2d2d] mb-2" style={{ fontFamily: 'Montserrat-Bold' }}>
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
                    <Text className="text-lg font-bold text-[#2d2d2d] mb-2" style={{ fontFamily: 'Montserrat-Bold' }}>
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
                    <Text className="text-xs text-gray-300 mt-1" style={{ fontFamily: 'Montserrat' }}>v1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaWrapper>
    );
}
