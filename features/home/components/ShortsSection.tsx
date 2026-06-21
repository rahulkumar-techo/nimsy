import { shorts } from "@/constants/shorts";
import { Image, ScrollView, Text, View } from "react-native";

export default function ShortsSection() {
  return (
    <View className="py-4">
      <Text className="text-lg font-bold px-4 mb-3">
        Shorts
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {shorts.map((item) => (
          <View
            key={item.id}
            className="w-36 ml-4"
          >
            <Image
              source={{ uri: item.thumbnail }}
              className="w-36 h-64 rounded-xl"
            />

            <Text
              className="font-medium mt-2"
              numberOfLines={2}
            >
              {item.title}
            </Text>

            <Text className="text-xs text-gray-500">
              {item.views}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}