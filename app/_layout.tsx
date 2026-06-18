import { AuthContext, AuthContextType, AuthProvider } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

const SKIP_AUTH = process.env.EXPO_PUBLIC_SKIP_AUTH === "true";

function RootNavigator() {
  const { theme, colors } = useTheme();

  return (
    <>
      <StatusBar
        style={theme === "light" ? "dark" : "light"}
        // backgroundColor={colors.background}
      />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="audio" />
        <Stack.Screen name="category/index" />
        <Stack.Screen name="video-player" />
      </Stack>
    </>
  );
}

const mockAuthValue: AuthContextType = {
  user: {
    id: "dev-user",
    username: "Developer",
  } as any,

  hasCompletedOnboarding: true,
  isOnboardingReady: true,

  setUser: () => {},
  setHasCompletedOnboarding: () => {},

  refreshUser: async () => {},
  logout: async () => {},
};

function AppProviders({ children }: React.PropsWithChildren) {
  // if (SKIP_AUTH) {
  //   return (
  //     <AuthContext.Provider value={mockAuthValue}>
  //       {children}
  //     </AuthContext.Provider>
  //   );
  // }

  return <AuthProvider>{children}</AuthProvider>;
}

export default function RootLayout() {
  console.log("SKIP_AUTH:", SKIP_AUTH);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AppProviders>
            <RootNavigator />
          </AppProviders>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}