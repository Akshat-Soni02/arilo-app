//home page of the app

import SafeAreaWrapper from "@/components/safe-area-wrapper";
import DateChip from "@/components/ui/date-chip";
import SegmentedButtonsBoxedTwo from "@/components/ui/segmented-buttons-boxed-two";
import { useState } from "react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>("view1");

  return (
    <SafeAreaWrapper className="bg-red-300 flex-1">
      <DateChip />
      <SegmentedButtonsBoxedTwo selectedValue={activeTab} onValueChange={setActiveTab} options={[{value: "view1", label: "view1"}, {value: "view2", label: "view2"}]}/>
    </SafeAreaWrapper>
  );
}

// {/* Tab Selector */}
//       <View className="flex-row gap-2 px-4 py-3">
//         <View
//           className={`flex-1 py-2 px-4 rounded-lg ${
//             activeTab === "view1" ? "bg-blue-500" : "bg-gray-300"
//           }`}
//           onTouchEnd={() => setActiveTab("view1")}
//         >
//           <Text className="text-center font-semibold text-white">View 1</Text>
//         </View>
//         <View
//           className={`flex-1 py-2 px-4 rounded-lg ${
//             activeTab === "view2" ? "bg-blue-500" : "bg-gray-300"
//           }`}
//           onTouchEnd={() => setActiveTab("view2")}
//         >
//           <Text className="text-center font-semibold text-white">View 2</Text>
//         </View>
//       </View>

//       {/* Scrollable Content */}
//       <ScrollView className="flex-1">
//         {activeTab === "view1" ? (
//           <View className="p-4">
//             {/* Add your first scrollable content here */}
//             <Text className="text-lg">View 1 Content</Text>
//           </View>
//         ) : (
//           <View className="p-4">
//             {/* Add your second scrollable content here */}
//             <Text className="text-lg">View 2 Content</Text>
//           </View>
//         )}
//       </ScrollView>