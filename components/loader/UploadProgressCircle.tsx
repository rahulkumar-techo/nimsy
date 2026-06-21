/**
 * Circular upload progress indicator
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Props {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

export function UploadProgressCircle({
  progress,
  size = 160,
  strokeWidth = 12,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const safeProgress = Math.min(100, Math.max(0, progress));

  const strokeDashoffset =
    circumference - (safeProgress / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />

        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2563EB"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View style={styles.center}>
        <Text style={styles.percent}>
          {Math.round(safeProgress)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    position: "absolute",
    alignItems: "center",
  },
  percent: {
    fontSize: 34,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

/*
const progress =
  useAppSelector(
    selectUploadProgress,
  );

const loading =
  useAppSelector(
    selectUploadLoading,
  );

const message =
  useAppSelector(
    selectUploadMessage,
  );
*/ 