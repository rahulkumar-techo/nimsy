/**
 * Profile Details Screen
 */

import React from "react";

import {
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useLocalSearchParams,
} from "expo-router";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import ProfileMenuItem from "@/components/ProfileMenuItem";

import {
  useTheme,
} from "@/context/ThemeContext";
import { PROFILE_DATA } from "@/constants/profileData";



const ProfileDetails = () => {
  const { id } = useLocalSearchParams<{
    id?: string | string[];
  }>();

  const { colors } = useTheme();

  const profileId =
    Array.isArray(id)
      ? id[0]
      : id ?? "Unknown";

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Text
            className="text-3xl font-bold"
            style={{
              color: colors.text,
            }}
          >
            {profileId}
          </Text>

          <Text
            className="mt-2 text-base"
            style={{
              color: colors.secondaryText,
            }}
          >
            Personalized dashboard & activity
          </Text>
        </View>

        {/* Hero Banner */}
        <View className="px-5 mt-4">
          <View
            className="rounded-[28px] overflow-hidden"
            style={{
              backgroundColor: colors.card,
            }}
          >
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1516321310764-8d15f1dfc1b8?q=80&w=1200&auto=format&fit=crop",
              }}
              className="w-full h-52"
            />

            <View className="absolute inset-0 bg-black/40" />

            <View className="absolute bottom-5 left-5 right-5">
              <Text className="text-white text-2xl font-bold">
                Welcome Back 👋
              </Text>

              <Text className="text-gray-200 mt-2 text-sm">
                Continue learning & track your
                progress
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="flex-row justify-between px-5 mt-6">
          {[
            {
              label: "Courses",
              value: "24",
              icon: "book-outline",
            },
            {
              label: "Progress",
              value: "78%",
              icon: "trending-up-outline",
            },
            {
              label: "Certificates",
              value: "5",
              icon: "ribbon-outline",
            },
          ].map((item) => (
            <View
              key={item.label}
              className="flex-1 rounded-3xl p-4 mr-3"
              style={{
                backgroundColor: colors.card,
              }}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={colors.primary}
              />

              <Text
                className="mt-3 text-xl font-bold"
                style={{
                  color: colors.text,
                }}
              >
                {item.value}
              </Text>

              <Text
                className="mt-1 text-sm"
                style={{
                  color: colors.secondaryText,
                }}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Section Title */}
        <View className="px-5 mt-8 mb-3">
          <Text
            className="text-xl font-bold"
            style={{
              color: colors.text,
            }}
          >
            Activity & Collections
          </Text>
        </View>

        {/* Menu Cards */}
        <View className="px-5">
          {PROFILE_DATA.map((item) => (
            <ProfileMenuItem
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon as any}
              rightText={item.count}
              thumbnail={item.thumbnail}
              link={item.link}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileDetails;