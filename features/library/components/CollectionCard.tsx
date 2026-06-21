/**
 * Collection Card Component
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
    items: string;
    image: string;
    color: string;
  };
};

const CollectionCard = ({
  item,
}: Props) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className={`mr-4 w-64 overflow-hidden rounded-[30px] ${item.color}`}
    >
      <Image
        source={{
          uri: item.image,
        }}
        className="h-40 w-full"
        resizeMode="cover"
      />

      <View className="p-5">
        <Text className="text-2xl font-bold" style={{ color: colors.text }}>
          {item.title}
        </Text>

        <Text className="mt-1" style={{ color: colors.secondaryText }}>
          {item.items}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CollectionCard;
