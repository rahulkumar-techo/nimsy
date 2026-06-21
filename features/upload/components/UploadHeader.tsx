/**
 * UploadHeader
 */

import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  title?: string;           // optional — defaults to "Upload Video"
  onClose?: () => void;
};

export default function UploadHeader({ title, onClose }: Props) {
  const { colors } = useTheme();

  return (
    <View
      className="flex-row items-center px-4 py-3 border-b"
      style={{ backgroundColor: colors.background, borderBottomColor: colors.border }}
    >
      <TouchableOpacity
        onPress={() => onClose?.()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        className="p-1"
      >
        <Ionicons name="close" size={24} color={colors.text} />
      </TouchableOpacity>

      <Text
        numberOfLines={1}
        className="flex-1 mx-3 text-base font-semibold"
        style={{ color: colors.text }}
      >
        {title ?? "Upload Video"}
      </Text>

    </View>
  );
}