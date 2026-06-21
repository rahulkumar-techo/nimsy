/**
 * UserDetails Screen
 */

import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import UserSettingsSection from "@/features/userDetails/components/settings/UserSettingsSection"
import UserProfileDetails from "@/features/userDetails/components/UserProfileDetails"
import { Ionicons } from "@expo/vector-icons"
import { Redirect, useRouter } from "expo-router"
import { Pressable, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const UserDetails = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { colors } = useTheme()

  if (!user) {
    return <Redirect href="/" />
  }

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top", "left", "right"]}
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 8,
          paddingBottom: 24,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 pt-4">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-2xl"
            style={{ backgroundColor: colors.card }}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.text}
            />
          </Pressable>

          <Text
            className="ml-3 text-2xl font-bold"
            style={{ color: colors.text }}
          >
            User Details
          </Text>
        </View>

        <View className="px-4 pt-6">
          <UserProfileDetails />
          <UserSettingsSection />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default UserDetails
