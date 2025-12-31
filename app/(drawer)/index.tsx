import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import DrawerMenu from '../../components/drawer-menu';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import RecordBtn from '../../components/ui/record-btn';

export default function Home() {
    return (
        <SafeAreaWrapper className="flex-1 bg-white">
            <DrawerMenu />

            <View className="flex-1 items-center justify-center -mt-10">
                <Text variant="headlineMedium" className="font-bold">Home Screen</Text>
            </View>

            <View className="absolute bottom-10 items-center w-full">
                <RecordBtn />
            </View>

        </SafeAreaWrapper>
    );
}
