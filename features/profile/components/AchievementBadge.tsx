/**
 * Achievement Badge
 */

import {
  Text,
  View,
} from "react-native";

type Props = {
  emoji: string;
  title: string;
};

const AchievementBadge = ({
  emoji,
  title,
}: Props) => {
  return (
    <View className="items-center">
      <View className="w-16 h-16 rounded-full bg-yellow-100 items-center justify-center">
        <Text className="text-3xl">
          {emoji}
        </Text>
      </View>

      <Text className="text-xs font-medium mt-2 text-center">
        {title}
      </Text>
    </View>
  );
};

export default AchievementBadge;