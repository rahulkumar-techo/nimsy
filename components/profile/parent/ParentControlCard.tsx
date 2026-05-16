/**
 * Parent Control Card
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
  subtitle: string;
  status: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const ParentControlCard = ({
  title,
  subtitle,
  status,
  icon,
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      className="mb-4 flex-row items-center rounded-[24px] border border-violet-100 bg-violet-50 p-4"
    >
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white">
        <Ionicons
          name={icon}
          size={26}
          color="#7c3aed"
        />
      </View>

      <View className="ml-4 flex-1">
        <View className="flex-row items-start justify-between">
          <Text className="flex-1 pr-3 text-lg font-black text-slate-900">
            {title}
          </Text>

          <View className="rounded-full bg-white px-3 py-1">
            <Text className="text-xs font-bold text-violet-700">
              {status}
            </Text>
          </View>
        </View>

        <Text className="mt-1 text-sm font-medium text-slate-500">
          {subtitle}
        </Text>
      </View>

      <View className="ml-3 h-9 w-9 items-center justify-center rounded-full bg-white">
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#7c3aed"
        />
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(ParentControlCard);
