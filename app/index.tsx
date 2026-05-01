import { Redirect } from "expo-router"
import { ActivityIndicator, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import UserAuth from "@/components/UserAuth"
import { useAuth } from "@/context/AuthContext"

export default function Index() {
  const { user, hasCompletedOnboarding, isOnboardingReady } = useAuth()

  if (user) {
    if (!isOnboardingReady) {
      return (
        <SafeAreaView className="flex-1 bg-slate-50">
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        </SafeAreaView>
      )
    }

    return (
      <Redirect href={hasCompletedOnboarding ? "/(tabs)/home" : "/onboarding"} />
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <UserAuth />
    </SafeAreaView>
  )
}
