import React, { useEffect, useState } from "react"
import { Alert, Image, Pressable, Text, TextInput, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "@/context/AuthContext"

const AVATAR_PRESETS = [
  "https://api.dicebear.com/9.x/adventurer/png?seed=Nimsy",
  "https://api.dicebear.com/9.x/adventurer/png?seed=Story",
  "https://api.dicebear.com/9.x/adventurer/png?seed=Dream",
]

export default function UserProfileDetails() {
  const { user, setUser } = useAuth()
  const [name, setName] = useState(user?.name ?? "")
  const [avatarUrl, setAvatarUrl] = useState(user?.photo ?? "")

  useEffect(() => {
    setName(user?.name ?? "")
    setAvatarUrl(user?.photo ?? "")
  }, [user?.name, user?.photo])

  const resolvedName = name.trim() || "User"
  const resolvedAvatar = avatarUrl.trim()
  const initials = resolvedName.charAt(0).toUpperCase()

  const handleSave = () => {
    if (!user) return

    setUser({
      ...user,
      name: resolvedName,
      photo: resolvedAvatar || undefined,
    })

    Alert.alert("Profile updated", "Your name and avatar were updated.")
  }

  return (
    <View
      className="rounded-[30px] bg-white px-5 py-6"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      }}
    >
      <View className="items-center">
        {resolvedAvatar ? (
          <Image
            source={{ uri: resolvedAvatar }}
            className="h-24 w-24 rounded-full"
          />
        ) : (
          <View className="h-24 w-24 items-center justify-center rounded-full bg-blue-500">
            <Text className="text-3xl font-bold text-white">{initials}</Text>
          </View>
        )}

        <View className="-mt-4 ml-16 h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-slate-900">
          <Ionicons name="camera-outline" size={18} color="#ffffff" />
        </View>

        <Text className="mt-4 text-2xl font-bold text-slate-900">
          {resolvedName}
        </Text>
        <Text className="mt-1 text-sm text-slate-500">
          {user?.email ?? "No email found"}
        </Text>
        <Text className="mt-3 text-center text-sm leading-5 text-slate-500">
          Edit your name and avatar here, then manage account settings below.
        </Text>
      </View>

      <View className="mt-6">
        <Text className="mb-2 text-sm font-semibold text-slate-700">
          Display name
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your display name"
          placeholderTextColor="#94a3b8"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900"
        />
      </View>

      <View className="mt-4">
        <Text className="mb-2 text-sm font-semibold text-slate-700">
          Avatar image URL
        </Text>
        <TextInput
          value={avatarUrl}
          onChangeText={setAvatarUrl}
          placeholder="Paste avatar image link"
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          autoCorrect={false}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900"
        />
        <View className="mt-3 flex-row gap-2">
          {AVATAR_PRESETS.map((preset) => (
            <Pressable
              key={preset}
              onPress={() => setAvatarUrl(preset)}
              className="overflow-hidden rounded-full border-2 border-slate-200"
            >
              <Image source={{ uri: preset }} className="h-14 w-14" />
            </Pressable>
          ))}
          <Pressable
            onPress={() => setAvatarUrl("")}
            className="h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-slate-50"
          >
            <Ionicons name="close" size={22} color="#64748b" />
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={handleSave}
        className="mt-6 items-center rounded-2xl bg-blue-600 py-4"
      >
        <Text className="text-base font-semibold text-white">
          Save changes
        </Text>
      </Pressable>
    </View>
  )
}
