import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Href, useRouter } from "expo-router";

type Category = {
  title: string;
  icon: string;
  route: Href;
};

type Props = {
  categories: Category[];
};

const ExploreCategories = ({ categories }: Props) => {
  const { colors } = useTheme();
  const router = useRouter();

  const handleRoute = (item: Category) => {
    router.push(item.route);
  };

  return (
    <View className="mt-8 px-5">
      <Text
        className="mb-4 text-xl font-bold"
        style={{ color: colors.text }}
      >
        Categories
      </Text>

      <View className="flex-row justify-between">
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="items-center"
            onPress={() => handleRoute(item)}
            activeOpacity={0.8}
          >
            <View
              className="mb-2 h-20 w-20 items-center justify-center rounded-3xl"
              style={{ backgroundColor: colors.primaryLight }}
            >
              <Ionicons
                name={item.icon as any}
                size={32}
                color={colors.primary}
              />
            </View>

            <Text
              className="font-semibold"
              style={{ color: colors.text }}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ExploreCategories;