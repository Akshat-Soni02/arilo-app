import { Text } from 'react-native-paper';
import DrawerMenu from '../../components/drawer-menu';
import SafeAreaWrapper from '../../components/safe-area-wrapper';

export default function Task() {
    return (
        <SafeAreaWrapper className="flex-1 bg-white">
            <DrawerMenu />
            <Text variant="headlineMedium" className="font-bold">Privacy Screen</Text>
        </SafeAreaWrapper>
    );
}