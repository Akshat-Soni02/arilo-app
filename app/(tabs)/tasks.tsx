import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SectionList, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

import SafeAreaWrapper from '../../components/safe-area-wrapper';
import { palette } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteTask, fetchTasks, Task, TaskStatus, updateTask } from '../../store/slices/taskSlice';

export default function TaskScreen() {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? palette.dark : palette.light;
    const dispatch = useAppDispatch();
    const { tasks, loading, error } = useAppSelector((state) => state.tasks);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [areCompletedTasksExpanded, setAreCompletedTasksExpanded] = useState(false);
    const { user } = useAuth();


    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = () => {
        dispatch(fetchTasks(undefined));
    };

    const handleStatusToggle = async (task: Task) => {
        const newStatus: TaskStatus = task.status === 'DONE' ? 'IN_PROGRESS' : 'DONE';

        if (newStatus === 'DONE') {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        dispatch(updateTask({ taskId: task.id, updates: { status: newStatus } }));
    };

    const handleDeleteTask = async (taskId: string) => {
        dispatch(deleteTask(taskId));
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const isSameDay = (date1: Date, date2: Date) => {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    };

    const getDateLabel = (date: Date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (isSameDay(date, today)) {
            return 'Today';
        } else if (isSameDay(date, yesterday)) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    };

    const goToPreviousDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const goToNextDay = () => {
        const today = new Date();
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        // Don't allow going beyond today
        if (newDate <= today) {
            setSelectedDate(newDate);
        }
    };

    const isToday = () => {
        return isSameDay(selectedDate, new Date());
    };

    // Filter tasks based on search query and selected date
    const filteredBySearch = tasks.filter(task =>
        task.task.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredByDate = filteredBySearch.filter(task => {
        const taskDate = new Date(task.createdAt);
        return isSameDay(taskDate, selectedDate);
    });

    // Separate tasks by status
    // IN_PROGRESS tasks are shown from all dates (overall), not just the selected date
    const inProgressTasks = filteredByDate.filter(task => task.status === 'IN_PROGRESS');
    // DONE tasks are filtered by the selected date
    const doneTasks = filteredByDate.filter(task => task.status === 'DONE');

    const completedSectionData = (doneTasks.length > 3 && !areCompletedTasksExpanded)
        ? []
        : doneTasks;

    const sections = [
        {
            title: 'Active',
            data: inProgressTasks,
            totalCount: inProgressTasks.length
        },
        {
            title: 'Completed Tasks',
            data: completedSectionData,
            totalCount: doneTasks.length
        }
    ].filter(section => section.totalCount > 0);

    const renderTask = ({ item }: { item: Task }) => {
        const isDone = item.status === 'DONE';

        return (
            <View className="rounded-2xl p-4 mb-3 border shadow-sm" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>

                <View className="flex-row items-center">
                    {/* Checkbox */}
                    <TouchableOpacity
                        onPress={() => handleStatusToggle(item)}
                        className="mr-3"
                        activeOpacity={0.7}
                    >
                        <View
                            className={`w-6 h-6 rounded-lg border-2 items-center justify-center`}
                            style={{
                                backgroundColor: isDone ? colors.primary : 'transparent',
                                borderColor: isDone ? colors.primary : colors.gray300
                            }}
                        >
                            {isDone && <Ionicons name="checkmark" size={16} color="white" />}
                        </View>
                    </TouchableOpacity>

                    {/* Task Content */}
                    <View className="flex-1 mr-3">
                        <Text
                            variant="bodyLarge"
                            className="mb-1"
                            style={{
                                textDecorationLine: isDone ? 'line-through' : 'none',
                                opacity: isDone ? 0.5 : 1,
                                color: isDone ? colors.gray400 : colors.text,
                            }}
                        >
                            {item.task}
                        </Text>
                        <Text variant="bodySmall" style={{ color: colors.textMuted }}>
                            {formatTime(item.createdAt)}
                        </Text>
                    </View>

                    {/* Delete Button */}
                    <TouchableOpacity
                        onPress={() => handleDeleteTask(item.id)}
                        className="p-2"
                        activeOpacity={0.7}
                    >
                        <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center py-12">
            <Ionicons name="checkbox-outline" size={64} color={colors.gray400} />
            <Text variant="bodyMedium" className="mt-2 text-center px-8" style={{ color: colors.textMuted }}>
                {searchQuery
                    ? 'Try a different search term'
                    : `You are all caught up for ${getDateLabel(selectedDate)}, ${user?.name?.split(' ')[0]}`}
            </Text>
        </View>
    );

    const renderSectionHeader = ({ section: { title, totalCount } }: { section: { title: string, data: Task[], totalCount: number } }) => {
        const isExpandable = title === 'Completed Tasks' && totalCount > 3;

        if (isExpandable) {
            return (
                <TouchableOpacity
                    onPress={() => setAreCompletedTasksExpanded(!areCompletedTasksExpanded)}
                    className="mt-6 mb-4 px-1 flex-row items-center justify-between"
                    activeOpacity={0.7}
                >
                    <View className="flex-row items-center">
                        <Text variant="titleMedium" className="mr-2" style={{ fontFamily: 'EBGaramond-Bold', color: colors.text }}>
                            {title} <Text className="text-sm" style={{ fontFamily: 'EBGaramond', color: colors.textMuted }}>({totalCount})</Text>
                        </Text>
                        <Ionicons
                            name={areCompletedTasksExpanded ? "chevron-up" : "chevron-down"}
                            size={20}
                            color={colors.gray400}
                        />
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <View className="mt-6 mb-4 px-1">
                <Text variant="titleMedium" style={{ fontFamily: 'EBGaramond-Bold', color: colors.text }}>
                    {title} <Text className="text-sm" style={{ fontFamily: 'EBGaramond', color: colors.textMuted }}>({totalCount})</Text>
                </Text>
            </View>
        );
    };

    const taskCount = inProgressTasks.length + doneTasks.length;

    return (
        <SafeAreaWrapper className="flex-1" edges={['top']} style={{ backgroundColor: colors.background }}>
            {/* Header */}
            <View className="px-6 py-6 mt-12">
                <View className="items-start">
                    <Text variant="headlineMedium" className="mb-1" style={{ fontFamily: 'EBGaramond-Bold', color: colors.text }}>
                        Daily Journal
                    </Text>
                </View>
            </View>

            {/* Search Bar */}
            <View className="px-4 py-3">
                <View className="flex-row items-center rounded-xl px-4 py-3" style={{ backgroundColor: colors.gray100 }}>
                    <TextInput
                        placeholder="What's in your mind?"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-2"
                        placeholderTextColor={colors.placeholderText}
                        style={{ fontFamily: 'EBGaramond', color: colors.text }}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={colors.gray400} />
                        </TouchableOpacity>
                    )}
                    <View
                        className="ml-2 p-2 rounded-lg"
                        style={{ backgroundColor: colors.primary }}
                    >
                        <Ionicons name="search" size={20} color="white" />
                    </View>
                </View>
            </View>


            {/* Date Navigation */}
            <View className="px-4 py-3 border-b" style={{ borderColor: colors.border }}>
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={goToPreviousDay}
                        className="p-2"
                        activeOpacity={0.7}
                    >
                        <Ionicons name="chevron-back" size={24} color={colors.gray500} />
                    </TouchableOpacity>

                    <View className="items-center">
                        <Text variant="titleLarge" className="font-bold" style={{ color: colors.text }}>
                            {getDateLabel(selectedDate)}
                        </Text>
                        <Text variant="bodySmall" className="font-medium" style={{ color: colors.primary }}>
                            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={goToNextDay}
                        className="p-2"
                        activeOpacity={0.7}
                        disabled={isToday()}
                    >
                        <Ionicons
                            name="chevron-forward"
                            size={24}
                            color={isToday() ? colors.gray300 : colors.gray500}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            {error ? (
                <View className="flex-1 items-center justify-center px-8">
                    <Ionicons name="alert-circle" size={64} color={colors.error} />
                    <Text variant="titleMedium" className="mt-4 text-center" style={{ color: colors.text }}>
                        Failed to load tasks
                    </Text>
                    <Text variant="bodyMedium" className="mt-2 text-center" style={{ color: colors.textMuted }}>
                        {error}
                    </Text>
                    <TouchableOpacity
                        onPress={loadTasks}
                        className="mt-6 px-6 py-3 rounded-xl"
                        style={{ backgroundColor: colors.primary }}
                    >
                        <Text variant="bodyLarge" className="font-medium" style={{ color: 'white' }}>
                            Try Again
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text variant="bodyMedium" className="mt-4" style={{ color: colors.textMuted }}>
                        Loading tasks...
                    </Text>
                </View>
            ) : (
                <View className="flex-1">
                    <SectionList
                        sections={sections}
                        renderItem={renderTask}
                        renderSectionHeader={renderSectionHeader}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            paddingTop: 8,
                            paddingBottom: 20,
                            flexGrow: 1
                        }}
                        ListEmptyComponent={renderEmptyState}
                        ListHeaderComponent={() => (
                            inProgressTasks.length === 0 && doneTasks.length > 0 && !searchQuery ? (
                                <View className="items-center justify-center py-12">
                                    <Ionicons name="checkbox-outline" size={64} color={colors.gray400} />
                                    <Text variant="bodyMedium" className="mt-2 text-center px-8" style={{ color: colors.textMuted }}>
                                        You are all caught up for {getDateLabel(selectedDate)}, {user?.name?.split(' ')[0]}
                                    </Text>
                                </View>
                            ) : null
                        )}
                        showsVerticalScrollIndicator={false}
                        stickySectionHeadersEnabled={false}
                    />
                </View>
            )}
        </SafeAreaWrapper>
    );
}