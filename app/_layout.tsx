import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

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

function AppProviders({ children }: React.PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}

export default function RootLayout() {
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