/**
 * UserDetails Screen
 */

import React from "react"
import { Pressable, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { Redirect, useRouter } from "expo-router"
import UserProfileDetails from "@/components/details/UserProfileDetails"
import UserSettingsSection from "@/components/details/UserSettingsSection"
import { useAuth } from "@/context/AuthContext"

const UserDetails = () => {
  const router = useRouter()
  const { user } = useAuth()

  if (!user) {
    return <Redirect href="/" />
  }

  return (
    <SafeAreaView
      className="flex-1 bg-blue-50"
      edges={["top", "left", "right"]}
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
            className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#111827"
            />
          </Pressable>

          <Text className="ml-3 text-2xl font-bold text-gray-900">
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
