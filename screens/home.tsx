/**
 * Home Screen (NativeWind Version)
 * Tailwind-based styling
 */

import ExploreCategories from "@/components/explore/ExploreCategories"
import ExploreContinueWatching from "@/components/explore/ExploreContinueWatching"
import ExploreTopCategories from "@/components/explore/ExploreTopCategories"
import { type CategoryChip } from "@/components/home-comp/CategoriesChip"

import FeatureCarousel from "@/components/home-comp/FeatureCarousel"
import HomeSectionContainer from "@/components/home-comp/HomeSectionContainer"
import NavHeader from "@/components/NavHeader"
import { categories, stories } from "@/constants/story"
import { useTheme } from "@/context/ThemeContext"
import { useRouter } from "expo-router"
import { ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

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
    route: "/stories",
  },
  {
    id: "videos",
    title: "Videos",
    icon: "play-circle",
    route: "/videos",
  },
  {
    id: "audio",
    title: "Audio",
    icon: "headset",
    route: "/audio",
  },
  {
    id: "favorites",
    title: "Favorites",
    icon: "heart",
    route: "/favorites",
  },
];

const TOP_CATEGORY_DATA = categories.map((category) => ({
  id: category.id,
  title: category.title,
  image: category.thumbnail,
  count: category.stories.length,
}))

/**
 * Continue Watching Dummy Data
 */

export const CONTINUE_DATA = [
  ...stories.slice(0, 5).map((story, index) => ({
    id: story.id,
    title: story.title,
    image: story.thumbnail,
    progress: [75, 45, 90, 60, 30][index] ?? 25,
    duration: story.duration,
    videoUrl: story.videoUrl,
  })),
]

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleCategory = (id: string, title: string) => {
    router.push({
      pathname: "/category",
      params: { id, title },
    });
  };
  return (
    <SafeAreaView
      className="flex-1"
      edges={["top", "left", "right"]}
      style={{ backgroundColor: colors.background }}
    >
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

        <ExploreCategories categories={CHIP_DATA} 
        
        />
        <ExploreTopCategories
          items={TOP_CATEGORY_DATA}
          onItemPress={(item) => item.id && handleCategory(item.id, item.title)}
        />

        {/* <HomeSectionContainer className="mt-8">
          <ContinueWatchingSection data={CONTINUE_DATA} />
        </HomeSectionContainer> */}
        <ExploreContinueWatching
          data={CONTINUE_DATA}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
