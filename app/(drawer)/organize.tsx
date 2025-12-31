import React from 'react';
import { Text } from 'react-native-paper';
import DrawerMenu from '../../components/drawer-menu';
import SafeAreaWrapper from '../../components/safe-area-wrapper';

export default function Organize() {
    return (
        <SafeAreaWrapper className="flex-1 bg-white">
            <DrawerMenu />
            <Text variant="headlineMedium" className="font-bold">Organize Screen</Text>
        </SafeAreaWrapper>
    );
}