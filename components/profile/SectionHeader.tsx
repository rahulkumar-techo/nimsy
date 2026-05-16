/**
 * Profile Section Header
 */

import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  title: string;
};

const SectionHeader = ({
  title,
}: Props) => {
  return (
    <View className="mb-4 mt-8 flex-row items-center justify-between">
      <Text className="text-2xl font-black text-slate-900">
        {title}
      </Text>

      <TouchableOpacity>
        <Text className="font-bold text-violet-600">
          View All
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(
  SectionHeader
);