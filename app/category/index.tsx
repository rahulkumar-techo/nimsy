import React from "react";
import {
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import StoryCard from "@/components/StoryCard";
import {
  getCategoryById,
  getStoriesByCategory,
  type Story,
} from "@/constants/story";
import { useTheme } from "@/context/ThemeContext";

const FILTER_CHIPS = [
  "Latest",
  "Featured",
  "Stories",
] as const;

const keyExtractor = (item: Story) => item.id;

const renderStoryItem = ({
  item,
}: {
  item: Story;
}) => <StoryCard item={item} />;

const ItemSeparator = () => <View className="h-5" />;

const Category = () => {
  const { colors, theme } = useTheme();
  const { id, title } = useLocalSearchParams<{
    id?: string;
    title?: string;
  }>();

  const category = getCategoryById(id);
  const storiesData = getStoriesByCategory(category?.id);
  const screenTitle = category?.title || title || "Stories";

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
        backgroundColor={colors.background}
      />

      <View
        className="px-4 pt-2 pb-4 border-b"
        style={{
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full items-center justify-center"
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>

            <View className="ml-3 flex-1">
              <Text
                numberOfLines={1}
                className="text-lg font-bold capitalize"
                style={{ color: colors.text }}
              >
                {screenTitle}
              </Text>

              <Text
                className="text-xs mt-[2px]"
                style={{ color: colors.secondaryText }}
              >
                {storiesData.length} stories
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="w-10 h-10 rounded-full items-center justify-center"
          >
              <Ionicons
                name="search"
                size={22}
                color={colors.text}
              />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingRight: 16,
          }}
          className="mt-4"
        >
          <View
            className="px-4 py-2 rounded-full mr-2"
            style={{ backgroundColor: colors.primary }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: colors.buttonText }}
            >
              {screenTitle}
            </Text>
          </View>

          {FILTER_CHIPS.map((chip) => (
            <View
              key={chip}
              className="mr-2 rounded-full px-4 py-2"
              style={{ backgroundColor: colors.card }}
            >
              <Text
                className="text-xs font-medium"
                style={{ color: colors.text }}
              >
                {chip}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={storiesData}
        keyExtractor={keyExtractor}
        renderItem={renderStoryItem}
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        updateCellsBatchingPeriod={16}
        windowSize={5}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 14,
          paddingBottom: 120,
        }}
        ListEmptyComponent={
          <View className="items-center justify-center py-24">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.card }}
            >
              <Ionicons
                name="film-outline"
                size={36}
                color={colors.secondaryText}
              />
            </View>

            <Text
              className="text-xl font-bold"
              style={{ color: colors.text }}
            >
              No Stories Found
            </Text>

            <Text
              className="text-center mt-2 px-10 leading-6"
              style={{ color: colors.secondaryText }}
            >
              Stories for this category will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Category;
