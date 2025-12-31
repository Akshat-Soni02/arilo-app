import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';

export default function DrawerMenu() {
    const navigation = useNavigation<DrawerNavigationProp<any>>();

    return (
        <View className="flex-row items-center px-2">
            <IconButton
                icon="menu"
                size={28}
                onPress={() => navigation.openDrawer()}
            />
        </View>
    );
}