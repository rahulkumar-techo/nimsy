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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        <View className="px-5 pt-4">
          <Text className="text-5xl font-black text-slate-900">
            Profile
          </Text>

          <Text className="mt-2 text-base text-slate-500">
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
                className={`mr-4 flex-1 rounded-full px-5 py-4 ${
                  active
                    ? "bg-violet-600"
                    : "bg-slate-100"
                }`}
              >
                <Text
                  className={`text-center text-base font-bold ${
                    active
                      ? "text-white"
                      : "text-slate-700"
                  }`}
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
