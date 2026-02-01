import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import { palette } from '../../constants/colors';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchNotesByTag, Note } from '../../store/slices/tagSlice';

export default function TagNotesScreen() {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? palette.dark : palette.light;
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
        <View className="rounded-3xl overflow-hidden mb-4" style={{
            backgroundColor: colors.surface,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 5
        }}>
            {/* User Message */}
            <View className="p-5">
                <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: colors.primary + '20' }}>
                        <Ionicons name="mic" size={16} color={colors.primary} />
                    </View>
                </View>
                <Text variant="bodyLarge" className="leading-6 mb-2" style={{ color: colors.text }}>
                    {item.stt || 'No transcription available'}
                </Text>
                <View className="flex-row items-center justify-between mt-2">
                    <Text variant="bodySmall" style={{ color: colors.textMuted }}>
                        {formatDate(item.createdAt)}
                    </Text>
                    <Text variant="bodySmall" style={{ color: colors.textMuted }}>
                        {formatTime(item.createdAt)}
                    </Text>
                </View>
            </View>

            {/* AI Summary */}
            {item.noteback && (
                <View className="px-5 pb-5">
                    <View className="rounded-2xl p-4" style={{ backgroundColor: colors.warningBg }}>
                        <View className="flex-row items-center mb-2">
                            <Ionicons name="sparkles" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                            <Text variant="bodySmall" className="font-semibold" style={{ color: colors.primary }}>
                                Arilo says:
                            </Text>
                        </View>
                        <Text variant="bodyMedium" className="leading-5" style={{ color: colors.text }}>
                            {item.noteback}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center py-12">
            <Ionicons name="document-text-outline" size={64} color={colors.gray400} />
            <Text variant="bodyMedium" className="mt-2 text-center px-8" style={{ color: colors.textMuted }}>
                No notes have been created with this tag yet
            </Text>
        </View>
    );

    return (
        <SafeAreaWrapper className="flex-1" edges={['top']} style={{ backgroundColor: colors.background }}>
            {/* Header */}
            <View className="px-4 py-3 flex-row items-center border-b" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                <TouchableOpacity onPress={() => router.push('/organize')} className="p-2 mr-2">
                    <Ionicons name="arrow-back" size={24} color={colors.gray500} />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text variant="bodySmall" style={{ color: colors.textMuted }}>
                        Tag
                    </Text>
                    <Text variant="titleLarge" className="font-bold" style={{ color: colors.text }}>
                        {tagName || 'Notes'}
                    </Text>
                </View>
                <TouchableOpacity onPress={loadNotes} className="p-2">
                    <Ionicons name="refresh" size={24} color={colors.gray500} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            {error ? (
                <View className="flex-1 items-center justify-center px-8">
                    <Ionicons name="alert-circle" size={64} color={colors.error} />
                    <Text variant="titleMedium" className="mt-4 text-center" style={{ color: colors.text }}>
                        Failed to load notes
                    </Text>
                    <Text variant="bodyMedium" className="mt-2 text-center" style={{ color: colors.textMuted }}>
                        {error}
                    </Text>
                    <TouchableOpacity
                        onPress={loadNotes}
                        className="mt-6 px-6 py-3 rounded-xl"
                        style={{ backgroundColor: colors.primary }}
                    >
                        <Text variant="bodyLarge" className="font-medium" style={{ color: 'white' }}>
                            Try Again
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : notesLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text variant="bodyMedium" className="mt-4" style={{ color: colors.textMuted }}>
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
                        paddingBottom: 120,
                        flexGrow: 1
                    }}
                    ListEmptyComponent={renderEmptyState}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaWrapper>
    );
}
