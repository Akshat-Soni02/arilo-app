import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CustomDrawerContent(props: any) {
    const insets = useSafeAreaInsets();
    const { state } = props;
    const activeRouteName = state.routeNames[state.index];

    const menuItems = [
        { name: 'index', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
        { name: 'task', label: 'Tasks', icon: 'list-outline', activeIcon: 'list' },
        { name: 'organize', label: 'Organize', icon: 'grid-outline', activeIcon: 'grid' },
        { name: 'setting', label: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
        { name: 'privacy', label: 'Privacy', icon: 'lock-closed-outline', activeIcon: 'lock-closed' },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {/* Header / Logo Section */}
            <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20, marginBottom: 20 }}>
                <Text variant="headlineSmall" className="font-bold text-blue-600">Arilo</Text>
            </View>

            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
                {menuItems.map((item) => {
                    const isActive = activeRouteName === item.name;
                    return (
                        <TouchableOpacity
                            key={item.name}
                            onPress={() => router.push((item.name === 'index' ? '/' : `/${item.name}`) as any)}
                            className={`flex-row items-center mx-3 my-1 p-3 rounded-xl ${isActive ? 'bg-blue-50' : 'bg-transparent'}`}
                        >
                            <Ionicons
                                name={(isActive ? item.activeIcon : item.icon) as any}
                                size={22}
                                color={isActive ? '#3b82f6' : '#6b7280'}
                            />
                            <Text
                                variant="bodyLarge"
                                className={`ml-4 font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </DrawerContentScrollView>

            {/* Bottom Profile Section */}
            <TouchableOpacity
                onPress={() => router.push('/profile')}
                style={{
                    paddingBottom: insets.bottom + 20,
                    paddingTop: 16,
                    paddingHorizontal: 16,
                    borderTopWidth: 1,
                    borderTopColor: '#f3f4f6',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
                    <Ionicons name="person" size={24} color="#3b82f6" />
                </View>
                <View className="ml-4 flex-1">
                    <Text variant="bodyLarge" className="font-bold">Akshat Soni</Text>
                    <Text variant="bodySmall" className="text-gray-500">View Profile</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </TouchableOpacity>
        </View>
    );
}

export default function DrawerLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{ headerShown: false }}
            >
                <Drawer.Screen
                    name="index"
                    options={{
                        drawerLabel: 'Home',
                        title: 'Project X',
                    }}
                />
                <Drawer.Screen
                    name="task"
                    options={{
                        drawerLabel: 'Tasks',
                        title: 'Task',
                    }}
                />
                <Drawer.Screen
                    name="organize"
                    options={{
                        drawerLabel: 'Organize',
                        title: 'Organize',
                    }}
                />
                <Drawer.Screen
                    name="setting"
                    options={{
                        drawerLabel: 'Settings',
                        title: 'Setting',
                    }}
                />
                <Drawer.Screen
                    name="privacy"
                    options={{
                        drawerLabel: 'Privacy',
                        title: 'Privacy',
                    }}
                />
                <Drawer.Screen
                    name="profile"
                    options={{
                        drawerLabel: 'Profile',
                        title: 'Profile',
                        drawerItemStyle: { display: 'none' }
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
