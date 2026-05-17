import { Redirect } from "expo-router"
import Onboarding from "@/screens/onboarding"
import { ActivityIndicator, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"

export default function OnboardingRoute() {
  const { user, hasCompletedOnboarding, isOnboardingReady } = useAuth()
  const { colors } = useTheme()

  if (!user) {
    return <Redirect href="/" />
  }

  if (!isOnboardingReady) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: colors.background }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
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
