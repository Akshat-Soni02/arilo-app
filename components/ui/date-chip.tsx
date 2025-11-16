//This componenet extends chip component to show date in chip format and allows user to pick date on press

import React, { useState } from 'react';
import { View } from 'react-native';
import AppChip from './chip';
import { DatePicker } from './date-picker';


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
            <AppChip
                text={date.toDateString() === new Date().toDateString() ? "Today" : formatDate(date)}
                onPress={onPress}
                className='rounded-3xl bg-white self-start'
            />
            <DatePicker
                mode="date"
                date={date}
                onChange={onChange}
                show={showPicker}
                disableFutureDates={true}
            />
        </View>
    );
}