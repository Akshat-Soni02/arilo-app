import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import { palette } from '../../constants/colors';
import { useColorScheme } from '../../hooks/use-color-scheme';

export default function RecordBtn() {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? palette.dark : palette.light;

    return (
        <View className="p-4 rounded-full box-shadow" style={{ backgroundColor: colors.primary }}>
            <Ionicons name="mic" size={28} color={colors.background} />
        </View>
    )
}
