/**
 * Section Header Component
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
    <View className="mb-5 flex-row items-center justify-between px-5">
      <Text className="text-3xl font-black text-slate-900">
        {title}
      </Text>

      <TouchableOpacity>
        <Text className="text-base font-bold text-violet-600">
          See All
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(
  SectionHeader
);