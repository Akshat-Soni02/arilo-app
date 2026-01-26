import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchNotesByTag, Note } from '../../store/slices/tagSlice';

export default function TagNotesScreen() {
    const { tagId, tagName } = useLocalSearchParams<{ tagId: string; tagName: string }>();
    const dispatch = useAppDispatch();
    const { notes, notesLoading, error } = useAppSelector((state) => state.tags);

    useEffect(() => {
        if (tagId) {
            loadNotes();
        }
    }, [tagId]);

    const loadNotes = () => {
        if (tagId) {
            dispatch(fetchNotesByTag(tagId));
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const renderNote = ({ item }: { item: Note }) => (
        <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm">
            <View className="mb-2">
                <Text variant="bodyLarge" className="text-gray-800 leading-6">
                    {item.stt}
                </Text>
            </View>
            <View className="flex-row items-center justify-between">
                <Text variant="bodySmall" className="text-gray-400">
                    {formatDate(item.createdAt)}
                </Text>
                <Text variant="bodySmall" className="text-gray-400">
                    {formatTime(item.createdAt)}
                </Text>
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center py-12">
            <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
            <Text variant="bodyMedium" className="text-gray-400 mt-2 text-center px-8">
                No notes have been created with this tag yet
            </Text>
        </View>
    );

    return (
        <SafeAreaWrapper className="flex-1 bg-gray-50" edges={['top']}>
            {/* Header */}
            <View className="px-4 py-3 flex-row items-center bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.push('/organize')} className="p-2 mr-2">
                    <Ionicons name="arrow-back" size={24} color="#6B7280" />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text variant="bodySmall" className="text-gray-500">
                        Tag
                    </Text>
                    <Text variant="titleLarge" className="text-gray-800 font-bold">
                        {tagName || 'Notes'}
                    </Text>
                </View>
                <TouchableOpacity onPress={loadNotes} className="p-2">
                    <Ionicons name="refresh" size={24} color="#6B7280" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            {error ? (
                <View className="flex-1 items-center justify-center px-8">
                    <Ionicons name="alert-circle" size={64} color="#EF4444" />
                    <Text variant="titleMedium" className="text-gray-800 mt-4 text-center">
                        Failed to load notes
                    </Text>
                    <Text variant="bodyMedium" className="text-gray-500 mt-2 text-center">
                        {error}
                    </Text>
                    <TouchableOpacity
                        onPress={loadNotes}
                        className="mt-6 bg-orange-500 px-6 py-3 rounded-xl"
                    >
                        <Text variant="bodyLarge" className="text-white font-medium">
                            Try Again
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : notesLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#F97316" />
                    <Text variant="bodyMedium" className="text-gray-500 mt-4">
                        Loading notes...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={notes}
                    renderItem={renderNote}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingTop: 8,
                        paddingBottom: 20,
                        flexGrow: 1
                    }}
                    ListEmptyComponent={renderEmptyState}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaWrapper>
    );
}
