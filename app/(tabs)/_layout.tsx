import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { Redirect, Tabs } from "expo-router";

export default function TabsLayout() {
  const { user, hasCompletedOnboarding, isOnboardingReady } = useAuth();

  if (!user) {
    return <Redirect href="/" />;
  }

  if (!isOnboardingReady) {
    return null;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
