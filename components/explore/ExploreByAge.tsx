/**
 * Explore By Age Section
 * Responsive Age Category Grid
 */

import React, {
  memo,
  useCallback,
} from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import SeeAll from "../SeeAll";

type AgeGroup = {
  id: string;
  label: string;
  subtitle: string;
  bg: string;
  text: string;
};

const AGE_GROUPS: AgeGroup[] = [
  {
    id: "1",
    label: "3-5",
    subtitle: "Years",
    bg: "bg-pink-100",
    text: "text-pink-700",
  },
  {
    id: "2",
    label: "6-9",
    subtitle: "Years",
    bg: "bg-violet-100",
    text: "text-violet-700",
  },
  {
    id: "3",
    label: "10-15",
    subtitle: "Years",
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  {
    id: "4",
    label: "16+",
    subtitle: "Years",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
  },
];

type AgeCardProps = {
  item: AgeGroup;
  onPress?: (
    item: AgeGroup
  ) => void;

  /**
   * Full width for SeeAll
   */
  fullWidth?: boolean;
};

/**
 * Age Card
 */
const AgeCard = memo(
  ({
    item,
    onPress,
    fullWidth = false,
  }: AgeCardProps) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          onPress?.(item)
        }
        className={`
          mb-4 
          h-36 
          ${fullWidth ? "w-full" : "w-[48%]"} 
          items-center 
          justify-center 
          rounded-3xl 
          ${item.bg}
        `}
      >

        {/* Age */}
        <Text
          className={`text-3xl font-bold ${item.text}`}
        >
          {item.label}
        </Text>

        {/* Subtitle */}
        <Text className="mt-2 text-gray-600">
          {item.subtitle}
        </Text>

      </TouchableOpacity>
    );
  }
);

AgeCard.displayName =
  "AgeCard";

/**
 * Explore By Age
 */
const ExploreByAge =
  () => {

    /**
     * Handle Press
     */
    const handlePress =
      useCallback(
        (
          item: AgeGroup
        ) => {
          console.log(
            "Selected:",
            item.label
          );
        },
        []
      );

    return (
      <View className="mt-10 px-5">

        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">

          <Text className="text-xl font-bold text-black">
            Explore by Age
          </Text>

          <SeeAll
            title="Age Groups"
            data={AGE_GROUPS}
            keyExtractor={(
              item
            ) => item.id}
            renderItem={({
              item,
            }) => (
              <AgeCard
                item={item}
                onPress={
                  handlePress
                }
                fullWidth
              />
            )}
          />

        </View>

        {/* Preview Grid */}
        <View className="flex-row flex-wrap justify-between">

          {AGE_GROUPS.slice(0,2).map(
            (item) => (
              <AgeCard
                key={
                  item.id
                }
                item={item}
                onPress={
                  handlePress
                }
              />
            )
          )}

        </View>

      </View>
    );
  };

export default memo(
  ExploreByAge
);