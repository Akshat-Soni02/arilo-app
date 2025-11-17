// DateTimePicker component, allows user to pick date and time
// Can be used with other components to give them ability to pick date and time

import SafeAreaWrapper from '@/components/safe-area-wrapper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface DateTimePickerProps {
  mode: 'date' | 'time';
  date: Date;
  onChange: (event: DateTimePickerEvent, selectedDate: Date | undefined) => void;
  show: boolean;
  disableFutureDates?: boolean;
}

export const BaseDateTimePicker = ({ mode, date, onChange, show, disableFutureDates } : DateTimePickerProps) => {

  return (
    <SafeAreaWrapper>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
          maximumDate={disableFutureDates ? new Date() : undefined}
        />
      )}
    </SafeAreaWrapper>
  );
};