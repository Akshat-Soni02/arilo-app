import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React, { useMemo } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { handleGoogleSignOut } from '../../components/button/GoogleButton';
import { palette } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearUserInfo } from '../../store/slices/userSlice';

const CustomDrawerContent = (props: any) => {
    const { bottom } = useSafeAreaInsets();
    const currentRoute = props.state.routes[props.state.index].name;
    const { logout } = useAuth();
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state) => state.user.userInfo);
    const tasks = useAppSelector((state) => state.tasks.tasks);

    // Calculate count of IN_PROGRESS tasks
    const inProgressCount = useMemo(() => {
        return tasks.filter(task => task.status === 'IN_PROGRESS').length;
    }, [tasks]);

    const handleLogout = async () => {
        // Sign out from Google
        await handleGoogleSignOut();

        // Clear user info from Redux
        dispatch(clearUserInfo());

        // Clear token and navigate to login
        await logout();

        router.replace('/login');
    };

    const menuItems = [
        { label: 'Home', icon: 'home-outline', route: '/' },
        { label: 'Organize', icon: 'folder-outline', route: 'organize' },
        { label: 'Tasks', icon: 'checkbox-outline', route: 'tasks' },
    ];

    const bottomItems = [
        { label: 'Settings', icon: 'settings-outline', route: 'settings' },
    ];

    return (
        <View className="flex-1 bg-background">
            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
                {/* Header / Quick Search */}
                <View className="px-6 pt-12 pb-6">
                    <View className="bg-quickSearchBg rounded-full h-12 flex-row items-center px-4">
                        <Ionicons name="search-outline" size={20} color={palette.light.textMuted} />
                        <Text className="text-gray-500 font-medium ml-2">Quick Search</Text>
                    </View>
                </View>

                {/* Main Menu Items */}
                <View className="px-2">
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.label}
                            className={`flex-row items-center px-4 py-3 mb-1 rounded-xl ${currentRoute === item.route ? 'bg-secondary' : 'transparent'}`}
                            onPress={() => router.navigate(item.route as any)}
                        >
                            <Ionicons name={item.icon as any} size={22} color={palette.light.primary} />
                            <Text variant="bodyLarge" className="ml-4 font-medium text-text">{item.label}</Text>
                            {/* Show task count for Tasks item */}
                            {item.route === 'tasks' && inProgressCount > 0 && (
                                <View className="ml-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: palette.light.primary }}>
                                    <Text variant="bodySmall" className="font-semibold" style={{ color: palette.light.textWhite }}>{inProgressCount}</Text>
                                </View>
                            )}
                            {/* Right Arrow */}
                            <View className="flex-1 items-end">
                                <Ionicons name="chevron-forward" size={18} color={palette.light.textMuted} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Divider */}
                <View className="h-[1px] bg-border mx-6 my-4" />

                {/* Bottom Menu Items */}
                <View className="px-2">
                    {bottomItems.map((item) => (
                        <TouchableOpacity
                            key={item.label}
                            className={`flex-row items-center px-4 py-3 mb-1 rounded-xl`}
                            onPress={() => router.navigate(item.route as any)}
                        >
                            <Ionicons name={item.icon as any} size={22} color={palette.light.primary} />
                            <Text variant="bodyLarge" className="ml-4 font-medium text-text">{item.label}</Text>
                            {/* Right Arrow */}
                            <View className="flex-1 items-end">
                                <Ionicons name="chevron-forward" size={18} color={palette.light.textMuted} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

            </DrawerContentScrollView>

            {/* Profile Footer */}
            <View className="px-6 pb-6 pt-4 border-t border-border flex-row items-center justify-between" style={{ marginBottom: bottom }}>
                <View className="flex-row items-center flex-1">
                    {userInfo?.photo ? (
                        <Image
                            source={{ uri: userInfo.photo }}
                            className="h-10 w-10 rounded-full mr-3"
                        />
                    ) : (
                        <View className="h-10 w-10 rounded-full bg-surface items-center justify-center mr-3">
                            <Ionicons name="person-outline" size={20} color={palette.light.text} />
                        </View>
                    )}
                    <Text variant="titleMedium" className="font-semibold text-text flex-1" numberOfLines={1}>
                        {userInfo?.name || 'Guest'}
                    </Text>
                </View>
                <TouchableOpacity onPress={handleLogout} className="ml-2">
                    <Ionicons name="log-out-outline" size={22} color={palette.light.textMuted} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default function DrawerLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerShown: false,
                    drawerType: 'slide',
                    drawerStyle: {
                        width: '80%',
                    },
                    overlayColor: 'rgba(0,0,0,0.5)',
                }}
            >
                <Drawer.Screen name="index" />
                {/* Define other screens to avoid navigation errors, even if they render the same component for now */}
                <Drawer.Screen name="tasks" options={{ drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="organize" options={{ drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="tag-notes" options={{ drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="query" options={{ drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="settings" options={{ drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="privacy" options={{ drawerItemStyle: { display: 'none' } }} />
            </Drawer>
        </GestureHandlerRootView>
    );
}
