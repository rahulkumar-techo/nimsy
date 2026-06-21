/**
 * Privacy Setting
 */

import React from "react";

import {
  Pressable,
  Text,
} from "react-native";

import SettingsRow from "./SettingsRow";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  expanded: boolean;
  onToggle: () => void;
};

const PrivacySetting = ({
  expanded,
  onToggle,
}: Props) => {
  const { colors } = useTheme();

  return (
    <SettingsRow
      title="Privacy"
      subtitle="Manage account privacy."
      icon="lock-closed-outline"
      expanded={expanded}
      onToggle={onToggle}
    >
      <Pressable
        className="mb-3 rounded-2xl px-4 py-3"
        style={{ backgroundColor: colors.background }}
      >
        <Text className="font-medium" style={{ color: colors.text }}>
          Change Password
        </Text>
      </Pressable>

      <Pressable
        className="rounded-2xl px-4 py-3"
        style={{ backgroundColor: colors.background }}
      >
        <Text className="font-medium" style={{ color: colors.text }}>
          Manage Permissions
        </Text>
      </Pressable>
    </SettingsRow>
  );
};

export default PrivacySetting;
