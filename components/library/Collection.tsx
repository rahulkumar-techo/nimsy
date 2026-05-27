import {
    FlatList,
    ListRenderItem,
    View,
} from "react-native";

import CollectionCard from "@/components/library/CollectionCard";
import SectionHeader from "@/components/library/SectionHeader";

type CollectionItem = {
  id: string;
  title: string;
  items: string;
  image: string;
  color: string;
};

const collections: CollectionItem[] = [
  {
    id: "1",
    title: "Bedtime Stories",
    items: "12 items",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    color: "bg-violet-100",
  },
  {
    id: "2",
    title: "Animal Tales",
    items: "18 items",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
    color: "bg-green-100",
  },
];

const Collection = () => {
  const renderCollection: ListRenderItem<CollectionItem> = ({ item }) => (
    <CollectionCard item={item} />
  );

  return (
    <View className="mt-12">
      <SectionHeader
        title="My Collections"
        data={collections}
        renderItem={renderCollection}
        keyExtractor={(item) => item.id}
        horizontal
      />

    <View className="px-5">
        <FlatList
        horizontal
        data={collections}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
       
        renderItem={renderCollection}
      />
    </View>
    </View>
  );
};

export default Collection;
