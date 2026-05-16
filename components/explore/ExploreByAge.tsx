import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  groups: string[];
};

const ExploreByAge = ({ groups }: Props) => (
  <View className="mt-10 px-5">
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="text-xl font-bold text-black">Explore by Age</Text>
      <Text className="font-semibold text-violet-600">See All</Text>
    </View>

    <View className="flex-row justify-between">
      {groups.map((item, index) => (
        <TouchableOpacity key={index} className="h-32 w-[31%] items-center justify-center rounded-3xl bg-violet-100">
          <Text className="text-3xl font-bold text-violet-700">{item}</Text>
          <Text className="mt-2 text-gray-600">Years</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default ExploreByAge;
