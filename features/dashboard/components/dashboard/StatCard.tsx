/**
 * Dashboard Stats Card
 */

import { Text, View } from "react-native";

type Props = {
  title: string;
  value: string;
  unit: string;
};

const StatCard = ({
  title,
  value,
  unit,
}: Props) => {
  return (
    <View className="bg-white flex-1 rounded-3xl p-4 border border-gray-100">
      <Text className="text-gray-500 text-xs">
        {title}
      </Text>

      <Text className="text-4xl font-bold text-primary mt-3">
        {value}
      </Text>

      <Text className="text-primary font-medium mt-1">
        {unit}
      </Text>
    </View>
  );
};

export default StatCard;