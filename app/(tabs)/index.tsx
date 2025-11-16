//home page of the app

import SafeAreaWrapper from "@/components/safe-area-wrapper";
import DateChip from "@/components/ui/date-chip";

export default function HomePage() {
  return (
      <SafeAreaWrapper>
        <DateChip/>
        {/* <View className="flex-1 justify-center items-center bg-green-300">
            <Text className="text-4xl font-bold text-black">Home Page Works!</Text>
        </View> */}
      </SafeAreaWrapper>
  );
}