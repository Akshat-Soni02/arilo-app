import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import DrawerMenu from '../../components/drawer-menu';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import RecordBtn from '../../components/ui/record-btn';

export default function Home() {
    return (
        <SafeAreaWrapper className="flex-1 bg-background">
            <DrawerMenu />

            <View className="flex-1 items-center justify-center -mt-10">
                <Text variant="headlineMedium" className="font-bold">Coming Soon</Text>
            </View>

            <TouchableOpacity className="absolute bottom-10 items-center w-full" onPress={() => router.push('/record-screen')}>
                <RecordBtn />
            </TouchableOpacity>

        </SafeAreaWrapper>
    );
}
