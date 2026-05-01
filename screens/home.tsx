/**
 * Home Screen (NativeWind Version)
 * Tailwind-based styling
 */

import { useAuth } from "@/context/AuthContext"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { Image, Pressable, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function HomeScreen() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut()
    } catch (error) {
      console.log("Logout failed", error)
    } finally {
      logout()
    }
  }

  const initials = user?.name?.trim().charAt(0).toUpperCase() ?? "N"

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <View className="flex-1 px-6 pt-8 gap-5">

        {/* Hero Section */}
        <View className="rounded-3xl bg-blue-700 p-6 gap-5">

          {/* Avatar */}
          <View className="h-[68px] w-[68px] rounded-full items-center justify-center bg-white/20 overflow-hidden">
            {user?.photo ? (
              <Image
                source={{ uri: user.photo }} // ✅ FIXED (not src)
                className="h-full w-full"
              />
            ) : (
              <Text className="text-white text-[26px] font-extrabold">
                {initials}
              </Text>
            )}
          </View>

          {/* Text Content */}
          <View className="gap-2">
            <Text className="text-blue-200 text-[13px] font-bold uppercase tracking-wide">
              Signed in
            </Text>

            <Text className="text-white text-[28px] font-extrabold">
              Hi, {user?.name ?? "there"}
            </Text>

            <Text className="text-blue-100 text-[15px] leading-6">
              Your tab navigation is active and your home screen is now routed
              through the shared screens/home.tsx component.
            </Text>
          </View>
        </View>

        {/* Email Card */}
        <View className="rounded-2xl bg-white p-5 gap-2">
          <Text className="text-slate-500 text-[13px] font-bold uppercase tracking-wide">
            Email
          </Text>
          <Text className="text-slate-900 text-[18px] font-semibold">
            {user?.email ?? "No email found"}
          </Text>
        </View>

        {/* Logout Button */}
        <Pressable
          onPress={handleLogout}
          className="mt-auto mb-6 rounded-2xl bg-slate-900 py-4 items-center"
        >
          <Text className="text-white text-[16px] font-bold">
            Log out
          </Text>
        </Pressable>

      </View>
    </SafeAreaView>
  )
}