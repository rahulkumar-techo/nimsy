/**
 * Explore Screen
 */

import {
  useMemo,
  useState,
} from "react";

import {
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useRouter,
} from "expo-router";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  categories as storyCategories,
} from "@/constants/story";

import {
  CONTINUE_DATA,
} from "./home";

import SearchCard from "@/components/SearchCard";
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
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
};

const categories: CategoryItem[] = [
  {
    title: "Stories",
    icon: "book",
  },
  {
    title: "Videos",
    icon: "play-circle",
  },
  {
    title: "Audio",
    icon: "headset",
  },
  {
    title: "Learning",
    icon: "school",
  },
];

const popularSearches = [
  "Lion",
  "Bedtime",
  "Animals",
  "Friendship",
  "Magic",
];

const topCategories: TopCategoryItem[] =
  storyCategories
    .slice(0, 3)
    .map((category) => ({
      id: category.id,
      title: category.title,
      image: category.thumbnail,
      count: category.stories.length,
    }));

const trending: TrendingItem[] = [
  {
    title: "Magic Forest",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  },
  {
    title: "The Clever Fox",
    image:
      "https://images.unsplash.com/photo-1474511320723-9a56873867b5",
  },
];

const recommended: RecommendedItem[] = [
  {
    id: "1",
    title: "The Honest Rabbit",
    description:
      "A fun moral story for children.",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    duration: "5 mins",
  },
  {
    id: "2",
    title: "The Friendly Owl",
    description:
      "A bedtime tale about kindness.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    duration: "6 mins",
  },
];

const ageGroups = [
  "3-5",
  "6-8",
  "9+",
];

const ExploreScreen = () => {
  const router = useRouter();

  const [search, setSearch] =
    useState("");

  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState("All");

  const isSearching =
    search.trim().length > 0;

  const filteredCategories =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase();
      const matchesFilter =
        selectedFilter === "All" ||
        selectedFilter === "Stories";

      if (!matchesFilter) {
        return [];
      }

      return storyCategories.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(
              normalizedSearch
            )
      );
    }, [
      search,
      selectedFilter,
    ]);

  const handleCategory = (
    id: string,
    title: string
  ) => {
    router.push({
      pathname: "/category",
      params: {
        id,
        title,
      },
    });
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={[
        "top",
        "left",
        "right",
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        <ExploreHeader />

        <ExploreSearch
          value={search}
          onChangeText={setSearch}
          selectedFilter={
            selectedFilter
          }
          onSelectFilter={
            setSelectedFilter
          }
        />

        {
          isSearching ? (
            <View className="px-5 pt-6">
              {
                filteredCategories.length >
                0 ? (
                  filteredCategories.map(
                    (item) => (
                      <SearchCard
                        key={
                          item.id
                        }
                        item={item}
                        onPress={() =>
                          handleCategory(
                            item.id,
                            item.title
                          )
                        }
                      />
                    )
                  )
                ) : (
                  <View className="items-center pt-24">
                    <Ionicons
                      name="search-outline"
                      size={70}
                      color="#CBD5E1"
                    />

                    <Text className="mt-5 text-lg font-semibold text-gray-500">
                      No results
                      found
                    </Text>

                    <Text className="mt-2 text-center text-sm text-gray-400">
                      Try another
                      keyword
                    </Text>
                  </View>
                )
              }
            </View>
          ) : (
            <View>
              <ExploreCategories
                categories={
                  categories
                }
              />

              <ExplorePopularSearches
                items={
                  popularSearches
                }
              />

              <ExploreTopCategories
                items={
                  topCategories
                }
                onItemPress={(
                  item
                ) => {
                  if (!item.id) {
                    return;
                  }

                  handleCategory(
                    item.id,
                    item.title
                  );
                }}
              />

              <ExploreContinueWatching
                data={
                  CONTINUE_DATA
                }
                limit={2}
                horizontal
                scrollEnabled
              />

              <ExploreNewTrending
                items={trending}
              />

              <ExploreAudioStories />

              <ExploreByAge
                // groups={
                //   ageGroups
                // }
              />

              <ExploreRecommended
                items={
                  recommended
                }
              />
            </View>
          )
        }
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExploreScreen;
