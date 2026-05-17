/**
 * Explore Popular Searches
 */

import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import SeeAll from "../SeeAll";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type Props = {
  items: string[];
};

/* -------------------------------------------------------------------------- */
/*                                SEARCH TAG                                  */
/* -------------------------------------------------------------------------- */

type SearchTagProps = {
  title: string;
  onPress?: () => void;
  fullWidth?: boolean;
};

const SearchTag = ({
  title,
  onPress,
  fullWidth = false,
}: SearchTagProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className={`
        mb-3
        ${fullWidth ? "w-full" : "mr-3"}
        rounded-full
        bg-gray-100
        px-4
        py-3
      `}
    >

      <Text className="font-medium text-gray-700">
        {title}
      </Text>

    </TouchableOpacity>
  );
};

/* -------------------------------------------------------------------------- */
/*                         EXPLORE POPULAR SEARCHES                           */
/* -------------------------------------------------------------------------- */

const ExplorePopularSearches =
  ({ items }: Props) => {

    /**
     * Handle Tag Press
     */
    const handlePress = (
      title: string
    ) => {
      console.log(
        "Selected:",
        title
      );
    };

    return (
      <View className="mt-10 px-5">

        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">

          <Text className="text-xl font-bold text-black">
            Popular Searches
          </Text>

          <SeeAll
            title="Popular Searches"
            data={items}
            keyExtractor={(
              item,
              index
            ) =>
              `${item}-${index}`
            }
            renderItem={({
              item,
            }) => (
              <SearchTag
                title={item}
                fullWidth
                onPress={() =>
                  handlePress(
                    item
                  )
                }
              />
            )}
          />

        </View>

        {/* Preview Tags */}
        <View className="flex-row flex-wrap">

          {items
            .slice(0, 5)
            .map(
              (
                item,
                index
              ) => (
                <SearchTag
                  key={`${item}-${index}`}
                  title={item}
                  onPress={() =>
                    handlePress(
                      item
                    )
                  }
                />
              )
            )}

        </View>

      </View>
    );
  };

export default ExplorePopularSearches;