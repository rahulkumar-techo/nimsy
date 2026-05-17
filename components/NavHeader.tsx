/**
 * NavHeader (Clean + Production Ready)
 * - Avatar + greeting
 * - Search icon (right aligned)
 * - Fallback initials
 */

import { Image, Text, View, Pressable } from "react-native"
import React from "react"
import { useAuth } from "@/context/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export default function NavHeader() {
  const { user } = useAuth();
  const route = useRouter();
  const { colors } = useTheme();

  const initials =
    user?.name?.charAt(0).toUpperCase() ?? "U"

  return (
    <View className="flex-row items-center justify-between py-3">

      {/* Left Section */}
      <View className="flex-row items-center gap-3" >

        {/* Avatar */}
        <Pressable onPress={
          () => {
            route.push("/userdetails")
          }
        }>
          {user?.photo ? (
            <Image
              source={{ uri: user.photo }}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <View
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text
                className="font-bold text-lg"
                style={{ color: colors.buttonText }}
              >
                {initials}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Greeting */}
        <View>
          <Text
            className="text-sm"
            style={{ color: colors.secondaryText }}
          >
            Hello 👋
          </Text>
          <Text
            className="text-lg font-semibold"
            style={{ color: colors.text }}
          >
            {user?.name ?? "User"}
          </Text>
        </View>
      </View>

      {/* Right Section */}
      <Pressable className="p-2">
        <Ionicons name="search" size={22} color={colors.text} />
      </Pressable>

    </View>
  )
}
