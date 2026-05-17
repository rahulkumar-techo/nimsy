/**
 * Child Dashboard
 */


import {
    View
} from "react-native";

import ProfileHeader from "../ProfileHeader";

import StatsCard from "./StatsCard";

import AchievementsSection from "./AchievementsSection";
import DownloadSection from "./DownloadSection";
import FavoritesSection from "./FavoritesSection";

const ChildDashboard = () => {
  return (
    <View className="px-5">
      <ProfileHeader />

      <StatsCard
        points="2,450"
        streak="23"
      />

      <AchievementsSection />
      <FavoritesSection />
      <DownloadSection />
    </View>
  );
};

export default ChildDashboard;
