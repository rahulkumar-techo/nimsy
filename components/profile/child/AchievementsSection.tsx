/**
 * Achievements Section
 */

import React from "react";

import {
    ListRenderItem,
    ScrollView,
    View,
} from "react-native";

import SectionHeader from "../SectionHeader";
import AchievementCard from "./AchievementCard";

type Achievement = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
};

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "1",
    title: "Explorer",
    subtitle: "Read 50 stories",
    emoji: "🏆",
  },
];

const renderAchievement: ListRenderItem<Achievement> = ({ item }) => (
  <AchievementCard
    title={item.title}
    subtitle={item.subtitle}
    emoji={item.emoji}
  />
);

const AchievementsSection = () => (
  <View>
    <SectionHeader
      title="Achievements"
      data={ACHIEVEMENTS}
      renderItem={renderAchievement}
      keyExtractor={(item) => item.id}
      horizontal
    />

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-6"
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
  </View>
);

export default React.memo(AchievementsSection);
