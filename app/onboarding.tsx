import { Redirect } from "expo-router"
import Onboarding from "@/screens/onboarding"
import { ActivityIndicator, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAuth } from "@/context/AuthContext"

export default function OnboardingRoute() {
  const { user, hasCompletedOnboarding, isOnboardingReady } = useAuth()

  if (!user) {
    return <Redirect href="/" />
  }

  if (!isOnboardingReady) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </SafeAreaView>
    )
  }

  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)/home" />
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <Onboarding />
    </SafeAreaView>
  )
}
