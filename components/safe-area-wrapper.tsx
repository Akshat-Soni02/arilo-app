import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    children: React.ReactNode;
    className?: string;
}

export default function SafeAreaWrapper({ children, className }: Props) : React.ReactNode {
    return (
        <SafeAreaView
            edges={["top", "left", "right"]}
            style={{ flex: 1 }}
            className={className || ''}
        >
            {children}
        </SafeAreaView>
    );
}