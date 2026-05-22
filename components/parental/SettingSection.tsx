/**
 * Reusable Setting Section
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
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const SettingSection = ({
  title,
  value,
  icon,
}: Props) => {
  return (
    <TouchableOpacity className="bg-white rounded-3xl p-5 border border-gray-100 mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="bg-indigo-100 p-3 rounded-2xl">
            <Ionicons
              name={icon}
              size={22}
              color="#5B5FFF"
            />
          </View>

          <View className="ml-4">
            <Text className="font-semibold text-base">
              {title}
            </Text>

            <Text className="text-gray-500 mt-1">
              {value}
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-down"
          size={20}
          color="#777"
        />
      </View>
    </TouchableOpacity>
  );
};

export default SettingSection;