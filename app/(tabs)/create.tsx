/**
 * Create Content Screen
 */

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateContentScreen() {
  const actions = [
    {
      title: "Upload Video",
      icon: "videocam",
      route: "/(create)/video",
    },
    {
      title: "Upload Audio",
      icon: "musical-notes",
      route: "/(create)/audio",
    },
    {
      title: "Create Post",
      icon: "document-text",
      route: "/(create)/post",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <Text className="text-2xl font-bold mt-6 mb-8">
        Create Content
      </Text>

      <View className="gap-4">
        {actions.map((action) => (
          <TouchableOpacity
            key={action.title}
            onPress={() =>
              router.push(
                action.route as any
              )
            }
            className="flex-row items-center bg-gray-100 p-5 rounded-2xl"
          >
            <View className="w-14 h-14 rounded-full bg-black items-center justify-center">
              <Ionicons
                name={action.icon as any}
                size={24}
                color="#fff"
              />
            </View>

            <Text className="ml-4 text-lg font-semibold">
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}