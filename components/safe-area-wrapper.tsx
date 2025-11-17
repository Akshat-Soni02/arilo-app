import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    children: React.ReactNode;
    className?: string;
}

// add flex 1 while using for pages to cover entire page

export default function SafeAreaWrapper({ children, className }: Props) : React.ReactNode {
    return (
        <SafeAreaView
            edges={["top", "left", "right"]}
            className={className || ''}
        >
            {children}
        </SafeAreaView>
    );
}