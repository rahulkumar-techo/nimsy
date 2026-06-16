/**
 * Advertisement Card
 * Displays sponsored content with badge
 */

import { Ad } from "@/constants/ads";
import { useTheme } from "@/context/ThemeContext";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdCard({
  item,
}: {
  item: Ad;
}) {
  const { colors } = useTheme();

  return (
    <View
      className="mx-3 my-4 overflow-hidden rounded-xl"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
      }}
    >
      <View className="relative">
        <Image
          source={{ uri: item.image }}
          className="h-52 w-full"
        />

        {/* Sponsored Badge */}
        <View
          className="absolute right-3 top-3 rounded-full px-3 py-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.75)",
          }}
        >
          <Text className="text-xs font-semibold text-white">
            Sponsored
          </Text>
        </View>
      </View>

      <View className="p-4">
        <Text
          className="text-lg font-bold"
          style={{ color: colors.text }}
        >
          {item.title}
        </Text>

        <Text
          className="mt-1"
          style={{ color: colors.secondaryText }}
        >
          {item.description}
        </Text>

        <TouchableOpacity
          className="mt-3 rounded-lg py-2"
          style={{ backgroundColor: colors.primary }}
        >
          <Text
            className="text-center font-semibold"
            style={{ color: colors.buttonText }}
          >
            {item.cta}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}