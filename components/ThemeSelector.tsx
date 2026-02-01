import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '../constants/colors';
import { useColorScheme } from '../hooks/use-color-scheme';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setThemeMode, ThemeMode } from '../store/slices/themeSlice';

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
    { value: 'light', label: 'Light', icon: 'sunny-outline' },
    { value: 'dark', label: 'Dark', icon: 'moon-outline' },
];

export default function ThemeSelector() {
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useAppDispatch();
    const currentMode = useAppSelector((state) => state.theme.mode);
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? palette.dark : palette.light;

    const handleThemeChange = (mode: ThemeMode) => {
        dispatch(setThemeMode(mode));
        setModalVisible(false);
    };

    const getCurrentLabel = () => {
        return THEME_OPTIONS.find((opt) => opt.value === currentMode)?.label || 'System';
    };

    return (
        <>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
                className="flex-row items-center justify-between py-4 border-b"
                style={{ borderColor: colors.border }}
            >
                <View className="flex-row items-center flex-1">
                    <View
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: colors.iconBg }}
                    >
                        <Ionicons name="color-palette-outline" size={20} color={colors.primary} />
                    </View>
                    <Text className="text-base font-medium" style={{ fontFamily: 'Montserrat-Medium', color: colors.text }}>
                        Appearance
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <Text className="text-sm mr-2" style={{ fontFamily: 'Montserrat', color: colors.textMuted }}>
                        {getCurrentLabel()}
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color={colors.chevronColor} />
                </View>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                    className="flex-1 justify-end"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                    <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                        <View
                            className="rounded-t-3xl p-6"
                            style={{ backgroundColor: colors.surface }}
                        >
                            <View className="w-10 h-1 self-center rounded-full mb-6" style={{ backgroundColor: colors.border }} />

                            <Text className="text-xl font-bold mb-4" style={{ fontFamily: 'Montserrat-Bold', color: colors.text }}>
                                Choose Theme
                            </Text>

                            {THEME_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    onPress={() => handleThemeChange(option.value)}
                                    activeOpacity={0.7}
                                    className="flex-row items-center justify-between py-4 border-b"
                                    style={{ borderColor: colors.border }}
                                >
                                    <View className="flex-row items-center">
                                        <View
                                            className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                            style={{ backgroundColor: colors.iconBg }}
                                        >
                                            <Ionicons name={option.icon as any} size={20} color={colors.primary} />
                                        </View>
                                        <Text className="text-base" style={{ fontFamily: 'Montserrat-Medium', color: colors.text }}>
                                            {option.label}
                                        </Text>
                                    </View>
                                    {currentMode === option.value && (
                                        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}

                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                className="mt-4 py-4 rounded-xl items-center"
                                style={{ backgroundColor: colors.background }}
                            >
                                <Text className="text-base font-medium" style={{ fontFamily: 'Montserrat-Medium', color: colors.text }}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </>
    );
}
