/**
 * Explore New Trending Section
 */


import {
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { durationToSeconds, openVideoPlayer } from "@/utils/videoNavigation";
import SeeAll from "../../../components/SeeAll";

type Item = {
  id?: string;
  title: string;
  image: string;
  duration?: string;
  videoUrl?: string;
};

type Props = {
  items: Item[];


};

const ExploreNewTrending = ({
  items
}: Props) => {
  const { colors } = useTheme();

  /**
   * Render Item
   */
  const renderItem = ({
    item,
    horizontalText,
  }: {
    item: Item;
    horizontalText?: boolean;
  }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        if (!item.videoUrl) return;

        openVideoPlayer({
          id: item.id ?? item.title,
          title: item.title,
          url: item.videoUrl,
          thumbnail: item.image,
          duration: durationToSeconds(item.duration),
        });
      }}
      className={`
      overflow-hidden
      rounded-3xl
      bg-black
      
      ${horizontalText
          ? "mb-4 w-full flex-row"
          : "mr-4 w-48"
        }
    `}
    >

      {/* Image */}
      <Image
        source={{
          uri: item.image,
        }}
        resizeMode="cover"
        className={
          horizontalText
            ? "h-28 w-28"
            : "h-64 w-full opacity-90"
        }
      />

      {/* Content */}
      <View
        className={
          horizontalText
            ? "flex-1 justify-center p-4"
            : "absolute bottom-0 left-0 right-0 p-4"
        }
      >

        <Text
          numberOfLines={2}
          className="text-2xl font-bold text-white"
        >
          {item.title}
        </Text>

        <Text className="mt-1 text-gray-200">
          {item.duration ?? "7 mins"}
        </Text>

      </View>

    </TouchableOpacity>
  );

  return (
    <View className="mt-10 ">

      {/* Header */}
      <View className="mb-4  flex-row items-center justify-between">

        <Text className="text-xl font-bold" style={{ color: colors.text ,paddingLeft:20}}>
          New & Trending
        </Text>

        <SeeAll
          title="New & Trending"
          data={items}


          keyExtractor={(item) =>
            item.title
          }
          renderItem={({ item }) =>
            renderItem({
              item,
              horizontalText: true,
            })
          }
        />

      </View>

      {/* Preview Scroll */}
      <View className="px-5">
        <FlatList
          horizontal
          data={items}
          keyExtractor={(item, index) =>
            item.id ?? index.toString()
          }
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingRight: 20,
            gap: 16,
          }}
          renderItem={({ item }) =>
            renderItem({ item })
          }
        />
      </View>

    </View>
  );
};

export default ExploreNewTrending;
