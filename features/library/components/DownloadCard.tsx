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
import { useTheme } from "@/context/ThemeContext";

type Props = {
  item: {
    title: string;
    type: string;
  };
};

const DownloadCard = ({
  item,
}: Props) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className="mb-4 flex-row items-center justify-between rounded-[28px] p-5"
      style={{ backgroundColor: colors.card }}
    >
      <View>
        <Text className="text-xl font-bold" style={{ color: colors.text }}>
          {item.title}
        </Text>

        <Text className="mt-1" style={{ color: colors.secondaryText }}>
          {item.type}
        </Text>
      </View>

      <View
        className="h-14 w-14 items-center justify-center rounded-2xl"
        style={{ backgroundColor: colors.primaryLight }}
      >
        <Ionicons
          name="download"
          size={24}
          color={colors.primary}
        />
      </View>
    </TouchableOpacity>
  );
};

export default DownloadCard;
