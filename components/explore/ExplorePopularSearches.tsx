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
import { useTheme } from "@/context/ThemeContext";

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
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className={`
        mb-3
        ${fullWidth ? "w-full" : "mr-3"}
        rounded-full
        px-4
        py-3
      `}
      style={{ backgroundColor: colors.card }}
    >

      <Text className="font-medium" style={{ color: colors.text }}>
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
    const { colors } = useTheme();

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

          <Text
            className="text-xl font-bold"
            style={{ color: colors.text }}
          >
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
