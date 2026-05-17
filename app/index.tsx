import { Redirect } from "expo-router"
import { ActivityIndicator, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import UserAuth from "@/components/UserAuth"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"

export default function Index() {
  const { user, hasCompletedOnboarding, isOnboardingReady } = useAuth()
  const { colors } = useTheme()

  if (user) {
    if (!isOnboardingReady) {
      return (
        <SafeAreaView
          className="flex-1"
          style={{ backgroundColor: colors.background }}
        >
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </SafeAreaView>
      )
    }

    return (
      <Redirect href={hasCompletedOnboarding ? "/(tabs)/home" : "/onboarding"} />
    )
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <UserAuth />
    </SafeAreaView>
  )
}
