/**
 * Explore Search
 */

import React, {
  useState,
} from "react";

import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  value: string;
  onChangeText: (
    text: string
  ) => void;

  selectedFilter: string;

  onSelectFilter: (
    filter: string
  ) => void;
};

const FILTER_ITEMS = [
  "All",
  "Stories",
  "Videos",
  "Audio",
  "Learning",
];

const ExploreSearch = ({
  value,
  onChangeText,
  selectedFilter,
  onSelectFilter,
}: Props) => {
  const [isOpen, setIsOpen] =
    useState(false);
  const { colors } = useTheme();

  return (
    <View className="z-50 mt-6 px-5">
      <View className="flex-row items-center">
        <View
          className="mr-3 flex-1 flex-row items-center rounded-2xl px-4 py-3"
          style={{ backgroundColor: colors.inputBackground }}
        >
          <Ionicons
            name="search"
            size={20}
            color={colors.secondaryText}
          />

          <TextInput
            value={value}
            onChangeText={
              onChangeText
            }
            placeholder="Search stories..."
            placeholderTextColor={colors.secondaryText}
            className="ml-3 flex-1"
            style={{ color: colors.inputText }}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            setIsOpen(
              !isOpen
            )
          }
          className="h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: colors.primary }}
        >
          <Ionicons
            name={
              isOpen
                ? "close-outline"
                : "options-outline"
            }
            size={24}
            color={colors.buttonText}
          />
        </TouchableOpacity>
      </View>

      {
        isOpen && (
          <View
            className="mt-4 rounded-3xl p-2"
            style={{
              backgroundColor: colors.card,
              elevation: 4,
            }}
          >
            {
              FILTER_ITEMS.map(
                (
                  item
                ) => {
                  const active =
                    selectedFilter ===
                    item;

                  return (
                    <TouchableOpacity
                      key={
                        item
                      }
                      activeOpacity={
                        0.8
                      }
                      onPress={() => {
                        onSelectFilter(
                          item
                        );

                        setIsOpen(
                          false
                        );
                      }}
                      className="mb-2 rounded-2xl px-4 py-4"
                      style={{
                        backgroundColor: active
                          ? colors.primary
                          : colors.background,
                      }}
                    >
                      <Text
                        className="text-base font-semibold"
                        style={{
                          color: active ? colors.buttonText : colors.text,
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )
            }
          </View>
        )
      }
    </View>
  );
};

export default ExploreSearch;
