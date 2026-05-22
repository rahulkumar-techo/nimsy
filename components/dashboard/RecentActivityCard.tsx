/**
 * Recent Activity Card
 */

import {
  Image,
  Text,
  View,
} from "react-native";

const RecentActivityCard = () => {
  return (
    <View className="bg-white rounded-3xl p-4 flex-row items-center border border-gray-100">
      <Image
        source={{
          uri: "https://i.imgur.com/8w0M0Vk.png",
        }}
        className="w-16 h-16 rounded-2xl"
      />

      <View className="ml-4 flex-1">
        <Text className="font-semibold text-base">
          The Honest Little Rabbit
        </Text>

        <Text className="text-gray-500 mt-1">
          Read • Today, 10:30 AM
        </Text>
      </View>
    </View>
  );
};

export default RecentActivityCard;