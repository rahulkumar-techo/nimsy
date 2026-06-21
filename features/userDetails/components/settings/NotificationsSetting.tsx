/**
 * Notifications Setting
 */

import React, { useState } from "react";

import {
  Switch,
  Text,
  View,
} from "react-native";

import SettingsRow from "./SettingsRow";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  expanded: boolean;
  onToggle: () => void;
};

const NotificationsSetting = ({
  expanded,
  onToggle,
}: Props) => {
  const [enabled, setEnabled] =
    useState(true);
  const { colors } = useTheme();

  return (
    <SettingsRow
      title="Notifications"
      subtitle="Control reminders and updates."
      icon="notifications-outline"
      expanded={expanded}
      onToggle={onToggle}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className="text-base"
          style={{ color: colors.text }}
        >
          Enable Notifications
        </Text>

        <Switch
          value={enabled}
          onValueChange={setEnabled}
          trackColor={{
            false: colors.border,
            true: colors.primaryLight,
          }}
          thumbColor={enabled ? colors.primary : colors.secondaryText}
        />
      </View>
    </SettingsRow>
  );
};

export default NotificationsSetting;
