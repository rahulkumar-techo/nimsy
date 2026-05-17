/**
 * Favorites Section
 */

import React from "react";

import {
    ListRenderItem,
    ScrollView,
    View,
} from "react-native";

import SectionHeader from "../SectionHeader";
import FavoriteCard from "./FavoriteCard";

type Favorite = {
  id: string;
  title: string;
  image: string;
};

const FAVORITES: Favorite[] = [
  {
    id: "1",
    title: "Lion & Mouse",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
  },
];

const renderFavorite: ListRenderItem<Favorite> = ({ item }) => (
  <FavoriteCard
    title={item.title}
    image={item.image}
  />
);

const FavoritesSection = () => (
  <View>
    <SectionHeader
      title="My Favorites"
      data={FAVORITES}
      renderItem={renderFavorite}
      keyExtractor={(item) => item.id}
      horizontal
    />

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-6"
    >
      {FAVORITES.map((item) => (
        <FavoriteCard
          key={item.id}
          title={item.title}
          image={item.image}
        />
      ))}
    </ScrollView>
  </View>
);

export default React.memo(FavoritesSection);
