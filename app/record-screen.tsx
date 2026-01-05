import { Ionicons } from "@expo/vector-icons";
import { RecordingPresets, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import SafeAreaWrapper from "../components/safe-area-wrapper";
import { palette } from "../constants/colors";

const VISUALIZER_BARS = 7;

export default function RecordScreen() {
    const params = useLocalSearchParams();
    const audioRecorder = useAudioRecorder({
        ...RecordingPresets.HIGH_QUALITY,
        isMeteringEnabled: true,
    });
    const recorderState = useAudioRecorderState(audioRecorder, 60);
    const [hasAutoStarted, setHasAutoStarted] = useState(false);

    // Shared value for smooth animations
    const meteringValue = useSharedValue(0);

    const startRecording = async () => {
        try {
            await setAudioModeAsync({
                playsInSilentMode: true,
                allowsRecording: true,
            });

            if (audioRecorder.isRecording) return;

            console.log('Starting recording..');
            await audioRecorder.prepareToRecordAsync();
            audioRecorder.record();
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
            Alert.alert("Error", "Failed to start recording");
        }
    };

    const stopAndDiscard = async () => {
        if (recorderState.isRecording) {
            await audioRecorder.stop();
        }
        router.back();
    };

    const stopAndSave = async () => {
        if (recorderState.isRecording) {
            await audioRecorder.stop();
        }

        // Dummy API Call Simulation
        console.log('Saving recording...');
        // In a real app, we would upload audioRecorder.uri here

        setTimeout(() => {
            console.log('Saved!');
            router.replace('/');
        }, 500);
    };

    // Auto-start logic
    useEffect(() => {
        if (params.autostart === 'true' && !hasAutoStarted) {
            setHasAutoStarted(true);
            startRecording();
        }
    }, [params.autostart]);

    // Sync metering to shared value for smooth animations
    useEffect(() => {
        if (recorderState.isRecording) {
            const value = recorderState.metering ?? -160;
            const normalized = Math.max(0, (value + 60) / 60);
            meteringValue.value = withSpring(normalized, { damping: 10, stiffness: 150 });
        } else {
            meteringValue.value = withSpring(0);
        }
    }, [recorderState.metering, recorderState.isRecording]);

    const renderBar = (index: number) => {
        const animatedStyle = useAnimatedStyle(() => {
            const factor = 1 - Math.abs(index - (VISUALIZER_BARS - 1) / 2) / (VISUALIZER_BARS / 2);
            const height = 40 + (meteringValue.value * 160 * factor);
            return {
                height: height,
            };
        });

        return (
            <Animated.View
                key={index}
                className="w-10 rounded-full bg-visualizerActive"
                style={[{ opacity: 0.5 + (0.5 * (index / VISUALIZER_BARS)) }, animatedStyle]}
            />
        );
    };

    return (
        <SafeAreaWrapper className="flex-1 bg-background items-center justify-between py-12">

            {/* Visualizer Area (Centered) */}
            <View className="flex-1 items-center justify-center flex-row space-x-3">
                {Array.from({ length: VISUALIZER_BARS }).map((_, i) => renderBar(i))}
            </View>

            {/* Bottom Controls */}
            <View className="flex-row items-center justify-between w-full px-12 mb-8">
                {/* Cancel Button */}
                <TouchableOpacity
                    onPress={stopAndDiscard}
                    className="w-16 h-16 rounded-full bg-surface items-center justify-center border border-border"
                    activeOpacity={0.7}
                >
                    <Ionicons name="close" size={32} color={palette.light.text} />
                </TouchableOpacity>

                {/* Stop Button (Center - Optional, but keeping it as a visual anchor or distinct action could be nice. 
                     The user said "Done button and an cancel button on left". 
                     The design usually has a stop/done flow. Let's make the Right button the primary 'Done' action) 
                  */}

                {/* Done Button */}
                <TouchableOpacity
                    onPress={stopAndSave}
                    className="w-20 h-20 rounded-full bg-stopBtn items-center justify-center shadow-lg"
                    activeOpacity={0.8}
                >
                    <View className="w-8 h-8 bg-background rounded-sm" />
                </TouchableOpacity>
            </View>

        </SafeAreaWrapper>
    );
}
