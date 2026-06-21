/**
 * Child Profile Component
 * Displays child avatar, achievements, and profile menu items
 */

import React from "react";

import {
    Image,
    ScrollView,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";

import AchievementBadge from "./AchievementBadge";
import MenuItem from "./MenuItem";
import { useAuth } from "@/context/AuthContext";
import { Href } from "expo-router";
import UserModal from "@/features/userDetails/components/UserModal";

const CHILD_NAME = "Aarav";
const CHILD_AGE = "6 years";
const CHILD_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e";

const ACHIEVEMENTS = [
  { emoji: "⭐", title: "Story Star" },
  { emoji: "📚", title: "Bookworm" },
  { emoji: "🎧", title: "Listener" },
  { emoji: "🏆", title: "Champion" },
];

const MENU_ITEMS = [
  { title: "My Videos", icon: "book" as const, link: "/(videos)/videos" as const },
  { title: "My Favorites", icon: "heart" as const, link: "/favorites" as const },
  { title: "Downloads", icon: "download" as const, link: "/downloads" as Href },
  { title: "Watch History", icon: "time" as const },
  { title: "Settings", icon: "settings" as const, link: "/userdetails" as const },
];

const ChildProfile = () => {
  const { colors } = useTheme();
  const { user, setUser } = useAuth();

  const resolvedAvatar = (user?.photo ?? "").trim() || CHILD_AVATAR;

  const handleSelectAvatar = async (
    selectedAvatar: string
  ) => {
    if (!user) return

    await setUser({
      ...user,
      photo:
        selectedAvatar.trim() || undefined,
    })
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* ── Profile Header ── */}
      <View className="items-center pt-4 pb-6">
        {/* Avatar */}
        <View className="relative">
          <Image
            source={{ uri: resolvedAvatar }}
            className="h-28 w-28 rounded-full border-4"
            style={{ borderColor: colors.primary }}
          />

          <UserModal
            avatar={resolvedAvatar}
            onSelectAvatar={handleSelectAvatar}
          />
        </View>

        {/* Name & Age */}
        <Text
          className="mt-4 text-3xl font-extrabold"
          style={{ color: colors.text }}
        >
          {user?.name || CHILD_NAME}
        </Text>

        <Text
          className="mt-1 text-base" 
          style={{ color: colors.secondaryText }}
        >
          {CHILD_AGE}
        </Text>

        {/* Stats Row */}
        <View className="mt-5 flex-row">
          <View className="items-center px-6">
            <Text
              className="text-2xl font-extrabold"
              style={{ color: colors.primary }}
            >
              12
            </Text>
            <Text
              className="mt-1 text-sm"
              style={{ color: colors.secondaryText }}
            >
              Stories
            </Text>
          </View>

          <View
            className="w-px h-10 self-center"
            style={{ backgroundColor: colors.border }}
          />

          <View className="items-center px-6">
            <Text
              className="text-2xl font-extrabold"
              style={{ color: colors.primary }}
            >
              4
            </Text>
            <Text
              className="mt-1 text-sm"
              style={{ color: colors.secondaryText }}
            >
              Hours
            </Text>
          </View>

          <View
            className="w-px h-10 self-center"
            style={{ backgroundColor: colors.border }}
          />

          <View className="items-center px-6">
            <Text
              className="text-2xl font-extrabold"
              style={{ color: colors.primary }}
            >
              7
            </Text>
            <Text
              className="mt-1 text-sm"
              style={{ color: colors.secondaryText }}
            >
              Badges
            </Text>
          </View>
        </View>
      </View>

      {/* ── Achievements Section ── */}
      <View className="mx-5 mb-6 rounded-3xl p-5" style={{ backgroundColor: colors.card }}>
        <View className="flex-row items-center justify-between mb-4">
          <Text
            className="text-lg font-extrabold"
            style={{ color: colors.text }}
          >
            Achievements
          </Text>

          <View className="flex-row items-center">
            <Ionicons name="trophy" size={16} color={colors.primary} />
            <Text
              className="ml-1 text-sm font-semibold"
              style={{ color: colors.primary }}
            >
              View All
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          {ACHIEVEMENTS.map((item) => (
            <AchievementBadge
              key={item.title}
              emoji={item.emoji}
              title={item.title}
            />
          ))}
        </View>
      </View>

      {/* ── Menu Items ── */}
      <View className="mx-5">
        <Text
          className="text-lg font-extrabold mb-4"
          style={{ color: colors.text }}
        >
          Quick Actions
        </Text>

        {MENU_ITEMS.map((item) => (
          <MenuItem key={item.title} title={item.title} icon={item.icon} link={item.link} />
        ))}
      </View>
    </ScrollView>
  );
};

export default React.memo(ChildProfile);
