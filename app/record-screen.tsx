import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native-paper";
import SafeAreaWrapper from "../components/safe-area-wrapper";

export default function RecordScreen() {
    return (
        <SafeAreaWrapper className="flex-1 bg-white">
            <View className="flex-row items-center">
                <Ionicons name="arrow-back" size={24} color="black" onPress={() => router.back()} />
            </View>
            <Text variant="headlineMedium" className="font-bold">Record Screen</Text>
        </SafeAreaWrapper>
    );
}
