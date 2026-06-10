import React, {
  useEffect,
  useState,
} from "react"

import {
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native"

import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"

import UserModal from "./UserModal"
import { useAuthActions } from "@/hooks/useAuthActions"

export default function UserProfileDetails() {

  const { user, setUser } = useAuth()
  const { colors } = useTheme();
  // const [loadingProfile, setLoadingProfile] = useState(false)

  const [name, setName] = useState(
    user?.name ?? ""
  )

  const [avatarUrl, setAvatarUrl] =
    useState(user?.photo ?? "")
  // const { me } = useAuthActions();

  // // Load fresh profile from server on mount
  // useEffect(() => {
  //   const loadProfile = async () => {
  //     try {
  //       setLoadingProfile(true)
  //       const profile = await me()         // fetch from server
  //       await setUser(profile)             // sync into context + storage
  //       // local state will update via the useEffect below
  //     } catch {
  //       // silently fall back to cached user in context
  //     } finally {
  //       setLoadingProfile(false)
  //     }
  //   }

  //   loadProfile()
  // }, [])

  useEffect(() => {
    setName(user?.name ?? "")
    setAvatarUrl(user?.photo ?? "")
  }, [user])





  const resolvedName =
    name.trim() || "User"

  const resolvedAvatar =
    avatarUrl.trim()

  const initials =
    resolvedName.charAt(0).toUpperCase()

  const handleSelectAvatar = async (
    selectedAvatar: string
  ) => {
    setAvatarUrl(selectedAvatar)

    if (!user) return

    await setUser({
      ...user,
      photo:
        selectedAvatar.trim() || undefined,
    })
  }

  const handleSave = async () => {
    if (!user) return

    await setUser({
      ...user,
      name: resolvedName,
      photo: resolvedAvatar || undefined,
    })

    Alert.alert(
      "Profile updated",
      "Your profile has been updated."
    )
  }

  return (
    <View
      className="rounded-[30px] px-5 py-6"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        elevation: 3,
      }}
    >
      {/* Profile */}
      <View className="items-center">
        {resolvedAvatar ? (
          <View className="relative">
            <Image
              source={{
                uri: resolvedAvatar,
              }}
              className="h-24 w-24 rounded-full"
            />

            <UserModal
              avatar={resolvedAvatar}
              onSelectAvatar={
                handleSelectAvatar
              }
            />
          </View>
        ) : (
          <View
            className="relative h-24 w-24 items-center justify-center rounded-full"
            style={{
              backgroundColor:
                colors.primary,
            }}
          >
            <Text
              className="text-3xl font-bold"
              style={{
                color:
                  colors.buttonText,
              }}
            >
              {initials}
            </Text>

            <UserModal
              avatar={
                "https://api.dicebear.com/9.x/adventurer/png?seed=Nimsy"
              }
              onSelectAvatar={
                handleSelectAvatar
              }
            />
          </View>
        )}

        <Text
          className="mt-4 text-2xl font-bold"
          style={{
            color: colors.text,
          }}
        >
          {resolvedName}
        </Text>

        <Text
          className="mt-1 text-sm"
          style={{
            color:
              colors.secondaryText,
          }}
        >
          {user?.email ??
            "No email found"}
        </Text>
      </View>

      {/* Name Input */}
      <View className="mt-6">
        <Text
          className="mb-2 text-sm font-semibold"
          style={{
            color: colors.text,
          }}
        >
          Display name
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your display name"
          placeholderTextColor={
            colors.secondaryText
          }
          className="rounded-2xl border px-4 py-4 text-base"
          style={{
            backgroundColor:
              colors.inputBackground,
            borderColor:
              colors.inputBorder,
            color: colors.inputText,
          }}
        />
      </View>

      {/* Save */}
      <Pressable
        onPress={handleSave}
        className="mt-6 items-center rounded-2xl py-4"
        style={{
          backgroundColor:
            colors.primary,
        }}
      >
        <Text
          className="text-base font-semibold"
          style={{
            color:
              colors.buttonText,
          }}
        >
          Save changes
        </Text>
      </Pressable>
    </View>
  )
}
