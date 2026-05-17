/**
 * Recent Read Card Component
 */


import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  item: {
    title: string;
    progress: number;
    image: string;
  };
};

const RecentReadCard = ({
  item,
}: Props) => {
  return (
    <TouchableOpacity className="mb-4 flex-row overflow-hidden rounded-[28px] bg-slate-50">
      <Image
        source={{
          uri: item.image,
        }}
        className="h-32 w-32"
      />

      <View className="flex-1 justify-center p-4">
        <Text className="text-xl font-bold text-slate-900">
          {item.title}
        </Text>

        <Text className="mt-2 text-slate-500">
          {item.progress}%
          completed
        </Text>

        <View className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
          <View
            style={{
              width: `${item.progress}%`,
            }}
            className="h-full rounded-full bg-violet-600"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecentReadCard;