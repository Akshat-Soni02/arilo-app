import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

export default function RecordBtn() {
    return (
        <View className="p-4 rounded-full bg-btnHighlight box-shadow">
            <Ionicons name="mic" size={28} color="#F5F2E9" />
        </View>
    )
}
