import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { palette } from "../../constants/colors";
import { Collapsible } from "./collapsible"; // Assuming this is the correct export

interface MemoryCardProps {
    userText: string;
    assistantText: string;
}

export default function MemoryCard({ userText, assistantText }: MemoryCardProps) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <View className="mb-6 mx-1">
            {/* User Section (Collapsible) */}
            <View className="bg-cardUserBg rounded-lg border border-border overflow-hidden shadow-sm mb-[-4px] z-10">
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setIsCollapsed(!isCollapsed)}
                    className="flex-row justify-between items-start p-4"
                >
                    <View className="flex-1 mr-2">
                        <Text variant="bodyMedium" className="text-text font-medium">
                            <Text className="font-bold">You: </Text>
                            {isCollapsed ? userText.slice(0, 60) + (userText.length > 60 ? "..." : "") : userText}
                        </Text>
                    </View>
                    <Ionicons
                        name={isCollapsed ? "chevron-down" : "chevron-up"}
                        size={18}
                        color={palette.light.text}
                    />
                </TouchableOpacity>

                <Collapsible title="" open={!isCollapsed}>
                    {/* We handle the toggle above, so this just wraps the full content if open? 
                         Actually, the provided Collapsible component includes its own toggle. 
                         Let's just implement a custom collapse view here since we need a specific UI 
                         (preview text vs full text).
                      */}
                </Collapsible>

                {/* Custom Collapse Content to handle 'preview' replacement */}
                {!isCollapsed && (
                    <View className="px-4 pb-4">
                        <Text variant="bodyMedium" className="text-text">
                            {userText}
                        </Text>
                    </View>
                )}
            </View>

            {/* Assistant Section */}
            <View className="bg-cardAssistantBg rounded-b-lg rounded-t-sm border border-border p-4 shadow-md">
                <View className="flex-row items-start">
                    <Ionicons name="sparkles" size={16} color={palette.light.text} style={{ marginTop: 2, marginRight: 6 }} />
                    <Text variant="bodyMedium" className="text-text font-medium flex-1 leading-5">
                        <Text className="font-bold">Arilo Says: </Text>
                        {assistantText}
                    </Text>
                </View>
            </View>
        </View>
    );
}
