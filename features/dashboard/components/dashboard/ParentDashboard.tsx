/**
 * Parent Dashboard Screen
 */

import {
  ScrollView,
  Text,
  View,
} from "react-native";

import StatCard from "./StatCard";
import ActivityChart from "./ActivityChart";
import RecentActivityCard from "./RecentActivityCard";
import QuickActionCard from "./QuickActionCard";

const ParentDashboard = () => {
  return (
    <ScrollView className="flex-1 bg-[#F7F8FD]">
      <View className="px-5 pt-16 pb-10">

        <Text className="text-3xl font-bold">
          Hello, Parents! 👋
        </Text>

        <View className="flex-row gap-3 mt-6">
          <StatCard
            title="Screen Time"
            value="45"
            unit="min"
          />

          <StatCard
            title="Stories Read"
            value="3"
            unit="Today"
          />

          <StatCard
            title="Videos Watched"
            value="2"
            unit="Today"
          />
        </View>

        <Text className="text-xl font-bold mt-8 mb-4">
          Activity Overview
        </Text>

        <ActivityChart />

        <Text className="text-xl font-bold mt-8 mb-4">
          Recent Activity
        </Text>

        <RecentActivityCard />

        <Text className="text-xl font-bold mt-8 mb-4">
          Quick Actions
        </Text>

        <View className="flex-row gap-3">
          <QuickActionCard
            title="Parental Controls"
            subtitle="Manage limits"
            icon="shield-checkmark"
          />

          <QuickActionCard
            title="Usage Reports"
            subtitle="Detailed insights"
            icon="stats-chart"
          />

          <QuickActionCard
            title="Content Filters"
            subtitle="Manage content"
            icon="filter"
          />
        </View>

      </View>
    </ScrollView>
  );
};

export default ParentDashboard;