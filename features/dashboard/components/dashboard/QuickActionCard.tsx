/**
 * Quick Action Card
 */

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
  icon: keyof typeof Ionicons.glyphMap;
};

const QuickActionCard = ({
  title,
  subtitle,
  icon,
}: Props) => {
  return (
    <TouchableOpacity className="bg-white rounded-3xl p-5 items-center flex-1 border border-gray-100">
      <View className="bg-indigo-100 p-4 rounded-2xl">
        <Ionicons
          name={icon}
          size={24}
          color="#5B5FFF"
        />
      </View>

      <Text className="font-semibold text-center mt-4">
        {title}
      </Text>

      <Text className="text-gray-500 text-xs text-center mt-2">
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
};

export default QuickActionCard;