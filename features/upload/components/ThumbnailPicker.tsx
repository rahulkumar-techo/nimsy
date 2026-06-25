import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useImagePicker } from "../hooks/use-pickThumbnail";
import { AppDispatch, RootState } from "@/store/store";
import { setThumbnailUri } from "../store/upload.slice";

type Props = {
  thumbnail?: string | null;
  onChange?: (uri: string) => void;
};

export default function ThumbnailPicker({ thumbnail: thumbnailProp, onChange }: Props = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const reduxThumbnail = useSelector((state: RootState) => state.upload.thumbnailUri);
  const thumbnail = thumbnailProp ?? reduxThumbnail;
  const { loading, pickImage } = useImagePicker({ aspect: [16, 9] });
  const handleSelectThumbnail = async () => {
    const image = await pickImage();
    if (image) {
      dispatch(setThumbnailUri(image.uri));
      onChange?.(image.uri);
    }
  };

  return (
    <View className="gap-4">

     
      {/* Preview Container */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSelectThumbnail}
        disabled={loading}
        className={`overflow-hidden rounded-2xl border aspect-video items-center justify-center bg-zinc-900 ${thumbnail ? "border-red-500" : "border-zinc-700 border-dashed"
          }`}
      >
        {thumbnail && <Image source={{ uri: thumbnail }} className="absolute inset-0 h-full w-full" resizeMode="cover" />}

        {loading ? (
          <View className="items-center">
            <ActivityIndicator size="large" color="#ff0000" />
            <Text className="mt-3 text-zinc-400">Opening gallery...</Text>
          </View>
        ) : thumbnail ? (
          <View className="flex-row items-center gap-2 rounded-lg bg-black/60 px-3 py-2">
            <Ionicons name="image-outline" size={16} color="#fff" />
            <Text className="text-sm font-medium text-white">Tap to change thumbnail</Text>
          </View>
        ) : (
          <View className="items-center">
            <Ionicons name="image-outline" size={42} color="#a1a1aa" />
            <Text className="mt-3 text-base font-medium text-white">Add Thumbnail</Text>
            <Text className="mt-1 text-sm text-zinc-500">Recommended: 1280 × 720 (16:9)</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        {/* <TouchableOpacity
          onPress={handleSelectThumbnail}
          disabled={loading}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-zinc-800 py-4"
        >
          {loading ? <ActivityIndicator color="#fff" /> : (
            <>
              <Ionicons name="images-outline" size={20} color="#fff" />
              <Text className="font-medium text-white">Choose from Gallery</Text>
            </>
          )}
        </TouchableOpacity> */}

        {/* {thumbnail && (
          <TouchableOpacity
            onPress={() => dispatch(setThumbnailUri(null))}
            className="flex-row items-center justify-center gap-2 rounded-xl bg-red-600 px-5"
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text className="font-medium text-white">Remove</Text>
          </TouchableOpacity>
        )} */}
      </View>
    </View>
  );
}