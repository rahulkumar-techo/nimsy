import {
    ListRenderItem,
    View,
} from "react-native";

import PlaylistCard from "./PlaylistCard";
import SectionHeader from "./SectionHeader";

type PlaylistItem = {
  id: string;
  title: string;
  icon: string;
};

const playlists: PlaylistItem[] = [
  {
    id: "1",
    title: "My Favorites",
    icon: "heart",
  },
  {
    id: "2",
    title: "Weekend Stories",
    icon: "paper-plane",
  },
];

const Playlists = () => {
  const renderPlaylist: ListRenderItem<PlaylistItem> = ({ item }) => (
    <PlaylistCard item={item} />
  );

  return (
    <View className="mt-12 px-5">
      <SectionHeader
        title="My Playlists"
        data={playlists}
        renderItem={renderPlaylist}
        keyExtractor={(item) => item.id}
      />

      {playlists.map((item) => (
        <PlaylistCard
          key={item.id}
          item={item}
        />
      ))}
    </View>
  );
};

export default Playlists;
