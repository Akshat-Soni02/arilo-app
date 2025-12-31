import { Edge, SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    children: React.ReactNode;
    className?: string;
    edges?: Edge[];
}

// add flex 1 while using for pages to cover entire page

export default function SafeAreaWrapper({ children, className, edges = ["top", "left", "right"] }: Props): React.ReactNode {
    return (
        <SafeAreaView
            edges={edges}
            className={className || ''}
        >
            {children}
        </SafeAreaView>
    );
}