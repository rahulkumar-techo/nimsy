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

  return (
    <View className="z-50 mt-6 px-5">
      <View className="flex-row items-center">
        <View className="mr-3 flex-1 flex-row items-center rounded-2xl bg-gray-100 px-4 py-3">
          <Ionicons
            name="search"
            size={20}
            color="gray"
          />

          <TextInput
            value={value}
            onChangeText={
              onChangeText
            }
            placeholder="Search stories..."
            placeholderTextColor="gray"
            className="ml-3 flex-1 text-black"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            setIsOpen(
              !isOpen
            )
          }
          className="h-14 w-14 items-center justify-center rounded-2xl bg-violet-600"
        >
          <Ionicons
            name={
              isOpen
                ? "close-outline"
                : "options-outline"
            }
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {
        isOpen && (
          <View
            className="mt-4 rounded-3xl bg-white p-2"
            style={{
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
                      className={`mb-2 rounded-2xl px-4 py-4 ${
                        active
                          ? "bg-violet-600"
                          : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={`text-base font-semibold ${
                          active
                            ? "text-white"
                            : "text-black"
                        }`}
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