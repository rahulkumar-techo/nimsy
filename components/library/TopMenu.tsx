/**
 * Top Menu Component
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
    color: string;
  };
};

const TopMenu = ({
  item,
}: Props) => {
  return (
    <TouchableOpacity className="items-center">
      <View
        className={`h-20 w-20 items-center justify-center rounded-[30px] ${item.color}`}
      >
        <Ionicons
          name={item.icon as any}
          size={34}
          color="white"
        />
      </View>

      <Text className="mt-3 text-base font-semibold text-slate-800">
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(
  TopMenu
);