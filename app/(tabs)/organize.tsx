import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

import SafeAreaWrapper from '../../components/safe-area-wrapper';
import { palette } from '../../constants/colors';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createTag, fetchTags, Tag } from '../../store/slices/tagSlice';

export default function Organize() {
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

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderFolder = ({ item }: { item: Tag }) => (
        <TouchableOpacity
            className="bg-white rounded-2xl p-5 m-2 border border-gray-100 shadow-sm flex-1"
            style={{ minWidth: '45%', maxWidth: '48%' }}
            activeOpacity={0.7}
            onPress={() => {
                router.push({
                    pathname: '/tag-notes',
                    params: { tagId: item.id, tagName: item.name }
                });
            }}
        >
            <View className="items-center">
                {/* Folder Icon */}
                <Ionicons name="folder" size={64} color={palette.light.primary} />

                {/* Tag Name */}
                <Text
                    variant="bodyLarge"
                    className="text-gray-800 font-medium mt-3 text-center"
                    numberOfLines={2}
                >
                    {item.name}
                </Text>

                {/* Optional: Creation Date */}
                <Text variant="bodySmall" className="text-gray-400 mt-1">
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    })}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center py-12">
            <Ionicons name="folder-open-outline" size={64} color="#9CA3AF" />
            <Text variant="titleMedium" className="text-gray-500 mt-4">
                No tags found
            </Text>
            <Text variant="bodyMedium" className="text-gray-400 mt-2 text-center px-8">
                {searchQuery
                    ? 'Try a different search term'
                    : 'Create your first tag to organize your tasks'}
            </Text>
        </View>
    );

    return (
        <SafeAreaWrapper className="flex-1 bg-gray-50" edges={['top']}>
            {/* Header */}
            <View className="px-4 py-3 flex-row items-center justify-center bg-white border-b border-gray-100">
                <Text variant="headlineSmall" className="text-gray-800 font-medium text-center">
                    Your Memories
                </Text>
            </View>

            {/* Search Bar */}
            <View className="px-4 py-3 bg-white border-b border-gray-100">
                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">

                    <TextInput
                        placeholder="Search tags..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-2 text-gray-800"
                        placeholderTextColor="#9CA3AF"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}

                    <View
                        className="ml-2 p-2 rounded-lg"
                        style={{ backgroundColor: palette.dark.primary }}
                    >
                        <Ionicons name="search" size={20} color={palette.dark.text} />
                    </View>
                </View>

            </View>

            {/* Content */}
            {error ? (
                <View className="flex-1 items-center justify-center px-8">
                    <Ionicons name="alert-circle" size={64} color="#EF4444" />
                    <Text variant="titleMedium" className="text-gray-800 mt-4 text-center">
                        Failed to load tags
                    </Text>
                    <Text variant="bodyMedium" className="text-gray-500 mt-2 text-center">
                        {error}
                    </Text>
                    <TouchableOpacity
                        onPress={loadTags}
                        className="mt-6 bg-orange-500 px-6 py-3 rounded-xl"
                    >
                        <Text variant="bodyLarge" className="text-white font-medium">
                            Try Again
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#F97316" />
                    <Text variant="bodyMedium" className="text-gray-500 mt-4">
                        Loading tags...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredTags}
                    renderItem={renderFolder}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    numColumns={2}
                    contentContainerStyle={{
                        paddingHorizontal: 8,
                        paddingTop: 8,
                        paddingBottom: 20,
                        flexGrow: 1
                    }}
                    columnWrapperStyle={{
                        justifyContent: 'flex-start'
                    }}
                    ListEmptyComponent={renderEmptyState}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Floating Action Button */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 rounded-full shadow-lg"
                style={{
                    backgroundColor: palette.light.primary,
                    width: 60,
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                }}
                activeOpacity={0.8}
                onPress={() => setIsModalVisible(true)}
            >
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>

            {/* Create Tag Modal */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View className="bg-white rounded-3xl p-6 mx-6 w-11/12 max-w-md">
                        {/* Modal Header */}
                        <View className="flex-row items-center justify-between mb-4">
                            <Text variant="headlineSmall" className="text-gray-800 font-bold">
                                Create New Tag
                            </Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close" size={28} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Tag Name Input */}
                        <View className="mb-4">
                            <Text variant="bodyMedium" className="text-gray-700 mb-2 font-medium">
                                Tag Name *
                            </Text>
                            <TextInput
                                className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800"
                                placeholder="Enter tag name"
                                placeholderTextColor="#9CA3AF"
                                value={newTagName}
                                onChangeText={setNewTagName}
                                autoFocus={true}
                            />
                        </View>

                        {/* Tag Description Input */}
                        <View className="mb-6">
                            <Text variant="bodyMedium" className="text-gray-700 mb-2 font-medium">
                                Description
                            </Text>
                            <TextInput
                                className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800"
                                placeholder="Enter description (optional)"
                                placeholderTextColor="#9CA3AF"
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
                                className="flex-1 bg-gray-200 rounded-xl py-3 items-center"
                                onPress={() => {
                                    setIsModalVisible(false);
                                    setNewTagName('');
                                    setNewTagDescription('');
                                }}
                                activeOpacity={0.7}
                            >
                                <Text variant="bodyLarge" className="text-gray-700 font-medium">
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 rounded-xl py-3 items-center"
                                style={{ backgroundColor: palette.light.primary }}
                                onPress={handleCreateTag}
                                activeOpacity={0.7}
                                disabled={!newTagName.trim()}
                            >
                                <Text variant="bodyLarge" className="text-white font-medium">
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