/**
 * Premium Profile Screen
 */

import React, {
  useState,
} from "react";

import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";

import ChildProfile from "@/components/profile/ChildProfile";
import ParentDashboard from "@/components/dashboard/ParentDashboard";

const ProfileScreen = () => {
  const [showMenu, setShowMenu] =
    useState(false);

  const [parentMode, setParentMode] =
    useState(false);

  const { colors } = useTheme();

  return (
    <SafeAreaView
      className="flex-1"
      edges={[
        "top",
        "left",
        "right",
      ]}
      style={{
        backgroundColor:
          colors.background,
      }}
    >
      {/* Header */}

      <View className="flex-row items-start justify-between px-5 pt-4 pb-6">

        <View className="flex-1">
          <Text
            className="text-5xl font-black"
            style={{
              color: colors.text,
            }}
          >
            Profile
          </Text>

          <Text
            className="mt-2 text-base leading-6"
            style={{
              color:
                colors.secondaryText,
            }}
          >
            Manage your learning &
            parental controls
          </Text>
        </View>

        {/* Menu */}

        <View className="relative">

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              setShowMenu(
                !showMenu
              )
            }
            className="h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              backgroundColor:
                colors.card,
            }}
          >
            <Ionicons
              name="menu"
              size={26}
              color={colors.text}
            />
          </TouchableOpacity>

          {/* Dropdown Menu */}

          {showMenu && (
            <View
              className="absolute right-0 top-16 z-50 w-72 rounded-3xl border p-3"
              style={{
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              }}
            >

              {/* Parent Mode */}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setParentMode(
                    !parentMode
                  );

                  setShowMenu(false);
                }}
                className="flex-row items-center rounded-2xl px-4 py-4"
              >

                <View
                  className="h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor:
                      colors.primary +
                      "20",
                  }}
                >
                  <Ionicons
                    name="shield-checkmark"
                    size={22}
                    color={
                      colors.primary
                    }
                  />
                </View>

                <View className="ml-4 flex-1">
                  <Text
                    className="text-base font-bold"
                    style={{
                      color:
                        colors.text,
                    }}
                  >
                    {parentMode
                      ? "Exit Parent Mode"
                      : "Enable Parent Mode"}
                  </Text>

                  <Text
                    className="mt-1 text-sm"
                    style={{
                      color:
                        colors.secondaryText,
                    }}
                  >
                    Open parental dashboard
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={
                    colors.secondaryText
                  }
                />
              </TouchableOpacity>

            </View>
          )}
        </View>
      </View>

      {/* Content */}

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {parentMode ? (
          <ParentDashboard />
        ) : (
          <ChildProfile />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;