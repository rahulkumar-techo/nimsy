/**
 * Child Profile Screen
 */

import {
  ScrollView,
  Text,
  View,
} from "react-native";

import AchievementBadge from "./AchievementBadge";
import MenuItem from "./MenuItem";

const ChildProfile = () => {
  return (
    <ScrollView className="flex-1 bg-[#F7F8FD]">

      <View className="bg-[#6A5CFF] rounded-b-[50px] pt-16 pb-10 px-5">

        <View className="items-center">

          <View className="w-32 h-32 rounded-full bg-white" />

          <Text className="text-white text-4xl font-bold mt-5">
            Aarav
          </Text>

          <Text className="text-indigo-100 mt-2">
            Level 2
          </Text>

          <View className="w-full h-3 bg-indigo-300 rounded-full mt-6">
            <View className="w-1/2 h-3 bg-yellow-400 rounded-full" />
          </View>

          <Text className="text-white mt-2">
            120 / 200
          </Text>

        </View>

      </View>

      <View className="px-5 mt-8">

        <Text className="text-2xl font-bold mb-5">
          Achievements
        </Text>

        <View className="flex-row justify-between mb-8">
          <AchievementBadge
            emoji="⭐"
            title="First Story"
          />

          <AchievementBadge
            emoji="🏆"
            title="5 Stories"
          />

          <AchievementBadge
            emoji="🔥"
            title="7 Day Streak"
          />

          <AchievementBadge
            emoji="❄️"
            title="Explorer"
          />
        </View>

        <MenuItem
          title="My Favorites"
          icon="heart-outline"
      
        />

        <MenuItem
          title="Downloaded"
          icon="download-outline"
        />

        <MenuItem
          title="Recently Viewed"
          icon="time-outline"
        />

        <MenuItem
          title="Progress"
          icon="stats-chart-outline"
        />

        <MenuItem
          title="Certificates"
          icon="ribbon-outline"
        />

      </View>

    </ScrollView>
  );
};

export default ChildProfile;