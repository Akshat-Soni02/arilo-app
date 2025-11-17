//This componenet extends chip component to show date in chip format and allows user to pick date on press

import React, { useState } from 'react';
import { View } from 'react-native';
import BaseChip from './base/chip';
import { BaseDateTimePicker } from './base/date-picker';


export default function DateChip() : React.ReactNode {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const formatDate = (date: Date) : string => {
        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const onPress = () : void => {
        setShowPicker(true);
    };

    const onChange = (event: any, selectedDate: Date | undefined) : void => {
        setShowPicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    return (
        <View>
            <BaseChip
                text={date.toDateString() === new Date().toDateString() ? "Today" : formatDate(date)}
                onPress={onPress}
                className='rounded-l bg-transparent self-start border-black border-[0.1]'
            />
            <BaseDateTimePicker
                mode="date"
                date={date}
                onChange={onChange}
                show={showPicker}
                disableFutureDates={true}
            />
        </View>
    );
}