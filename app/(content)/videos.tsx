/**
 * Videos screen
 * Channel videos and upload progress list
 *
 * Location: src/screens/VideosScreen.tsx (or app/(tabs)/videos.tsx, per your routing)
 */

import React from "react";

import { FlatList, View } from "react-native";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileHorizontalCard from "@/components/profile/ProfileHorizontalCard";
import PublishedVideoCard from "@/components/profile/Publishedvideocard ";

import { useTheme } from "@/context/ThemeContext";

import { UploadStage } from "@/components/profile/ProfileHorizontalCard";

type VideoListItem =
  | {
      type: "upload";
      id: string;
      title: string;
      thumbnail: string;
      stage: UploadStage;
      progress: number;
      uploadedBytes: number;
      totalBytes: number;
    }
  | {
      type: "video";
      id: string;
      title: string;
      thumbnail: string;
      duration: string;
      views: string;
      uploadDate: string;
      avatar: string;
    };

const videos: VideoListItem[] = [
  {
    type: "upload",
    id: "upload-1",
    title: "React Native Course 2026",
    thumbnail: "https://picsum.photos/800/450?random=10",
    stage: "UPLOADING",
    progress: 68,
    uploadedBytes: 1400000000,
    totalBytes: 2000000000,
  },

  {
    type: "upload",
    id: "upload-2",
    title: "NestJS Masterclass",
    thumbnail: "https://picsum.photos/800/450?random=11",
    stage: "PROCESSING",
    progress: 100,
    uploadedBytes: 2000000000,
    totalBytes: 2000000000,
  },

  {
    type: "video",
    id: "1",
    title: "React Native Full Course 2026",
    thumbnail: "https://picsum.photos/800/450?random=1",
    duration: "18:45",
    views: "120K views",
    uploadDate: "2 days ago",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
];

export default function VideosScreen() {
  const { colors } = useTheme();

  const renderItem = ({ item }: { item: VideoListItem }) => {
    // Upload card
    if (item.type === "upload") {
      return (
        <ProfileHorizontalCard
          title={item.title}
          thumbnail={item.thumbnail}
          stage={item.stage}
          progress={item.progress}
          uploadedBytes={item.uploadedBytes}
          totalBytes={item.totalBytes}
        />
      );
    }

    // Published video card
    return (
      <PublishedVideoCard
        title={item.title}
        thumbnail={item.thumbnail}
        duration={item.duration}
        views={item.views}
        uploadDate={item.uploadDate}
        primaryTextColor={colors.primaryText}
        secondaryTextColor={colors.secondaryText}
        rippleColor={colors.border}
        onPress={() => {
          // navigate to video detail / player
        }}
        onEdit={() => {}}
        onDownload={() => {}}
        onShare={() => {}}
        onDelete={() => {}}
      />
    );
  };

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View className="h-4" />}
      ListHeaderComponent={<ProfileHeader />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
}