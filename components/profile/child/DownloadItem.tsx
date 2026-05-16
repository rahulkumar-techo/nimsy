/**
 * Download Item
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
  type: string;
  size?: string;
};

const DownloadItem = ({
  title,
  type,
  size = "45MB",
}: Props) => {
  return (
    <TouchableOpacity className="mb-4 flex-row items-center justify-between rounded-[28px] bg-white p-5">
      <View className="flex-row items-center">
        <View className="h-16 w-16 rounded-2xl bg-violet-100" />

        <View className="ml-4">
          <Text className="text-xl font-bold text-slate-900">
            {title}
          </Text>

          <Text className="mt-1 text-slate-500">
            {type} • {size}
          </Text>
        </View>
      </View>

      <View className="h-14 w-14 items-center justify-center rounded-full bg-violet-100">
        <Ionicons
          name="download"
          size={22}
          color="#7c3aed"
        />
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(DownloadItem);
