import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';    

export default function TabLayout() {

    
    const router = useRouter();
    const {user}= useAuth()
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
            {user?.photo ? (
                <Image
                    source={{ uri: user.photo }}
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
                Hi, {user?.name?.split(' ')[0] || 'User'}
            </Text>
        </View>
    );
    return (
        <>
            <Tabs
                screenOptions={{
                    headerShown: false,
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
                            router.push('/record');
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
        backgroundColor: '#fff',
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