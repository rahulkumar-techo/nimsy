import { Redirect } from "expo-router";

import { useAuth } from "@/context/AuthContext";
import NimsyLoadingScreen from "@/components/loader/NimsyLoadingScreen";

export default function Index() {
  const {
    user,
    hasCompletedOnboarding,
    isOnboardingReady,
  } = useAuth();


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