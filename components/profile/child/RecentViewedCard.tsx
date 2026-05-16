/**
 * Recent Viewed Card
 */

import React from "react";

import {
  Image,
  Text,
  View,
} from "react-native";

type Props = {
  title: string;
  progress: string;
  image: string;
};

const RecentViewedCard = ({
  title,
  progress,
  image,
}: Props) => {
  return (
    <View className="mr-4 w-44">
      <Image
        source={{
          uri: image,
        }}
        className="h-40 w-full rounded-[28px]"
      />

      <Text className="mt-3 text-xl font-bold text-slate-900">
        {title}
      </Text>

      <Text className="mt-1 text-slate-500">
        {progress}
      </Text>
    </View>
  );
};

export default React.memo(RecentViewedCard);
