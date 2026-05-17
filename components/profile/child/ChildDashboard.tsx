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

type Achievement = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
};

type Favorite = {
  id: string;
  title: string;
  image: string;
};

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "1",
    title: "Explorer",
    subtitle: "Read 50 stories",
    emoji: "🏆",
  },
];

const FAVORITES: Favorite[] = [
  {
    id: "1",
    title: "Lion & Mouse",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
  },
];

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
