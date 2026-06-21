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


import TopMenu from "@/features/library/components/TopMenu";

import Collection from "@/features/library/components/Collection";

import RecentReads from "@/features/library/components/RecentReads";

import Downloads from "@/features/library/components/Downloads";

import Playlists from "@/features/library/components/Playlists";
import { useTheme } from "@/context/ThemeContext";

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
  const { colors } = useTheme();
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
      className="flex-1"
      edges={[
        "top",
        "left",
        "right",
      ]}
      style={{ backgroundColor: colors.background }}
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
            <Text
              className="text-5xl font-black"
              style={{ color: colors.text }}
            >
              Library
            </Text>

            <Text
              className="mt-2 text-base"
              style={{ color: colors.secondaryText }}
            >
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
