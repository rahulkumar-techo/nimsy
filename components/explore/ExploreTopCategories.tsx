import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

type Item = {
  id?: string;
  title: string;
  image: string;
  count?: number;
};

type Props = {
  items: Item[];
  onItemPress?: (item: Item) => void;
};

const ExploreTopCategories = ({ items, onItemPress }: Props) => (
  <View className="mt-8 px-5">
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="text-xl font-bold text-black">Top Categories</Text>
      <Text className="font-semibold text-violet-600">See All</Text>
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.id ?? index}
          onPress={() => onItemPress?.(item)}
          activeOpacity={0.85}
          className="mr-4 w-36 overflow-hidden rounded-3xl bg-gray-100"
        >
          <Image source={{ uri: item.image }} className="h-32 w-full" />
          <View className="p-3">
            <Text className="text-lg font-bold text-black">{item.title}</Text>
            <Text className="mt-1 text-gray-500">
              {item.count ? `${item.count} stories` : "120 stories"}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

export default ExploreTopCategories;
