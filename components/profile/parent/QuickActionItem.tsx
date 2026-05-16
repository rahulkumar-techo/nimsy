/**
 * Quick Action Item
 */

import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const QuickActionItem = ({
  title,
  icon,
}: Props) => {
  return (
    <TouchableOpacity className="mb-4 flex-row items-center justify-between rounded-[28px] bg-white p-5">
      <View className="flex-row items-center">
        <View className="mr-4 h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
          <Ionicons
            name={icon}
            size={24}
            color="#7c3aed"
          />
        </View>

        <Text className="text-lg font-bold text-slate-900">
          {title}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={24}
        color="gray"
      />
    </TouchableOpacity>
  );
};

export default React.memo(QuickActionItem);
