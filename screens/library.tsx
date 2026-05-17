/**
 * Optimized Premium Library Screen
 */


import {
    ScrollView,
    Text,
    View
} from "react-native";

import {
    SafeAreaView,
} from "react-native-safe-area-context";


import TopMenu from "@/components/library/TopMenu";

import Collection from "@/components/library/Collection";

import RecentReads from "@/components/library/RecentReads";

import Downloads from "@/components/library/Downloads";

import Playlists from "@/components/library/Playlists";

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


/* -------------------------------------------------------------------------- */
/*                                   SCREEN                                   */
/* -------------------------------------------------------------------------- */

const LibraryScreen = () => {
  /* COLLECTIONS SECTION */
  const renderCollections = () => (
    <Collection />
  );

  /* RECENT READ SECTION */
  const renderRecentRead = () => (
    <RecentReads />
  );

  /* DOWNLOADS SECTION */
  const renderDownloads = () => (
    <Downloads />
  );

  /* PLAYLISTS SECTION */
  const renderPlaylists = () => (
    <Playlists />
  );

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

        {/* COLLECTIONS */}
        {renderCollections()}

        {/* RECENT READ */}
        {renderRecentRead()}

        {/* DOWNLOADS */}
        {renderDownloads()}

        {/* PLAYLISTS */}
        {renderPlaylists()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LibraryScreen;