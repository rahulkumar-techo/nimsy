/**
 * Playlist Card Component
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
  item: {
    title: string;
    icon: string;
  };
};

const PlaylistCard = ({
  item,
}: Props) => {
  return (
    <TouchableOpacity className="mb-4 flex-row items-center justify-between rounded-[28px] bg-slate-50 p-5">
      <View className="flex-row items-center">
        <View className="mr-4 h-16 w-16 items-center justify-center rounded-3xl bg-violet-100">
          <Ionicons
            name={item.icon as any}
            size={28}
            color="#7c3aed"
          />
        </View>

        <View>
          <Text className="text-xl font-bold text-slate-900">
            {item.title}
          </Text>

          <Text className="mt-1 text-slate-500">
            15 items
          </Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={24}
        color="gray"
      />
    </TouchableOpacity>
  );
};

export default React.memo(
  PlaylistCard
);