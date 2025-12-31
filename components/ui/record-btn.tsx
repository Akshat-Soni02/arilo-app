import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

export default function RecordBtn() {
    return (
        <View className="p-4 rounded-full bg-gray-200">
            <Ionicons name="mic" size={24} color="black" />
        </View>
    )
}
