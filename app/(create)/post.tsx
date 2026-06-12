import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <TouchableOpacity onPress={() => router.back()} className="p-3">
        <Ionicons name="close" size={24} color="#000" />
      </TouchableOpacity>

      <View className="items-center justify-center flex-1">
        <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
          <Ionicons name="document-text" size={40} color="#666" />
        </View>
        <Text className="text-xl font-semibold text-gray-800">Create Post</Text>
        <Text className="text-sm text-gray-500 mt-2">This feature is coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}
