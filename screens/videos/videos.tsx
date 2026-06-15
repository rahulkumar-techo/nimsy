import React from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Href } from "expo-router";
import { Video, Music, FileText } from "lucide-react-native";

import Header from "@/components/Header";
import { useTheme } from "@/context/ThemeContext";

export default function Videos() {
  const { colors } = useTheme();

  const MENU_ITEMS = [
    {
      title: "Videos",
      icon: Video,
      link: "/(videos)/video-lists" as Href,
    },
    {
      title: "Audios",
      icon: Music,
      link: "/audio/audio-lists" as Href,
    },
    {
      title: "Posts",
      icon: FileText,
      link: "/posts/posts-list" as Href,
    },
  ];

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <Header
        title="Contents"
        onSearchPress={() => router.push("/explore")}
        onSharePress={() => console.log("share")}
        onSettingsPress={() => router.push("/userdetails")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]}
      >
        {/* Banner */}
        <View
          className="h-40"
          style={{
            backgroundColor: colors.surface,
          }}
        />

        {/* Profile */}
        <View
          className="px-4 pb-5 -mt-12"
          style={{
            backgroundColor: colors.background,
          }}
        >
          <Image
            source={{
              uri: "https://i.pravatar.cc/200",
            }}
            className="h-24 w-24 rounded-full border-4 border-white"
          />

          <Text
            className="mt-3 text-2xl font-bold"
            style={{
              color: colors.primaryText,
            }}
          >
            Nimsy Official
          </Text>

          <Text
            className="mt-1"
            style={{
              color: colors.secondaryText,
            }}
          >
            @nimsy • 125K subscribers • 428 videos
          </Text>

          <Text
            className="mt-2"
            style={{
              color: colors.secondaryText,
            }}
          >
            Building the next generation short-video platform 🚀
          </Text>
        </View>

        {/* Sticky Tabs */}
        <View
          className="py-3"
          style={{
            backgroundColor: colors.background,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
          >
            <View className="flex-row gap-3">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;

                return (
                  <Pressable
                    key={item.title}
                    onPress={() => router.push(item.link)}
                    className="flex-row items-center gap-2 rounded-full px-4 py-2"
                    style={{
                      backgroundColor: colors.surface,
                    }}
                  >
                    <Icon
                      size={16}
                      color={colors.primary}
                    />

                    <Text
                      style={{
                        color: colors.primaryText,
                      }}
                    >
                      {item.title}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Videos */}
        <View className="px-4 py-5">
          <Text
            className="mb-4 text-lg font-bold"
            style={{
              color: colors.primaryText,
            }}
          >
            Latest Videos
          </Text>

          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Pressable
              key={item}
              className="mb-5 overflow-hidden rounded-xl"
            >
              <View className="relative">
                <Image
                  source={{
                    uri: `https://picsum.photos/800/450?random=${item}`,
                  }}
                  className="h-52 w-full rounded-xl"
                />

                <View
                  className="absolute bottom-2 right-2 rounded px-2 py-1"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                  }}
                >
                  <Text className="text-xs text-white">
                    12:34
                  </Text>
                </View>
              </View>

              <View className="mt-3 flex-row">
                <Image
                  source={{
                    uri: "https://i.pravatar.cc/100",
                  }}
                  className="h-10 w-10 rounded-full"
                />

                <View className="ml-3 flex-1">
                  <Text
                    numberOfLines={2}
                    className="font-semibold"
                    style={{
                      color: colors.primaryText,
                    }}
                  >
                    Building Nimsy from Scratch — Part {item}
                  </Text>

                  <Text
                    className="mt-1 text-sm"
                    style={{
                      color: colors.secondaryText,
                    }}
                  >
                    Nimsy Official • 12K views • 2 days ago
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}