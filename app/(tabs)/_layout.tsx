/**
 * Bottom Tabs Layout
 */

import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { Redirect, Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useTheme } from "@/context/ThemeContext";
import UserAuth from "@/components/UserAuth";

export default function TabsLayout() {
  const { user, hasCompletedOnboarding, isOnboardingReady } = useAuth();
  const { colors } = useTheme();

  const insets = useSafeAreaInsets();

  if (!user) {
    return <Redirect href="/" />;
  }

  if (!isOnboardingReady) {
    return <UserAuth/>;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondaryText,
        sceneStyle: {
          backgroundColor: colors.background,
        },

        tabBarStyle: {
          height: 60 + Math.max(insets.bottom, 8),
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 8),

          borderTopWidth: 0,
          elevation: 0,

          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "compass" : "compass-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: "Library",

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "library" : "library-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          

          tabBarIcon: ({ color, size, focused }) =>
            user?.photo ? (
              <Image
                source={{
                  uri: user.photo,
                }}
                contentFit="cover"
                transition={200}
                style={{
                  width: focused ? size + 10 : size + 4,
                  height: focused ? size + 10 : size + 4,

                  borderRadius: 999,

                  borderWidth: 2,
                  borderColor: focused
                    ? colors.primary
                    : "transparent",
                }}
              />
            ) : (
              <Ionicons
                name={
                  focused
                    ? "person-circle"
                    : "person-circle-outline"
                }
                color={color}
                size={size}
              />
            ),
        }}
      />
    </Tabs>
  );
}
