import { Redirect } from "expo-router"
import Onboarding from "@/features/onboarding/screens/onboarding"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAuth } from "@/context/AuthContext"

export default function OnboardingRoute() {
  const { user, hasCompletedOnboarding } = useAuth();

  if (!user) {
    return <Redirect href="/" />
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
