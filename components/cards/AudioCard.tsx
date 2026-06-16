import { Audio } from "@/constants/audios";
import { PlayCircle } from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function AudioCard({
  item,
}: {
  item: Audio;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity className="w-48 mr-4">
      <Image
        source={{ uri: item.cover }}
        className="w-full h-48 rounded-xl"
      />

      <Text
        className="font-semibold mt-2"
        numberOfLines={2}
        style={{ color: colors.text }}
      >
        {item.title}
      </Text>

      <Text style={{ color: colors.secondaryText }}>
        {item.artist}
      </Text>

      <View className="flex-row justify-between mt-2">
        <Text style={{ color: colors.mutedText }}>{item.duration}</Text>
        <PlayCircle size={20} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );
}