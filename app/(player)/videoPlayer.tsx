// app/(player)/videoPlayer.tsx

/**
 * Video Player Screen
 * Receives video data from route params
 */

import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NimsyVideoPlayer from "@/components/player/Nimsy-videoPlayer";
import { getMediaUrl } from "@/features/home/utils/media";

type VideoPlayerParams = {
  id?: string;
  uri?: string;
  title?: string;
  thumbnail?: string;
  channelName?: string;
  views?: string;
  uploadedAt?: string;
};

export default function VideoPlayerScreen() {
    const {
        uri,
        title,
        channelName,
        views,
    } = useLocalSearchParams<VideoPlayerParams>();

    const videoUri = getMediaUrl(uri);

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-1">
                {videoUri ? (
                    <NimsyVideoPlayer
                        uri={videoUri}
                        title={title}
                    />
                ) : (
                    <View className="aspect-video w-full items-center justify-center bg-black">
                        <Text className="text-white">
                            Video source is unavailable.
                        </Text>
                    </View>
                )}

                {/* Example metadata */}
                <View className="px-4 py-3 bg-background">
                    <Text className="text-white text-lg font-semibold">
                        {title}
                    </Text>

                    <Text className="text-gray-400 mt-1">
                        {views}
                    </Text>

                    <Text className="text-gray-400 mt-1">
                        {channelName}
                    </Text>
                </View>
            </View>
            {/* Recommanded  data */}
        </SafeAreaView>
    );
}
