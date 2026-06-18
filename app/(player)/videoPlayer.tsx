// app/(player)/videoPlayer.tsx

/**
 * Video Player Screen
 * Receives video data from route params
 */

import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NimsyVideoPlayer from "@/components/player/Nimsy-videoPlayer";

export default function VideoPlayerScreen() {
    const {
        uri,
        title,
        channelName,
        views,
    } = useLocalSearchParams<{
        uri: string;
        title?: string;
        channelName?: string;
        views?: string;
    }>();

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-1">
                <NimsyVideoPlayer
                    uri={uri ?? ""}
                    // artworkUri={thumbnail}
                    // title={title}
                    // autoPictureInPicture={true}
                />

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