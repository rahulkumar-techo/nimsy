/**
 * Profile Modal Component
 */

import React, { useState } from "react";

import {
  Image,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";

type Props = {
  className?: string;
};

const ProfileModal = ({
  className = "",
}: Props) => {
  const [visible, setVisible] = useState(false);

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  /**
   * Open Image Picker
   */
  const pickImage = async () => {
    // Permission
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required");
      return;
    }

    // Open Picker
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

    // Save Image
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <View className={`items-center justify-center ${className}`}>
      {/* Pencil Button */}
      <Pressable
        onPress={() => setVisible(true)}
        className="absolute bottom-0 right-0 z-50 h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-violet-500"
      >
        <Ionicons
          name="pencil"
          size={18}
          color="white"
        />
      </Pressable>

      {/* Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full rounded-3xl bg-white p-6">
            {/* Header */}
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900">
                Edit Profile
              </Text>

              <Pressable
                onPress={() => setVisible(false)}
                className="rounded-full bg-gray-100 p-2"
              >
                <Ionicons
                  name="close"
                  size={20}
                  color="black"
                />
              </Pressable>
            </View>

            {/* Profile Preview */}
            <View className="items-center">
              <Image
                source={{
                  uri:
                    selectedImage ||
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
                }}
                className="h-28 w-28 rounded-full border-4 border-violet-400"
              />

              {/* Change Photo */}
              <Pressable
                onPress={pickImage}
                className="mt-4 flex-row items-center rounded-2xl bg-violet-500 px-5 py-3"
              >
                <Ionicons
                  name="image"
                  size={18}
                  color="white"
                />

                <Text className="ml-2 font-semibold text-white">
                  Change Photo
                </Text>
              </Pressable>
            </View>

            {/* Footer */}
            <Pressable
              onPress={() => setVisible(false)}
              className="mt-8 items-center rounded-2xl bg-black py-3"
            >
              <Text className="font-semibold text-white">
                Save Changes
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileModal;