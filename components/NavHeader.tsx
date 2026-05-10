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

export default function NavHeader() {
  const { user } = useAuth();
  const route = useRouter();

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
            <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center">
              <Text className="text-white font-bold text-lg">
                {initials}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Greeting */}
        <View>
          <Text className="text-slate-500 text-sm">
            Hello 👋
          </Text>
          <Text className="text-lg font-semibold text-slate-900">
            {user?.name ?? "User"}
          </Text>
        </View>
      </View>

      {/* Right Section */}
      <Pressable className="p-2">
        <Ionicons name="search" size={22} color="#0f172a" />
      </Pressable>

    </View>
  )
}
