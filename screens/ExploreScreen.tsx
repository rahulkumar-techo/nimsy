import { categories as storyCategories } from "@/constants/story";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExploreAudioStories from "../components/explore/ExploreAudioStories";
import ExploreByAge from "../components/explore/ExploreByAge";
import ExploreCategories from "../components/explore/ExploreCategories";
import ExploreContinueWatching from "../components/explore/ExploreContinueWatching";
import ExploreHeader from "../components/explore/ExploreHeader";
import ExploreNewTrending from "../components/explore/ExploreNewTrending";
import ExplorePopularSearches from "../components/explore/ExplorePopularSearches";
import ExploreRecommended from "../components/explore/ExploreRecommended";
import ExploreSearch from "../components/explore/ExploreSearch";
import ExploreTopCategories from "../components/explore/ExploreTopCategories";
import { CONTINUE_DATA } from "./home";

type CategoryItem = {
  title: string;
  icon: string;
};

type TopCategoryItem = {
  id: string;
  title: string;
  image: string;
  count: number;
};

type TrendingItem = {
  title: string;
  image: string;
};

type RecommendedItem = {
  title: string;
  description: string;
  image: string;
  duration: string;
};

const categories: CategoryItem[] = [
  { title: "Stories", icon: "book" },
  { title: "Videos", icon: "play-circle" },
  { title: "Audio", icon: "headset" },
  { title: "Learning", icon: "school" },
];

const popularSearches = ["Lion", "Bedtime", "Animals", "Friendship", "Magic"];

const topCategories: TopCategoryItem[] = storyCategories.slice(0, 3).map((category) => ({
  id: category.id,
  title: category.title,
  image: category.thumbnail,
  count: category.stories.length,
}));

const trending: TrendingItem[] = [
  {
    title: "Magic Forest",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  },
  {
    title: "The Clever Fox",
    image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5",
  },
];

const recommended: RecommendedItem[] = [
  {
    title: "The Honest Rabbit",
    description: "A fun moral story for children.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    duration: "5 mins",
  },
  {
    title: "The Friendly Owl",
    description: "A bedtime tale about kindness.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    duration: "6 mins",
  },
];

const ageGroups = ["3-5", "6-8", "9+"];

const ExploreScreen = () => {
  const router = useRouter();

  const handleCategory = (id: string, title: string) => {
    router.push({
      pathname: "/category",
      params: { id, title },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <ExploreHeader />
        <ExploreSearch />
        <ExploreCategories categories={categories} />
        <ExplorePopularSearches items={popularSearches} />
        <ExploreTopCategories
          items={topCategories}
          onItemPress={(item) => item.id && handleCategory(item.id, item.title)}
        />
        <ExploreContinueWatching
        data={CONTINUE_DATA}
        limit={2}
        horizontal
        scrollEnabled
        />
        <ExploreNewTrending items={trending} />
        <ExploreAudioStories />
        <ExploreByAge groups={ageGroups} />
        <ExploreRecommended items={recommended} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExploreScreen;
