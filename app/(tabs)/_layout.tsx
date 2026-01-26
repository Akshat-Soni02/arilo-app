import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '../../constants/colors';
import { useAppSelector } from '../../store/hooks';
import { useRouter } from 'expo-router';

export default function TabLayout() {

    const userInfo = useAppSelector((state) => state.user.userInfo);
    const router = useRouter();
    const [recordModalVisible, setRecordModalVisible] = useState(false);
    const MicTabButton = () => (
        <TouchableOpacity
            onPress={() => { router.push('/record') }}
            style={styles.micWrapper}
            activeOpacity={0.9}
        >
            <View style={styles.micButton}>
                <Ionicons name="mic" size={30} color="white" />
            </View>

        </TouchableOpacity>
    );
    const ProfileHeader = () => (
        <View style={styles.profile}>
            {userInfo?.photo ? (
                <Image
                    source={{ uri: userInfo.photo }}
                    style={styles.avatar}
                />
            ) : (
                <View style={styles.avatarFallback}>
                    <Ionicons
                        name="person"
                        size={18}
                        color={palette.light.text}
                    />
                </View>
            )}
            <Text style={styles.greeting}>
                Hi, {userInfo?.name?.split(' ')[0] || 'User'}
            </Text>
        </View>
    );
    return (
        <>
            <Tabs
                screenOptions={{
                    headerLeft: () => <ProfileHeader />,
                    headerTitleAlign: 'center',
                    tabBarStyle: styles.tabBar,
                    tabBarActiveTintColor: palette.light.primary,
                    tabBarInactiveTintColor:
                        palette.light.textMuted,
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
                    name="record"
                    options={{
                        title: '',
                        tabBarButton: () => <MicTabButton />,
                    }}

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
                    name="settings"
                    options={{
                        title: 'Settings',
                        tabBarIcon: ({ color }) => (
                            <Ionicons
                                name="settings"
                                size={22}
                                color={color}
                            />
                        ),
                    }}
                />

                {/* hidden */}
                <Tabs.Screen name="privacy" options={{ href: null }} />
                <Tabs.Screen name="tag-notes" options={{ href: null }} />
                <Tabs.Screen name="profile" options={{ href: null }} />
            </Tabs>

        </>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: 70,
        paddingBottom: 10,
        backgroundColor: '#fff',
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
        backgroundColor: palette.light.primary,
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
        backgroundColor: palette.light.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    greeting: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '600',
    },
});