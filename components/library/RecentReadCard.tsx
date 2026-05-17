/**
 * Recent Read Card Component
 */


import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  item: {
    title: string;
    progress: number;
    image: string;
  };
};

const RecentReadCard = ({
  item,
}: Props) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className="mb-4 flex-row overflow-hidden rounded-[28px]"
      style={{ backgroundColor: colors.card }}
    >
      <Image
        source={{
          uri: item.image,
        }}
        className="h-32 w-32"
      />

      <View className="flex-1 justify-center p-4">
        <Text className="text-xl font-bold" style={{ color: colors.text }}>
          {item.title}
        </Text>

        <Text className="mt-2" style={{ color: colors.secondaryText }}>
          {item.progress}%
          completed
        </Text>

        <View
          className="mt-4 h-2 overflow-hidden rounded-full"
          style={{ backgroundColor: colors.border }}
        >
          <View
            style={{
              width: `${item.progress}%`,
              backgroundColor: colors.primary,
            }}
            className="h-full rounded-full"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecentReadCard;
