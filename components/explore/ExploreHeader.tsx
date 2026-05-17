import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";

const ExploreHeader = () => {
  const { colors } = useTheme();

  return (
    <View className="px-5 pt-3">
      <Text className="text-3xl font-bold" style={{ color: colors.text }}>
        Explore
      </Text>
      <Text className="mt-1" style={{ color: colors.secondaryText }}>
        Discover stories, videos & learning
      </Text>
    </View>
  );
};

export default ExploreHeader;
