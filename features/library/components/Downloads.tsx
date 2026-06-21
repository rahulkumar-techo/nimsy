import {
    ListRenderItem,
    View,
} from "react-native";

import DownloadCard from "./DownloadCard";
import SectionHeader from "./SectionHeader";

type DownloadItem = {
  id: string;
  title: string;
  type: string;
};

const downloads: DownloadItem[] = [
  {
    id: "1",
    title: "Brave Little Turtle",
    type: "Story",
  },
  {
    id: "2",
    title: "Dreamy Land",
    type: "Audio",
  },
];

const Downloads = () => {
  const renderDownload: ListRenderItem<DownloadItem> = ({ item }) => (
    <DownloadCard item={item} />
  );

  return (
    <View className="mt-12 px-5">
      <SectionHeader
        title="Downloads"
        data={downloads}
        renderItem={renderDownload}
        keyExtractor={(item) => item.id}
      />

      {downloads.map((item) => (
        <DownloadCard
          key={item.id}
          item={item}
        />
      ))}
    </View>
  );
};

export default Downloads;
