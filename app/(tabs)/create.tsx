import React from "react";
import { router } from "expo-router";
import {
  Text,
  View,
  Pressable,
} from "react-native";
import Animated, {
  FadeIn
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";
import AnimatedBackground from "@/components/AnimatedBackground";

function AnimatedCard({
  item,
}: any) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => router.push(item.route)}
    >
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 24,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 100,
              backgroundColor: colors.primary,
              opacity: 0.15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name={item.icon}
              size={28}
              color={colors.primary}
            />
          </View>

          <View
            style={{
              flex: 1,
              marginLeft: 16,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              {item.title}
            </Text>

            <Text
              style={{
                color: colors.text,
                opacity: 0.7,
                marginTop: 4,
              }}
            >
              Start creating now
            </Text>
          </View>

          <Ionicons
            name="arrow-forward"
            size={22}
            color={colors.primary}
          />
        </View>
      </View>
    </Pressable>
  );
}

export default function CreateContentScreen() {
  const { colors } = useTheme();

  const actions = [
    {
      title: "Upload Video",
      icon: "videocam",
      route: "/(create)/video",
    },
    {
      title: "Upload Audio",
      icon: "musical-notes",
      route: "/(create)/audio",
    },
    {
      title: "Create Post",
      icon: "document-text",
      route: "/(create)/post",
    },
  ];

  return (
    <AnimatedBackground
      primaryColor={colors.primary}
      backgroundColor={colors.background}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "transparent",
        }}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
          }}
        >
          <Animated.View entering={FadeIn}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "800",
                color: colors.text,
                marginTop: 20,
              }}
            >
              Create Content
            </Text>

            <Text
              style={{
                color: colors.text,
                opacity: 0.7,
                marginTop: 8,
                marginBottom: 30,
              }}
            >
              Choose what you want to publish today.
            </Text>
          </Animated.View>

          {actions.map((item, index) => (
            <AnimatedCard
              key={item.title}
              item={item}
              index={index}
              colors={colors}
            />
          ))}
        </View>
      </SafeAreaView>
    </AnimatedBackground>
  );
}