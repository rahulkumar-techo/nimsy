/**
 * Logout Setting
 */

import React from "react";

import {
  Alert,
  Pressable,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const LogoutSetting = () => {
  const { logout } = useAuth();
  const { colors } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      "Sign out",
      "Do you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign out",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <Pressable
      onPress={handleLogout}
      className="mt-2 flex-row items-center rounded-3xl px-4 py-4"
      style={{ backgroundColor: colors.card }}
    >
      <View
        className="mr-4 h-12 w-12 items-center justify-center rounded-2xl"
        style={{ backgroundColor: colors.background }}
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color={colors.danger}
        />
      </View>

      <View className="flex-1">
        <Text
          className="text-base font-semibold"
          style={{ color: colors.danger }}
        >
          Sign out
        </Text>

        <Text
          className="mt-1 text-sm"
          style={{ color: colors.secondaryText }}
        >
          Logout from account
        </Text>
      </View>
    </Pressable>
  );
};

export default LogoutSetting;
