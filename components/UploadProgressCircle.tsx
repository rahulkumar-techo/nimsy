import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

type Props = {
  progress: number;
  size?: number;
  strokeWidth?: number;
};

export function UploadProgressCircle({
  progress,
  size = 120,
  strokeWidth = 10,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (progress / 100) * circumference;

  return (
    <View className="items-center justify-center">
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
          stroke="#3B82F6"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View className="absolute items-center">
        <Text className="text-xl font-bold text-white">
          {Math.floor(progress)}%
        </Text>
        <Text className="text-xs text-gray-500">
          Uploading
        </Text>
      </View>
    </View>
  );
}