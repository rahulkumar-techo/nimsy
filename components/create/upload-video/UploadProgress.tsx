/**
 * UploadProgress overlay
 */

import  { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  progress: number;
};

export default function UploadProgress({ progress }: Props) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress,anim]);

  const done = progress >= 100;

  return (
    <View className="absolute inset-0 items-center justify-center" style={styles.overlay}>
      <View className="w-4/5 rounded-3xl p-7 items-center" style={[styles.card, { backgroundColor: colors.card }]}>
        <View className="w-16 h-16 rounded-3xl items-center justify-center" style={{ backgroundColor: done ? colors.success : colors.accentSurface }}>
          <Ionicons
            name={done ? "checkmark" : "cloud-upload-outline"}
            size={32}
            color={done ? "#fff" : colors.accent}
          />
        </View>

        <Text className="text-lg font-bold" style={{ color: colors.text }}>
          {done ? "Upload Complete!" : "Uploading Video…"}
        </Text>

        <View className="w-full h-2 rounded" style={{ backgroundColor: colors.surface }}>
          <Animated.View
            style={[
              styles.fill,
              {
                backgroundColor: done ? colors.success : colors.accent,
                width: anim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }),
              },
            ]}
          />
        </View>

        <Text className="text-3xl font-extrabold" style={{ color: done ? colors.success : colors.accent }}>
          {progress}%
        </Text>

        {!done && (
          <Text className="text-xs" style={{ color: colors.secondaryText }}>
            Keep the app open while uploading
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99,
  },
  card: {
    borderRadius: 22,
    padding: 28,
    alignItems: "center",
    gap: 14,
  },
  fill: { height: "100%", borderRadius: 4 },
});