/**
 * Home Screen (NativeWind Version)
 * Tailwind-based styling
 */

import React from "react"
import NavHeader from "@/components/NavHeader"
import { ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import CategoryChips, { type CategoryChip } from "@/components/home-comp/CategoriesChip"
import FeatureCarousel from "@/components/home-comp/FeatureCarousel"
import CategorySection from "@/components/home-comp/CategorySection"
import ContinueWatchingSection from "@/components/home-comp/ContinueWatchingSection"
import HomeSectionContainer from "@/components/home-comp/HomeSectionContainer"

const DATA = [
  {
    title: "The Honest Rabbit",
    subtitle: "Daily Story",
    image: require("../assets/branding/nimsy-logo.png"),
  },
  {
    title: "Magic Forest",
    subtitle: "Adventure",
    image: require("../assets/branding/nimsy-logo.png"),
  },
]

export const CHIP_DATA: CategoryChip[] = [
  {
    id: "stories",
    title: "Stories",
    icon: "book",
  },
  {
    id: "videos",
    title: "Videos",
    icon: "play-circle",
  },
  {
    id: "audio",
    title: "Audio",
    icon: "headset",
  },
  {
    id: "favorites",
    title: "Favorites",
    icon: "heart",
  },
]


const CATEGORY_DATA = [
  {
    title: "Animal",
    subtitle: "Stories",
    image: require("../assets/home/animals.png"),
  },
  {
    title: "Moral",
    subtitle: "Stories",
    image: require("../assets/home/moral.png"),
  },
  {
    title: "Bedtime",
    subtitle: "Stories",
    image: require("../assets/home/bedtime.png"),
  },
  {
    title: "Learning",
    subtitle: "Stories",
    image: require("../assets/home/learn.png"),
  },
]
const CONTINUE_DATA = [
  {
    id: "1",
    title: "The Kind Elephant",
    image: require("../assets/branding/nimsy-logo.png"),
  },
  {
    id: "2",
    title: "Brave Little Turtle",
    image: require("../assets/branding/nimsy-logo.png"),
  },
]

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-blue-50" edges={["top", "left", "right"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      >
        <HomeSectionContainer>
          <NavHeader />
        </HomeSectionContainer>

        <View className="mt-4">
          <FeatureCarousel data={DATA} />
        </View>

        <HomeSectionContainer className="mt-8">
          <View className="w-full gap-3">
            <CategoryChips data={CHIP_DATA} />
          </View>
        </HomeSectionContainer>

        <HomeSectionContainer className="mt-8">
          <CategorySection data={CATEGORY_DATA} />
        </HomeSectionContainer>

        <HomeSectionContainer className="mt-8">
          <ContinueWatchingSection data={CONTINUE_DATA} />
        </HomeSectionContainer>
      </ScrollView>
    </SafeAreaView>
  )
}
