//native chip component with tailwind styling

import { Chip } from 'react-native-paper';
import tw from 'twrnc';

interface Props {
    children?: React.ReactNode;
    className?: string;
    onPress?: () => void;
    icon?: string;
    disabled?: boolean;
    selected?: boolean;
    text?: string;
}

export default function BaseChip({ children, className, onPress, icon, disabled, selected, text }: Props) {
    return (
        <Chip icon={icon} onPress={onPress} disabled={disabled} selected={selected} style={tw`${className || ''}`}>
            {text || children}
        </Chip>
    );
}