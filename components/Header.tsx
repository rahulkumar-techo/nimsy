import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import {
  ChevronLeft,
  Search,
  EllipsisVertical,
  Settings,
  Share2,
  Info,
  CircleHelp,
  MessageSquareWarning,
} from "lucide-react-native";

import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  title: string;
  showBack?: boolean;

  onSearchPress?: () => void;
  onSharePress?: () => void;
  onSettingsPress?: () => void;
  onAboutPress?: () => void;
  onHelpPress?: () => void;
  onFeedbackPress?: () => void;
}

export default function Header({
  title,
  showBack = true,
  onSearchPress,
  onSharePress,
  onSettingsPress,
  onAboutPress,
  onHelpPress,
  onFeedbackPress,
}: HeaderProps) {
  const { colors } = useTheme();

  const [menuVisible, setMenuVisible] = useState(false);

  const closeMenu = () => setMenuVisible(false);

  const menuItems = useMemo(
    () => [
      {
        label: "Settings",
        icon: Settings,
        onPress: onSettingsPress,
      },
      {
        label: "Share",
        icon: Share2,
        onPress: onSharePress,
      },
      {
        label: "About Channel",
        icon: Info,
        onPress: onAboutPress,
      },
      {
        label: "Help",
        icon: CircleHelp,
        onPress: onHelpPress,
      },
      {
        label: "Feedback",
        icon: MessageSquareWarning,
        onPress: onFeedbackPress,
      },
    ],
    [
      onSettingsPress,
      onSharePress,
      onAboutPress,
      onHelpPress,
      onFeedbackPress,
    ]
  );

  return (
    <>
      <View
        className="h-14 flex-row items-center justify-between px-4"
        style={{
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View className="flex-1 flex-row items-center">
          {showBack && (
            <Pressable
              onPress={() => router.back()}
              className="mr-3"
              hitSlop={10}
            >
              <ChevronLeft
                size={26}
                color={colors.primaryText}
              />
            </Pressable>
          )}

          <Text
            numberOfLines={1}
            className="flex-1 text-xl font-bold"
            style={{
              color: colors.primaryText,
            }}
          >
            {title}
          </Text>
        </View>

        <View className="flex-row items-center gap-4">
          <Pressable
            hitSlop={10}
            onPress={onSearchPress}
          >
            <Search
              size={22}
              color={colors.primaryText}
            />
          </Pressable>

          <Pressable
            hitSlop={10}
            onPress={() => setMenuVisible(true)}
          >
            <EllipsisVertical
              size={22}
              color={colors.primaryText}
            />
          </Pressable>
        </View>
      </View>

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable
          className="flex-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
          onPress={closeMenu}
        >
          <View
            className="absolute right-3 top-14 w-60 rounded-2xl py-2"
            style={{
              backgroundColor: colors.background,
              elevation: 12,
              shadowOpacity: 0.15,
              shadowRadius: 10,
              shadowOffset: {
                width: 0,
                height: 4,
              },
            }}
          >
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <TouchableOpacity
                  key={item.label}
                  activeOpacity={0.7}
                  className="flex-row items-center px-4 py-3"
                  onPress={() => {
                    closeMenu();
                    item.onPress?.();
                  }}
                >
                  <Icon
                    size={18}
                    color={colors.primary}
                  />

                  <Text
                    className="ml-3 text-base"
                    style={{
                      color: colors.primaryText,
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}