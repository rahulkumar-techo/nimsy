/**
 * Child Dashboard
 */

import React from "react";

import {
  ScrollView,
  View,
} from "react-native";

import ProfileHeader from "../ProfileHeader";

import StatsCard from "./StatsCard";

import SectionHeader from "../SectionHeader";

import AchievementCard from "./AchievementCard";

import FavoriteCard from "./FavoriteCard";

import DownloadItem from "./DownloadItem";

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

      <SectionHeader title="Achievements" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
      >
        {ACHIEVEMENTS.map((item) => (
          <AchievementCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            emoji={item.emoji}
          />
        ))}
      </ScrollView>

      <SectionHeader title="My Favorites" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
      >
        {FAVORITES.map((item) => (
          <FavoriteCard
            key={item.id}
            title={item.title}
            image={item.image}
          />
        ))}
      </ScrollView>

      <SectionHeader title="Downloads" />

      <DownloadItem
        title="Magic Forest"
        type="Story"
      />
    </View>
  );
};

export default ChildDashboard;
