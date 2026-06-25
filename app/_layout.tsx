import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { store } from "@/store/store";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { useEffect } from "react";
import axiosInstance from "@/lib/api";

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

// useEffect(() => {
//   const testInterceptor = async () => {
//     try {
//       // 1. Try hitting a route you know requires authentication (e.g., "/users/me" or "/profile")
//       // 2. Use a relative path so your axiosInstance configurations are strictly applied
//       const res = await axiosInstance.get("/auth/me"); 
//       const resp = await axiosInstance.get("/health"); 
//       console.log("Protected data:", res.data);
//       console.log("Protected data:", resp.data);
//     } catch (err) {
//       console.log("Request failed after refresh attempts:", err);
//     }
//   };

//   testInterceptor();
// }, []);



  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
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
