//native segmented button component with safe area wrapper

import SafeAreaWrapper from '@/components/safe-area-wrapper';
import React, { useMemo } from 'react';
import { GestureResponderEvent } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import tw from 'twrnc';

interface Props {
    value: string;
    onValueChange: (value: string) => void;
    buttons: { 
      value: string; 
      label: string; 
      icon?: IconSource; 
      disabled?: boolean; 
      checkedColor?: string;
      uncheckedColor?: string;
      onPress?: (event: GestureResponderEvent) => void;
      style?: string;
    }[];
    containerClassName?: string;
}

export default function BaseSegmentedButtons({ value, onValueChange, buttons, containerClassName}: Props) {
  const memoizedButtons = useMemo(() => {
    return buttons.map(button => ({
      ...button,
      checkedColor: button.checkedColor ? tw`${button.checkedColor}`.color?.toString() : undefined,
      uncheckedColor: button.uncheckedColor ? tw`${button.uncheckedColor}`.color?.toString() : undefined,
      style: button.style ? [tw`${button.style}`] : tw`p-0`,
      labelStyle: tw`text-black`
    }));
  }, [buttons]);

  return (
    <SafeAreaWrapper className={containerClassName ? containerClassName : 'items-center'}>
      <SegmentedButtons
        value={value}
        onValueChange={onValueChange}
        buttons={memoizedButtons}
      />
    </SafeAreaWrapper>
  );
};
