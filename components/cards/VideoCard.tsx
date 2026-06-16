import { Video } from "@/constants/videos";
import { useTheme } from "@/context/ThemeContext";
import { CheckCircle2, EllipsisVertical } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  item: Video;
}

export default function VideoCard({ item }: Props) {
    const {colors} = useTheme();
  
  return (
    <TouchableOpacity className="mb-5">
      <View>
        <Image
          source={{ uri: item.thumbnail }}
          className="w-full h-56"
        />

        <View className="absolute bottom-2 right-2 px-2 py-1 rounded" style={{backgroundColor: colors.overlay}}>
          <Text className=" text-xs" style={{color:colors.text}}>{item.duration}</Text>
        </View>
      </View>

      <View className="flex-row p-3">
        <Image
          source={{ uri: item.channelAvatar }}
          className="w-10 h-10 rounded-full"
        />

        <View className="flex-1 ml-3">
          <Text
            numberOfLines={2}
            className="font-semibold text-base"
            style={{color:colors.text}}
          >
            {item.title}
          </Text>

          <View className="flex-row items-center mt-1">
            <Text style={{color:colors.secondaryText}}>
              {item.channelName}
            </Text>

            {item.verified && (
              <CheckCircle2
                size={14}
                color={colors.secondaryText}
                style={{ marginLeft: 4 }}
              />
            )}
          </View>

          <Text className="text-xs mt-1" style={{color:colors.secondaryText}}>
            {item.views} • {item.uploadedAt}
          </Text>
        </View>

        <EllipsisVertical size={20} />
      </View>
    </TouchableOpacity>
  );
}