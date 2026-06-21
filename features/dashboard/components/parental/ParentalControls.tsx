/**
 * Parental Controls Screen
 */

import {
  ScrollView,
  Text,
  View,
} from "react-native";

import SettingSection from "./SettingSection";
import OptionChip from "./OptionChip";

const ParentalControls = () => {
  return (
    <ScrollView className="flex-1 bg-[#F7F8FD]">
      <View className="px-5 pt-16 pb-10">

        <Text className="text-3xl font-bold mb-6">
          Parental Controls
        </Text>

        <SettingSection
          title="Daily Time Limit"
          value="60 Minutes"
          icon="time"
        />

        <SettingSection
          title="Content Age Range"
          value="3-8 Years"
          icon="people"
        />

        <SettingSection
          title="Allow Downloads"
          value="Allowed"
          icon="cloud-download"
        />

        <View className="bg-white rounded-3xl p-5 border border-gray-100">

          <Text className="font-semibold text-lg">
            Content Preferences
          </Text>

          <View className="flex-row flex-wrap mt-5">
            <OptionChip
              title="Moral"
              active
            />

            <OptionChip
              title="Educational"
              active
            />

            <OptionChip
              title="Animal"
              active
            />

            <OptionChip title="Fantasy" />

            <OptionChip title="Adventure" />

            <OptionChip title="Comedy" />
          </View>

        </View>

      </View>
    </ScrollView>
  );
};

export default ParentalControls;