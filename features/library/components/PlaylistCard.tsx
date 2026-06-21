/**
 * Playlist Card Component
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
    icon: string;
  };
};

const PlaylistCard = ({
  item,
}: Props) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className="mb-4 flex-row items-center justify-between rounded-[28px] p-5"
      style={{ backgroundColor: colors.card }}
    >
      <View className="flex-row items-center">
        <View
          className="mr-4 h-16 w-16 items-center justify-center rounded-3xl"
          style={{ backgroundColor: colors.primaryLight }}
        >
          <Ionicons
            name={item.icon as any}
            size={28}
            color={colors.primary}
          />
        </View>

        <View>
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            {item.title}
          </Text>

          <Text className="mt-1" style={{ color: colors.secondaryText }}>
            15 items
          </Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={24}
        color={colors.secondaryText}
      />
    </TouchableOpacity>
  );
};

export default PlaylistCard;
