/**
 * User Settings Section
 */

import React, { useState } from "react";

import {
  Text,
  View,
} from "react-native";

import NotificationsSetting from "./NotificationsSetting";
import PrivacySetting from "./PrivacySetting";
import HelpSupportSetting from "./HelpSupportSetting";
import ThemeSetting from "./ThemeSetting";
import LogoutSetting from "./LogoutSetting";
import { useTheme } from "@/context/ThemeContext";

const UserSettingsSection = () => {
  const { colors } = useTheme();
  const [expandedId, setExpandedId] =
    useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setExpandedId(
      expandedId === id ? null : id
    );
  };

  return (
    <View className="mt-8">
      <Text
        className="mb-4 text-lg font-bold"
        style={{ color: colors.text }}
      >
        Settings
      </Text>

      <NotificationsSetting
        expanded={
          expandedId === "notifications"
        }
        onToggle={() =>
          toggleDropdown("notifications")
        }
      />

      <PrivacySetting
        expanded={expandedId === "privacy"}
        onToggle={() =>
          toggleDropdown("privacy")
        }
      />

      <HelpSupportSetting
        expanded={expandedId === "help"}
        onToggle={() =>
          toggleDropdown("help")
        }
      />

      <ThemeSetting
        expanded={expandedId === "theme"}
        onToggle={() =>
          toggleDropdown("theme")
        }
      />

      <LogoutSetting />
    </View>
  );
};

export default UserSettingsSection;
