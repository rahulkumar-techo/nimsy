/**
 * Content layout with sticky chips navigation
 */

import React from "react";

import {
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";

import {
  Href,
  Slot,
  router,
  usePathname,
} from "expo-router";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";

type ContentTab = {
  label: string;
  route: Href;
};

const CONTENT_TABS: ContentTab[] = [
  {
    label: "Videos",
    route: "/(content)/videos",
  },
  {
    label: "Audios",
    route: "/(content)/audios",
  },
  {
    label: "Posts",
    route: "/(content)/posts",
  },
];

export default function ContentLayout() {
  const pathname = usePathname();

  const { colors } = useTheme();

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      {/* Sticky Chips */}
      <View
        style={{
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          {CONTENT_TABS.map((tab) => {
            const isActive =
              pathname === tab.route;

            return (
              <Pressable
                key={String(tab.route)}
                onPress={() =>
                  router.replace(tab.route)
                }
                style={{
                  marginRight: 10,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: isActive
                    ? colors.primary
                    : colors.surface,
                  borderWidth: 1,
                  borderColor: isActive
                    ? colors.primary
                    : colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: isActive
                      ? "#FFFFFF"
                      : colors.primaryText,
                  }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Route Content */}
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}