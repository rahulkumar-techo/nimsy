/**
 * Success Screen
 */


import {
    SafeAreaView,
    Text,
    View,
} from "react-native";

import { router } from "expo-router";

import AuthButton from "@/features/auth/components/AuthButton";

import {
    CircleCheckBig,
} from "lucide-react-native";

export default function SuccessScreen() {
  const handleContinue = () => {
    router.replace("/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-8">
          <CircleCheckBig
            size={100}
            color="#22C55E"
          />
        </View>

        <Text className="mb-3 text-center text-3xl font-bold text-black dark:text-white">
          Success
        </Text>

        <Text className="mb-10 text-center text-base text-gray-500">
          Your password has been updated
          successfully.
        </Text>

        <View className="w-full">
          <AuthButton
            title="Continue to Login"
            onPress={handleContinue}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}