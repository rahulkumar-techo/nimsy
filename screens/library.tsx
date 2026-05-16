/**
 * Optimized Premium Library Screen
 */

import React from "react";

import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import SectionHeader from "@/components/library/SectionHeader";

import TopMenu from "@/components/library/TopMenu";

import CollectionCard from "@/components/library/CollectionCard";

import RecentReadCard from "@/components/library/RecentReadCard";

import DownloadCard from "@/components/library/DownloadCard";

import PlaylistCard from "@/components/library/PlaylistCard";

/* -------------------------------------------------------------------------- */
/*                                   DATA                                     */
/* -------------------------------------------------------------------------- */

const topMenus = [
  {
    title: "Stories",
    icon: "book",
    color: "bg-violet-500",
  },
  {
    title: "Videos",
    icon: "play",
    color: "bg-pink-500",
  },
  {
    title: "Audio",
    icon: "headset",
    color: "bg-orange-400",
  },
  {
    title: "Favorites",
    icon: "heart",
    color: "bg-green-500",
  },
];

const collections = [
  {
    id: "1",
    title:
      "Bedtime Stories",
    items: "12 items",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    color: "bg-violet-100",
  },
  {
    id: "2",
    title:
      "Animal Tales",
    items: "18 items",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
    color: "bg-green-100",
  },
];

const recentReads = [
  {
    id: "1",
    title:
      "The Lion & Mouse",
    progress: 75,
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
  },
  {
    id: "2",
    title:
      "The Honest Rabbit",
    progress: 40,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9",
  },
];

const downloads = [
  {
    id: "1",
    title:
      "Brave Little Turtle",
    type: "Story",
  },
  {
    id: "2",
    title:
      "Dreamy Land",
    type: "Audio",
  },
];

const playlists = [
  {
    id: "1",
    title: "My Favorites",
    icon: "heart",
  },
  {
    id: "2",
    title:
      "Weekend Stories",
    icon: "paper-plane",
  },
];

const sections = [
  {
    id: "collections",
  },
  {
    id: "recent",
  },
  {
    id: "downloads",
  },
  {
    id: "playlists",
  },
];

/* -------------------------------------------------------------------------- */
/*                                   SCREEN                                   */
/* -------------------------------------------------------------------------- */

const LibraryScreen = () => {
  /* SECTION RENDER */
  const renderSection = ({
    item,
  }: any) => {
    switch (item.id) {
      /* COLLECTIONS */
      case "collections":
        return (
          <View className="mt-12">
            <SectionHeader title="My Collections" />

            <FlatList
              horizontal
              data={collections}
              keyExtractor={(
                item
              ) => item.id}
              showsHorizontalScrollIndicator={
                false
              }
              removeClippedSubviews
              initialNumToRender={
                2
              }
              maxToRenderPerBatch={
                2
              }
              windowSize={5}
              contentContainerStyle={{
                paddingHorizontal: 20,
              }}
              renderItem={({
                item,
              }) => (
                <CollectionCard
                  item={item}
                />
              )}
            />
          </View>
        );

      /* RECENT READ */
      case "recent":
        return (
          <View className="mt-12 px-5">
            <SectionHeader title="Recently Read" />

            {recentReads.map(
              (item) => (
                <RecentReadCard
                  key={item.id}
                  item={item}
                />
              )
            )}
          </View>
        );

      /* DOWNLOADS */
      case "downloads":
        return (
          <View className="mt-12 px-5">
            <SectionHeader title="Downloads" />

            {downloads.map(
              (item) => (
                <DownloadCard
                  key={item.id}
                  item={item}
                />
              )
            )}
          </View>
        );

      /* PLAYLISTS */
      case "playlists":
        return (
          <View className="mt-12 px-5">
            <SectionHeader title="My Playlists" />

            {playlists.map(
              (item) => (
                <PlaylistCard
                  key={item.id}
                  item={item}
                />
              )
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={sections}
        keyExtractor={(item) =>
          item.id
        }
        renderItem={renderSection}
        showsVerticalScrollIndicator={
          false
        }
        removeClippedSubviews
        initialNumToRender={4}
        maxToRenderPerBatch={
          4
        }
        windowSize={7}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        ListHeaderComponent={
          <>
            {/* HEADER */}
            <View className="flex-row items-center justify-between px-5 pt-4">
              <View>
                <Text className="text-5xl font-black text-slate-900">
                  Library
                </Text>

                <Text className="mt-2 text-base text-slate-500">
                  Your stories,
                  collections &
                  downloads
                </Text>
              </View>

            </View>

            {/* TOP MENUS */}
            <View className="mt-10 flex-row justify-between px-5">
              {topMenus.map(
                (
                  item,
                  index
                ) => (
                  <TopMenu
                    key={index}
                    item={item}
                  />
                )
              )}
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default LibraryScreen;