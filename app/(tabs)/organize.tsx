import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

import SafeAreaWrapper from '../../components/safe-area-wrapper';
import { palette } from '../../constants/colors';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createTag, fetchTags, Tag } from '../../store/slices/tagSlice';

export default function Organize() {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? palette.dark : palette.light;
    const dispatch = useAppDispatch();
    const { tags, loading, error } = useAppSelector((state) => state.tags);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagDescription, setNewTagDescription] = useState('');

    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = () => {
        dispatch(fetchTags());
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim()) {
            return;
        }

        try {
            await dispatch(createTag({
                name: newTagName.trim(),
                description: newTagDescription.trim()
            })).unwrap();
            setIsModalVisible(false);
            setNewTagName('');
            setNewTagDescription('');
        } catch (error) {
            console.error('Failed to create tag:', error);
        }
    };

    type FolderItem = Tag | { id: 'add-new'; isAddButton: true };

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const gridData: FolderItem[] = [
        { id: 'add-new', isAddButton: true },
        ...filteredTags
    ];

    const renderFolder = ({ item }: { item: FolderItem }) => {
        if ('isAddButton' in item) {
            return (
                <TouchableOpacity
                    className="rounded-2xl mt-6 ml-6 flex-1 items-center justify-center border-2 border-dashed"
                    style={{ minWidth: '20%', maxWidth: '25%', aspectRatio: 1, borderColor: colors.gray300 }}
                    activeOpacity={0.7}
                    onPress={() => setIsModalVisible(true)}
                >
                    <Ionicons name="add-circle-outline" size={32} color={colors.primary} />
                    <Text
                        variant="bodyMedium"
                        className="mt-1 text-center"
                        style={{ fontFamily: 'EBGaramond-Bold', color: colors.textMuted }}
                    >
                        Create
                    </Text>
                </TouchableOpacity>
            );
        }

        const tag = item as Tag;
        return (
            <TouchableOpacity
                className="rounded-2xl p-2 m-1 flex-1 items-center justify-center"
                style={{ minWidth: '30%', maxWidth: '32%', aspectRatio: 1 }}
                activeOpacity={0.7}
                onPress={() => {
                    router.push(`/tag-notes?tagId=${tag.tagId}&tagName=${encodeURIComponent(tag.name)}`);
                }}
            >
                <View className="items-center">
                    {/* Folder Icon */}
                    <Ionicons name="folder-open" size={40} color={colors.primary} />

                    {/* Tag Name */}
                    <Text
                        variant="bodyMedium"
                        className="mt-2 text-center"
                        numberOfLines={2}
                        style={{ fontFamily: 'EBGaramond-Bold', color: colors.text }}
                    >
                        {tag.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center py-12">
            <Ionicons name="folder-open-outline" size={64} color={colors.gray400} />
            <Text variant="titleMedium" className="mt-4" style={{ fontFamily: 'EBGaramond-Bold', color: colors.textMuted }}>
                No tags found
            </Text>
            <Text variant="bodyMedium" className="mt-2 text-center px-8" style={{ fontFamily: 'EBGaramond', color: colors.textMuted }}>
                {searchQuery
                    ? 'Try a different search term'
                    : 'Create your first tag to organize your tasks'}
            </Text>
        </View>
    );

    return (
        <SafeAreaWrapper className="flex-1" edges={['top']} style={{ backgroundColor: colors.background }}>
            {/* Header */}
            <View className="px-6 py-6 mt-12">
                <View className="items-start">
                    <Text variant="headlineMedium" className="mb-1" style={{ fontFamily: 'EBGaramond-Bold', color: colors.text }}>
                        Your Memories
                    </Text>
                </View>
            </View>

            {/* Search Bar */}
            <View className="px-4 py-3">
                <View className="flex-row items-center rounded-xl px-4 py-3" style={{ backgroundColor: colors.gray100 }}>
                    <TextInput
                        placeholder="Are you looking for something?"
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

            {/* Content */}
            {error ? (
                <View className="flex-1 items-center justify-center px-8">
                    <Ionicons name="alert-circle" size={64} color={colors.error} />
                    <Text variant="titleMedium" className="mt-4 text-center" style={{ color: colors.text }}>
                        Failed to load tags
                    </Text>
                    <Text variant="bodyMedium" className="mt-2 text-center" style={{ color: colors.textMuted }}>
                        {error}
                    </Text>
                    <TouchableOpacity
                        onPress={loadTags}
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
                        Loading tags...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={gridData}
                    renderItem={renderFolder}
                    keyExtractor={(item, index) => ('isAddButton' in item ? item.id : item.tagId)}
                    numColumns={3}
                    contentContainerStyle={{
                        paddingHorizontal: 4,
                        paddingTop: 4,
                        paddingBottom: 4,
                        flexGrow: 1
                    }}
                    columnWrapperStyle={{
                        justifyContent: 'flex-start'
                    }}
                    ListEmptyComponent={renderEmptyState}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Create Tag Modal */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View className="rounded-3xl p-6 mx-6 w-11/12 max-w-md" style={{ backgroundColor: colors.surface }}>
                        {/* Modal Header */}
                        <View className="flex-row items-center justify-between mb-4">
                            <Text variant="headlineSmall" className="font-bold" style={{ color: colors.text }}>
                                Create New Tag
                            </Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close" size={28} color={colors.gray500} />
                            </TouchableOpacity>
                        </View>

                        {/* Tag Name Input */}
                        <View className="mb-4">
                            <Text variant="bodyMedium" className="mb-2 font-medium" style={{ color: colors.text }}>
                                Tag Name *
                            </Text>
                            <TextInput
                                className="rounded-xl px-4 py-3"
                                style={{ backgroundColor: colors.gray100, color: colors.text }}
                                placeholder="Enter tag name"
                                placeholderTextColor={colors.placeholderText}
                                value={newTagName}
                                onChangeText={setNewTagName}
                                autoFocus={true}
                            />
                        </View>

                        {/* Tag Description Input */}
                        <View className="mb-6">
                            <Text variant="bodyMedium" className="mb-2 font-medium" style={{ color: colors.text }}>
                                Description
                            </Text>
                            <TextInput
                                className="rounded-xl px-4 py-3"
                                style={{ backgroundColor: colors.gray100, color: colors.text }}
                                placeholder="Enter description (optional)"
                                placeholderTextColor={colors.placeholderText}
                                value={newTagDescription}
                                onChangeText={setNewTagDescription}
                                multiline={true}
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                className="flex-1 rounded-xl py-3 items-center"
                                style={{ backgroundColor: colors.gray200 }}
                                onPress={() => {
                                    setIsModalVisible(false);
                                    setNewTagName('');
                                    setNewTagDescription('');
                                }}
                                activeOpacity={0.7}
                            >
                                <Text variant="bodyLarge" className="font-medium" style={{ color: colors.text }}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 rounded-xl py-3 items-center"
                                style={{ backgroundColor: colors.primary }}
                                onPress={handleCreateTag}
                                activeOpacity={0.7}
                                disabled={!newTagName.trim()}
                            >
                                <Text variant="bodyLarge" className="font-medium" style={{ color: 'white' }}>
                                    Create
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaWrapper>
    );
}