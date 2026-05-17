/**
 * Profile Header
 */

import React from "react";

import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import {
  Ionicons,
} from "@expo/vector-icons";
import ProfileModal from "../ProfileModel";
import { useTheme } from "@/context/ThemeContext";

const ProfileHeader = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  return (
    <View className="flex-row items-start justify-between">
      {/* LEFT */}
      <View className="flex-1 flex-row">
        {/* IMAGE */}
        <View className="relative">
          <Image
            source={{
              uri:
                user?.photo ||
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
            }}
            className="h-24 w-24 rounded-full border-4 border-violet-400"
          />

          <ProfileModal className="absolute bottom-0 right-0" />
        </View>

        {/* INFO */}
        <View className="ml-4 flex-1">
          <Text
            numberOfLines={1}
            className="text-3xl font-black"
            style={{ color: colors.text }}
          >
            {user?.name}
          </Text>

          <View
            className="mt-3 self-start rounded-full px-4 py-2"
            style={{ backgroundColor: colors.primary }}
          >
            <Text
              className="font-bold"
              style={{ color: colors.buttonText }}
            >
              Level 12
            </Text>
          </View>

          <Text
            className="mt-3 text-base"
            style={{ color: colors.secondaryText }}
          >
            ⭐ Little Explorer
          </Text>
        </View>
      </View>

      {/* RIGHT ICONS */}
      <View className="ml-3 flex-row items-center">
        <TouchableOpacity
          className="mr-3 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.card }}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

        <TouchableOpacity
          className="h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.card }}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(
  ProfileHeader
);
