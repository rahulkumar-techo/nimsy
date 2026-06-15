import React from "react";
import { FlatList } from "react-native";
import VideoCard, { Video } from "./VideoCard";

interface Props {
  videos: Video[];
}

export default function VideoList({
  videos,
}: Props) {
  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        padding: 16,
      }}
      renderItem={({ item }) => (
        <VideoCard
          video={item}
          onPress={() => {
            console.log("open video", item.id);
          }}
          onMenuPress={() => {
            console.log("menu", item.id);
          }}
        />
      )}
    />
  );
}