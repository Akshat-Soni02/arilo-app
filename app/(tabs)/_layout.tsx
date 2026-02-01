import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { useAppDispatch } from '../../store/hooks';
import { fetchNoteUsage } from '../../store/slices/noteSlice';

export default function TabLayout() {

    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? palette.dark : palette.light;
    const router = useRouter();
    const { user } = useAuth();
    const dispatch = useAppDispatch();

    const handleRecordPress = async () => {
        try {
            // First, check audio recording permission
            const { Audio } = await import('expo-av');
            const permissionResponse = await Audio.requestPermissionsAsync();

            if (!permissionResponse.granted) {
                Alert.alert(
                    'Permission Required',
                    'Microphone access is required to record audio notes. Please enable it in your device settings.',
                    [{ text: 'OK' }]
                );
                return;
            }

            // Then check usage limits
            const resultAction = await dispatch(fetchNoteUsage());
            if (fetchNoteUsage.fulfilled.match(resultAction)) {
                const usageData = resultAction.payload;
                if (usageData.status === 'REACHED') {
                    Alert.alert(
                        'Limit Reached',
                        'You have reached your daily or monthly note limit. Please upgrade your plan or wait for the limit to reset.'
                    );
                    return;
                }
            }

            // Only navigate if both permission and usage checks pass
            router.push('/record');
        } catch (error) {
            console.error('Failed to check permissions or usage limit:', error);
            // On error, still allow navigation (server will handle validation)
            router.push('/record');
        }
    };

    const MicTabButton = () => (
        <TouchableOpacity
            onPress={handleRecordPress}
            style={[styles.micWrapper]}
            activeOpacity={0.9}
        >
            <View style={[styles.micButton, { backgroundColor: colors.primary }]}>
                <Ionicons name="mic" size={30} color="white" />
            </View>

        </TouchableOpacity>
    );
    const ProfileHeader = () => (
        <View style={styles.profile}>
            {user?.photo ? (
                <Image
                    source={{ uri: user.photo }}
                    style={styles.avatar}
                />
            ) : (
                <View style={[styles.avatarFallback, { backgroundColor: colors.surface }]}>
                    <Ionicons
                        name="person"
                        size={18}
                        color={colors.text}
                    />
                </View>
            )}
            <Text style={[styles.greeting, { color: colors.text }]}>
                Hi, {user?.name?.split(' ')[0] || 'User'}
            </Text>
        </View>
    );
    return (
        <>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: [styles.tabBar, { backgroundColor: colors.surface }],
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textMuted,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="home" size={22} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="tasks"
                    options={{
                        title: 'Tasks',
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <Ionicons
                                name="checkbox"
                                size={22}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="record_trigger" // changed from 'record' to avoid conflict since /record is now in root
                    options={{
                        title: '',
                        tabBarButton: () => <MicTabButton />,
                    }}
                    listeners={() => ({
                        tabPress: (e) => {
                            // @ts-ignore
                            e.preventDefault(); // Prevent actual tab navigation
                            handleRecordPress();
                        },
                    })}
                />

                <Tabs.Screen
                    name="organize"
                    options={{
                        title: 'Organize',
                        tabBarIcon: ({ color }) => (
                            <Ionicons
                                name="folder"
                                size={22}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color }) => (
                            user?.photo ? (
                                <Image
                                    source={{ uri: user.photo }}
                                    style={{ width: 22, height: 22, borderRadius: 11 }}
                                />
                            ) : (
                                <Ionicons
                                    name="person"
                                    size={22}
                                    color={color}
                                />
                            )
                        ),
                    }}
                />

                {/* hidden */}
                <Tabs.Screen name="privacy" options={{ href: null }} />
                <Tabs.Screen name="tag-notes" options={{ href: null }} />
            </Tabs>

        </>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: 70,
        paddingBottom: 10,
        overflow: 'visible', // Ensure the elevated button isn't clipped
    },
    micWrapper: {
        top: -30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    micButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    avatarFallback: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    greeting: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '600',
    },
});