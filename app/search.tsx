import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, Search } from "lucide-react-native";

import { videos } from "@/constants/videos";
import { audios } from "@/constants/audios";

type Result =
  | { type: "video"; item: (typeof videos)[number] }
  | { type: "audio"; item: (typeof audios)[number] };

function VideoResult({ item }: { item: (typeof videos)[number] }) {
  return (
    <View className="flex-row p-3">
      <Image
        source={{ uri: item.thumbnail }}
        className="w-32 h-20 rounded-lg"
      />
      <View className="flex-1 ml-3">
        <Text numberOfLines={2} className="font-semibold">{item.title}</Text>
        <Text className="text-gray-500 mt-1">{item.channelName}</Text>
      </View>
    </View>
  );
}

function AudioResult({ item }: { item: (typeof audios)[number] }) {
  return (
    <View className="flex-row p-3 items-center">
      <Image
        source={{ uri: item.cover }}
        className="w-16 h-16 rounded-lg"
      />
      <View className="flex-1 ml-3">
        <Text className="font-semibold">{item.title}</Text>
        <Text className="text-gray-500 mt-1">{item.artist}</Text>
      </View>
    </View>
  );
}

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return [
      ...videos
        .filter((v) => v.title.toLowerCase().includes(q))
        .map((item) => ({ type: "video" as const, item })),
      ...audios
        .filter((a) => a.title.toLowerCase().includes(q))
        .map((item) => ({ type: "audio" as const, item })),
    ];
  }, [query]);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>

      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2 gap-2">
          <Search size={16} color="#9ca3af" />
          <TextInput
            placeholder="Search videos, podcasts..."
            value={query}
            onChangeText={setQuery}
            autoFocus
            className="flex-1 text-sm"
          />
        </View>
      </View>

      {/* Empty state */}
      {query.trim() === "" && (
        <View className="flex-1 items-center justify-center">
          <Search size={48} color="#d1d5db" />
          <Text className="text-gray-400 mt-3">Search for videos or podcasts</Text>
        </View>
      )}

      {/* No results */}
      {query.trim() !== "" && results.length === 0 && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400">No results for &quot;{query}&quot;</Text>
        </View>
      )}

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item }) =>
          item.type === "video"
            ? <VideoResult item={item.item} />
            : <AudioResult item={item.item} />
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      />
    </View>
  );
}