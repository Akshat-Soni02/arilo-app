import { AudioModule } from "expo-audio";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import DrawerMenu from "../../components/drawer-menu";
import RecordingModal from "../../components/recording-modal";
import SafeAreaWrapper from "../../components/safe-area-wrapper";
import DateChip from "../../components/ui/date-chip";
import MemoryCard from "../../components/ui/memory-card";
import RecordBtn from "../../components/ui/record-btn";
import { usePermission } from "../../hooks/use-permission";

// Mock Data
const MOCK_MEMORIES = [
    {
        user: "Okay, the walk actually helped. I realized that the migration script wasn't handling the edge case where the user ID is null.",
        assistant: "Feeling overwhelmed is understandable. You've previously considered speaking up with David; finding that voice might help."
    },
    {
        user: "I need to remember to buy groceries later. Milk, eggs, and bread are on the list.",
        assistant: "Got it. Essentials: Milk, eggs, bread. Don't forget to check the expiration dates!"
    },
    {
        user: "Today was a bit rough. I felt disregarded in the meeting when I proposed the new architecture.",
        assistant: "It's tough when your ideas aren't immediately validated. Maybe set up a 1:1 with the tech lead to walk through the benefits in more detail?"
    },
    {
        user: "Just had a great idea for the app! animated gradients for the background.",
        assistant: "Animated gradients sound fantastic! They add a premium feel. Make sure to optimize for performance so it doesn't drain battery."
    }
];

export default function HomeScreen() {
    const [showRecordingModal, setShowRecordingModal] = useState(false);
    const { requestPermission } = usePermission(AudioModule.requestRecordingPermissionsAsync, {
        deniedMessage: "Microphone access is needed to record audio. Please enable it in your settings.",
        deniedTitle: "Microphone Permission Required"
    });

    const handleRecordPress = async () => {
        const hasPermission = await requestPermission();
        if (hasPermission) {
            setShowRecordingModal(true);
        }
    };

    const handleSaveRecording = (uri: string) => {
        console.log('Saving recording:', uri);
        // TODO: Implement save logic (upload to server, save locally, etc.)
        setShowRecordingModal(false);
    };

    return (
        <SafeAreaWrapper className="flex-1 bg-background" edges={['top']}>
            {/* Header */}
            <View className="px-4 py-2 flex-row items-center justify-between">
                <DrawerMenu />
                <DateChip date={new Date()} />
            </View>

            {/* Scrollable Content */}
            <ScrollView
                className="flex-1 px-4 pt-4"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {MOCK_MEMORIES.map((memory, index) => (
                    <MemoryCard
                        key={index}
                        userText={memory.user}
                        assistantText={memory.assistant}
                    />
                ))}
            </ScrollView>
        </SafeAreaWrapper>
    );
}
