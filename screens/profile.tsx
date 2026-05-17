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

import ChildDashboard from "@/components/profile/child/ChildDashboard";

import ParentDashboard from "@/components/profile/parent/ParentDashboard";
import { useTheme } from "@/context/ThemeContext";

const tabs = [
  {
    id: "child",
    title:
      "Child Dashboard",
  },
  {
    id: "parent",
    title:
      "Parent Dashboard",
  },
];

const ProfileScreen = () => {
  const [activeTab, setActiveTab] =
    useState("child");
  const { colors } = useTheme();

  return (
    <SafeAreaView
         className="flex-1"
         edges={[
           "top",
           "left",
           "right",
         ]}
         style={{ backgroundColor: colors.background }}
       >
         <ScrollView
           showsVerticalScrollIndicator={
             false
           }
           contentContainerStyle={{
             paddingBottom: 120,
           }}
         >
        <View className="px-5 pt-4">
          <Text
            className="text-5xl font-black"
            style={{ color: colors.text }}
          >
            Profile
          </Text>

          <Text
            className="mt-2 text-base"
            style={{ color: colors.secondaryText }}
          >
            Manage your
            learning &
            parental controls
          </Text>
        </View>

        <View className="mt-8 flex-row px-5">
          {tabs.map((tab) => {
            const active =
              activeTab === tab.id;

            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.9}
                onPress={() =>
                  setActiveTab(tab.id)
                }
                className="mr-4 flex-1 rounded-full px-5 py-4"
                style={{
                  backgroundColor: active ? colors.primary : colors.card,
                }}
              >
                <Text
                  className="text-center text-base font-bold"
                  style={{
                    color: active ? colors.buttonText : colors.text,
                  }}
                >
                  {tab.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="mt-8">
          {activeTab === "child" ? (
            <ChildDashboard />
          ) : (
            <ParentDashboard />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
