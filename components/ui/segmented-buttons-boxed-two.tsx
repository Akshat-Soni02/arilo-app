//two buttons boxed segmented control style

import BaseSegmentedButtons from "./base/segmented-button";

interface SegmentedButtonsBoxedTwoProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export default function SegmentedButtonsBoxedTwo ({options, selectedValue, onValueChange}: SegmentedButtonsBoxedTwoProps) : React.ReactNode {
  return (
    <BaseSegmentedButtons
      value={selectedValue}
      onValueChange={onValueChange}
      buttons={[
          { ...options[0], checkedColor: "bg-white shadow", uncheckedColor: "bg-blue-200" },
          { ...options[1], checkedColor: "bg-white shadow", uncheckedColor: "bg-blue-200" }
      ]}
      containerClassName="bg-yellow-200 rounded-lg items-center"
    />
  );
}