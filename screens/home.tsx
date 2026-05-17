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
import { categories } from "@/constants/story"
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
  {
    id: "1",
    title:
      "The Kind Elephant",
    image:
      "https://images.unsplash.com/photo-1578321272176-b7bbc0679853",
    progress: 75,
    duration: "6:20",
  },
  {
    id: "2",
    title:
      "Brave Little Turtle",
    image:
      "https://images.unsplash.com/photo-1552728089-57bdde30beb3",
    progress: 45,
    duration: "8:10",
  },
  {
    id: "3",
    title:
      "The Clever Fox",
    image:
      "https://images.unsplash.com/photo-1474511320723-9a56873867b5",
    progress: 90,
    duration: "5:45",
  },
  {
    id: "4",
    title:
      "Magic Forest Adventure",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    progress: 60,
    duration: "10:12",
  },
  {
    id: "5",
    title:
      "The Lion & Mouse",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
    progress: 30,
    duration: "7:00",
  },
];

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

        <ExploreCategories categories={CHIP_DATA} />
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
