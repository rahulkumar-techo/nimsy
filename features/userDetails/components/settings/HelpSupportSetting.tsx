/**
 * Help & Support Setting
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

const HelpSupportSetting = ({
  expanded,
  onToggle,
}: Props) => {
  const { colors } = useTheme();

  return (
    <SettingsRow
      title="Help & Support"
      subtitle="Get support and FAQs."
      icon="help-circle-outline"
      expanded={expanded}
      onToggle={onToggle}
    >
      <Pressable
        className="mb-3 rounded-2xl px-4 py-3"
        style={{ backgroundColor: colors.background }}
      >
        <Text className="font-medium" style={{ color: colors.text }}>
          FAQ
        </Text>
      </Pressable>

      <Pressable
        className="rounded-2xl px-4 py-3"
        style={{ backgroundColor: colors.background }}
      >
        <Text className="font-medium" style={{ color: colors.text }}>
          Contact Support
        </Text>
      </Pressable>
    </SettingsRow>
  );
};

export default HelpSupportSetting;
