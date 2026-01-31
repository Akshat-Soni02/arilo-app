import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from 'react-native-paper';
import { CircularProgress } from '../../components/CircularProgress';
import SafeAreaWrapper from "../../components/safe-area-wrapper";
import { SkeletonNoteCard } from '../../components/SkeletonNoteCard';
import { palette } from '../../constants/colors';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchNotes, fetchNoteUsage, markNoteAsFailed, pollNoteStatus } from '../../store/slices/noteSlice';
export default function HomeScreen() {


    const dispatch = useAppDispatch();
    const { notes, loading, error, usage } = useAppSelector((state) => state.notes);
    const [refreshing, setRefreshing] = useState(false);

    const displayedNotes = notes
        .filter(note => note.status === 'COMPLETED' || note.status === 'PROCESSING')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    useEffect(() => {
        const processingNotes = notes.filter(note => note.status === 'PROCESSING');
        if (processingNotes.length > 0) {
            const interval = setInterval(() => {
                const now = new Date().getTime();

                processingNotes.forEach(note => {
                    const createdAt = new Date(note.createdAt).getTime();
                    const diffMinutes = (now - createdAt) / (1000 * 60);

                    if (diffMinutes > 3) {
                        if (note.jobId) {
                            dispatch(markNoteAsFailed(note.jobId));
                        }
                    } else if (note.jobId) {
                        dispatch(pollNoteStatus(note.jobId)).then((action) => {
                            if (pollNoteStatus.fulfilled.match(action)) {
                                const { data } = action.payload;
                                if (data.status === 'COMPLETED') {
                                    dispatch(fetchNoteUsage());
                                }
                            }
                        });
                    }
                });
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [notes, dispatch]);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = () => {
        dispatch(fetchNotes());
        dispatch(fetchNoteUsage());
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([
            dispatch(fetchNotes()),
            dispatch(fetchNoteUsage())
        ]);
        setRefreshing(false);
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

    const renderNoteCard = (note: any) => {
        // Show skeleton only if we have absolutely no data yet
        if (note.status === 'PROCESSING' && !note.stt && !note.noteback) {
            return <SkeletonNoteCard note={note} />;
        }
        return (
            <View className="bg-white rounded-3xl overflow-hidden" style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 5
            }}>
                {/* User Message */}
                <View className="p-5">
                    <View className="flex-row items-center mb-3">
                        <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: palette.light.primary + '20' }}>
                            <Ionicons name="mic" size={16} color={palette.light.primary} />
                        </View>
                    </View>
                    <Text variant="bodyLarge" className="text-gray-800 leading-6 mb-2">
                        {note.stt || 'No transcription available'}
                    </Text>
                    <View className="flex-row items-center justify-between mt-2">
                        <Text variant="bodySmall" className="text-gray-400">
                            {formatDate(note.createdAt)}
                        </Text>
                        <Text variant="bodySmall" className="text-gray-400">
                            {formatTime(note.createdAt)}
                        </Text>
                    </View>
                </View>

                {/* AI Summary */}
                {note.noteback && (
                    <View className="px-5 pb-5">
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
                    </View>
                )}
            </View>
        );
    };

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center py-20">
            <View className="w-20 h-20 rounded-full items-center justify-center mb-4" style={{ backgroundColor: palette.light.primary + '15' }}>
                <Ionicons name="mic-outline" size={40} color={palette.light.primary} />
            </View>
            <Text variant="titleMedium" className="text-gray-800 font-bold mb-2">
                No notes yet
            </Text>
            <Text variant="bodyMedium" className="text-gray-500 text-center px-8">
                Start recording to capture your thoughts and ideas
            </Text>
        </View>
    );

    const renderErrorState = () => (
        <View className="flex-1 items-center justify-center px-8">
            <View className="w-20 h-20 rounded-full items-center justify-center mb-4" style={{ backgroundColor: '#FEE2E2' }}>
                <Ionicons name="alert-circle" size={40} color="#EF4444" />
            </View>
            <Text variant="titleMedium" className="text-gray-800 font-bold mb-2 text-center">
                Failed to load notes
            </Text>
            <Text variant="bodyMedium" className="text-gray-500 mb-6 text-center">
                {error}
            </Text>
            <TouchableOpacity
                onPress={loadNotes}
                className="px-8 py-4 rounded-2xl"
                style={{ backgroundColor: palette.light.primary }}
            >
                <Text variant="bodyLarge" className="text-white font-semibold">
                    Try Again
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaWrapper className="flex-1" edges={['top']}>
            <View className="px-6">
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                        <View className="px-4 py-2 rounded-full" style={{ backgroundColor: palette.light.primary + '15' }}>
                            <Text variant="bodySmall" className="font-semibold" style={{ color: palette.light.primary, fontFamily: 'Inter_600SemiBold' }}>
                                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </Text>
                        </View>
                    </View>

                    {usage && (
                        <CircularProgress used={usage.dailyUsed} limit={usage.dailyLimit} />
                    )}
                </View>

                <View className="flex-col items-center justify-center">
                    <Text variant="headlineMedium" className="text-gray-800 font-bold mb-1 text-center" style={{ fontFamily: 'EBGaramond-Bold' }}>
                        Your Notes
                    </Text>
                    <Text variant="bodyMedium" className="text-gray-500 text-center">
                        {displayedNotes.length} {displayedNotes.length === 1 ? 'note' : 'notes'} captured
                    </Text>
                </View>
            </View>
            {error ? (
                renderErrorState()
            ) : loading && displayedNotes.length === 0 ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={palette.light.primary} />
                    <Text variant="bodyMedium" className="text-gray-500 mt-4">
                        Loading notes...
                    </Text>
                </View>
            ) : (
                <ScrollView
                    className="flex-1 px-4"
                    contentContainerStyle={{ paddingTop: 8, paddingBottom: 120, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[palette.light.primary]} />
                    }
                >
                    {displayedNotes.length === 0 ? (
                        renderEmptyState()
                    ) : (
                        displayedNotes.map((note) => (
                            <View key={note.jobId} style={{ marginBottom: 16 }}>
                                {renderNoteCard(note)}
                            </View>
                        ))
                    )}
                </ScrollView>
            )}
        </SafeAreaWrapper>
    );
}
