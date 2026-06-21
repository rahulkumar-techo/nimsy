import {
  Alert,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import React, { useState } from "react"

import { Ionicons } from "@expo/vector-icons"

import { useTheme } from "@/context/ThemeContext"

import * as ImagePicker from "expo-image-picker"

type Props = {
  avatar: string
  onSelectAvatar: (avatar: string) => void
}

const avatars = [
  "https://api.dicebear.com/9.x/adventurer/png?seed=Nimsy",
  "https://api.dicebear.com/9.x/adventurer/png?seed=Story",
  "https://api.dicebear.com/9.x/adventurer/png?seed=Dream",
]

const UserModal = ({
  avatar,
  onSelectAvatar,
}: Props) => {
  const [modalVisible, setModalVisible] =
    useState(false)

  const { colors } = useTheme()

  /**
   * Pick image from gallery
   */
const pickImage = async () => {
  try {
    /**
     * Close modal first
     * VERY IMPORTANT on Android
     */
    setModalVisible(false)

    // Small delay for modal animation
    setTimeout(async () => {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow gallery access."
        )
        return
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes:
            ["images"],

          allowsEditing: true,

          aspect: [1, 1],

          quality: 1,
        })

      if (!result.canceled) {
        onSelectAvatar(
          result.assets[0].uri
        )
      }
    }, 300)
  } catch (error) {
    console.log(error)

    Alert.alert(
      "Error",
      "Failed to pick image"
    )
  }
}

  return (
    <>
      {/* Camera Button */}
      <Pressable
        onPress={() => setModalVisible(true)}
        className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full border-2"
        style={{
          backgroundColor: colors.primary,
          borderColor: colors.card,
        }}
      >
        <Ionicons
          name="camera-outline"
          size={18}
          color={colors.buttonText}
        />
      </Pressable>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
        }}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-5">
          <View
            className="w-full rounded-3xl p-6"
            style={{
              backgroundColor: colors.card,
            }}
          >
            {/* Close */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute right-4 top-4 z-10"
            >
              <Ionicons
                name="close"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>

            {/* Title */}
            <Text
              className="mb-5 text-xl font-bold"
              style={{ color: colors.text }}
            >
              Choose Avatar
            </Text>

            {/* Current Avatar */}
            <View className="items-center">
              <Image
                source={{ uri: avatar }}
                className="h-28 w-28 rounded-full"
              />
            </View>

            {/* Upload From Gallery */}
            <TouchableOpacity
              onPress={pickImage}
              className="mt-6 flex-row items-center justify-center rounded-2xl py-4"
              style={{
                backgroundColor: colors.primary,
              }}
            >
              <Ionicons
                name="image-outline"
                size={20}
                color={colors.buttonText}
              />

              <Text
                className="ml-2 text-base font-semibold"
                style={{
                  color:
                    colors.buttonText,
                }}
              >
                Upload From Gallery
              </Text>
            </TouchableOpacity>

            {/* Preset Avatars */}
            <View className="mt-6 flex-row justify-center gap-4">
              {avatars.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => {
                    onSelectAvatar(item)
                    setModalVisible(false)
                  }}
                  className="overflow-hidden rounded-full border-2"
                  style={{
                    borderColor:
                      avatar === item
                        ? colors.primary
                        : colors.border,
                  }}
                >
                  <Image
                    source={{ uri: item }}
                    className="h-16 w-16"
                  />
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default UserModal