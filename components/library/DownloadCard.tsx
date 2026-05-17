/**
 * Download Card Component
 */


import {
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

type Props = {
  item: {
    title: string;
    type: string;
  };
};

const DownloadCard = ({
  item,
}: Props) => {
  return (
    <TouchableOpacity className="mb-4 flex-row items-center justify-between rounded-[28px] bg-slate-50 p-5">
      <View>
        <Text className="text-xl font-bold text-slate-900">
          {item.title}
        </Text>

        <Text className="mt-1 text-slate-500">
          {item.type}
        </Text>
      </View>

      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
        <Ionicons
          name="download"
          size={24}
          color="#7c3aed"
        />
      </View>
    </TouchableOpacity>
  );
};

export default DownloadCard;