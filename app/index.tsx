import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import NimsyLoadingScreen from "@/components/loader/NimsyLoadingScreen";

export default function Index() {
  const {
    user,
    hasCompletedOnboarding,
    isOnboardingReady,
  } = useAuth();

  const { colors } = useTheme();

  console.log({
    user,
    hasCompletedOnboarding,
    isOnboardingReady,
  });

  // Wait until auth initialization finishes
  // SHOW LOADING SCREEN
  if (!isOnboardingReady) {
    return <NimsyLoadingScreen />;
  }


  // Not logged in
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Logged in but onboarding incomplete
  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  // Logged in and onboarding completed
  return <Redirect href="/(tabs)/home" />;
}