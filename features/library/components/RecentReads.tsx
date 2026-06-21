import {
    ListRenderItem,
    View,
} from "react-native";

import RecentReadCard from "./RecentReadCard";
import SectionHeader from "./SectionHeader";

type RecentReadItem = {
  id: string;
  title: string;
  progress: number;
  image: string;
};

const recentReads: RecentReadItem[] = [
  {
    id: "1",
    title: "The Lion & Mouse",
    progress: 75,
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
  },
  {
    id: "2",
    title: "The Honest Rabbit",
    progress: 40,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9",
  },
];

const RecentReads = () => {
  const renderRecentRead: ListRenderItem<RecentReadItem> = ({ item }) => (
    <RecentReadCard item={item} />
  );

  return (
    <View className="mt-12 px-5">
      <SectionHeader
        title="Recently Read"
        data={recentReads}
        renderItem={renderRecentRead}
        keyExtractor={(item) => item.id}
      />

      {recentReads.map((item) => (
        <RecentReadCard
          key={item.id}
          item={item}
        />
      ))}
    </View>
  );
};

export default RecentReads;
