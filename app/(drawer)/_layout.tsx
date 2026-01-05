import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '../../constants/colors';

const CustomDrawerContent = (props: any) => {
    const { bottom } = useSafeAreaInsets();
    const currentRoute = props.state.routes[props.state.index].name;

    const menuItems = [
        { label: 'Organize', icon: 'folder-outline', route: 'index' },
        { label: 'Tasks', icon: 'checkbox-outline', route: 'tasks' },
        { label: 'Strong Query', icon: 'search-outline', route: 'query' },
    ];

    const bottomItems = [
        { label: 'Settings', icon: 'settings-outline', route: 'settings' },
        { label: 'Privacy', icon: 'document-text-outline', route: 'privacy' },
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
                            onPress={() => router.navigate(item.route)}
                        >
                            <Ionicons name={item.icon as any} size={22} color={palette.light.text} />
                            <Text variant="bodyLarge" className="ml-4 font-medium text-text">{item.label}</Text>
                            {/* Right Icon for top items */}
                            <View className="flex-1 items-end">
                                <Ionicons name={item.icon === 'folder-outline' ? 'albums-outline' : item.icon === 'checkbox-outline' ? 'list-outline' : 'search'} size={18} color={palette.light.text} />
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
                            onPress={() => router.navigate(item.route)}
                        >
                            <Ionicons name={item.icon as any} size={22} color={palette.light.text} />
                            <Text variant="bodyLarge" className="ml-4 font-medium text-text">{item.label}</Text>
                            <View className="flex-1 items-end">
                                <Ionicons name={item.icon === 'settings-outline' ? 'cog-outline' : 'file-tray-full-outline'} size={18} color={palette.light.text} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

            </DrawerContentScrollView>

            {/* Profile Footer */}
            <View className="px-6 pb-6 pt-4 border-t border-border flex-row items-center justify-between" style={{ marginBottom: bottom }}>
                <View className="flex-row items-center">
                    <View className="h-10 w-10 rounded-full bg-surface items-center justify-center mr-3">
                        <Ionicons name="person-outline" size={20} color={palette.light.text} />
                    </View>
                    <Text variant="titleMedium" className="font-semibold text-text">Name</Text>
                </View>
                <Ionicons name="ellipsis-horizontal" size={20} color={palette.light.textMuted} />
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
                <Drawer.Screen name="query" options={{ drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="settings" options={{ drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="privacy" options={{ drawerItemStyle: { display: 'none' } }} />
            </Drawer>
        </GestureHandlerRootView>
    );
}
