import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  primaryColor: string;
  backgroundColor?: string;
}

export default function AnimatedBackground({
  children,
  primaryColor,
  backgroundColor = "#fff",
}: AnimatedBackgroundProps) {
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withRepeat(
      withTiming(25, {
        duration: 6000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [offset]);

  const topBlobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  const bottomBlobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -offset.value }],
  }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={[
          topBlobStyle,
          {
            position: "absolute",
            top: -60,
            right: -40,
            width: 220,
            height: 220,
            borderRadius: 110,
            backgroundColor: primaryColor,
            opacity: 0.12,
          },
        ]}
      />

      <Animated.View
        style={[
          bottomBlobStyle,
          {
            position: "absolute",
            bottom: -60,
            left: -40,
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: primaryColor,
            opacity: 0.08,
          },
        ]}
      />

      {/* Extra accent */}
      <View
        style={{
          position: "absolute",
          top: 120,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: 24,
          backgroundColor: primaryColor,
          opacity: 0.05,
          transform: [{ rotate: "25deg" }],
        }}
      />

      {children}
    </View>
  );
}