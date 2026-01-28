import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '../constants/colors';

const LOADING_MESSAGES = [
    "Analyzing content...",
    "Generating insights...",
    "Almost there..."
];

interface SkeletonNoteCardProps {
    note?: {
        stt?: string | null;
        noteback?: string | null;
    };
}

export const SkeletonNoteCard = ({ note }: SkeletonNoteCardProps) => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View>
            <View className="bg-white rounded-3xl overflow-hidden" style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 5
            }}>
                <View className="p-5">
                    {/* Header with spinner */}
                    <View className="flex-row items-center mb-3">
                        <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: palette.light.primary + '10' }}>
                            <ActivityIndicator size="small" color={palette.light.primary} />
                        </View>
                        <Text variant="bodySmall" className="font-semibold" style={{ color: palette.light.primary }}>
                            Processing
                        </Text>
                    </View>

                    {/* Content Area - Show STT if available, else Skeleton */}
                    {note?.stt ? (
                        <Text variant="bodyLarge" className="text-gray-800 leading-6 mb-4">
                            {note.stt}
                        </Text>
                    ) : (
                        <View className="space-y-2 mb-4">
                            <View className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                            <View className="h-4 bg-gray-100 rounded w-full animate-pulse" />
                            <View className="h-4 bg-gray-100 rounded w-5/6 animate-pulse" />
                        </View>
                    )}

                    {/* Arilo Message Area - Show Noteback if available, else Loading Message */}
                    {note?.noteback ? (
                        <View className="rounded-2xl p-4" style={{ backgroundColor: '#FFF7ED' }}>
                            <View className="flex-row items-center mb-2">
                                <Ionicons name="sparkles" size={16} color={palette.light.primary} style={{ marginRight: 6 }} />
                                <Text variant="bodySmall" className="font-semibold" style={{ color: palette.light.primary }}>
                                    Arilo says:
                                </Text>
                            </View>
                            <Text variant="bodyMedium" className="text-gray-700 leading-5">
                                {note.noteback}
                            </Text>
                        </View>
                    ) : (
                        <View className="bg-orange-50 rounded-2xl p-4 flex-row items-center">
                            <Ionicons name="sparkles" size={16} color={palette.light.primary} style={{ marginRight: 8 }} />
                            <Text variant="bodyMedium" className="text-gray-600 italic">
                                {LOADING_MESSAGES[messageIndex]}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};
