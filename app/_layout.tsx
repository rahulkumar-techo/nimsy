import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

function RootNavigator() {
  const { theme, colors } = useTheme();

  return (
    <>
      <StatusBar
        style={theme === "light" ? "dark" : "light"}
        backgroundColor={colors.background}
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

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>


  );
}
