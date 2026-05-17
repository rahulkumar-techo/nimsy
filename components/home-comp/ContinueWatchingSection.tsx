/**
 * ContinueWatchingSection
 */

import { View, Text, Pressable } from "react-native"
import React from "react"
import ContinueWatchingCard from "./ContinueWatchingCard"
import { type ImageSourcePropType } from "react-native"
import { useTheme } from "@/context/ThemeContext"

type Item = {
  id: string
  title: string
  image: ImageSourcePropType
}

type Props = {
  data: Item[]
}

export default function ContinueWatchingSection({ data }: Props) {
  const { colors } = useTheme()

  return (
    <View className="w-full">

      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-bold" style={{ color: colors.text }}>
          Continue Watching
        </Text>

        <Pressable>
          <Text
            className="font-semibold"
            style={{ color: colors.primary }}
          >
            See All
          </Text>
        </Pressable>
      </View>

      <View className="gap-3">
        {data.map((item) => (
          <ContinueWatchingCard key={item.id} {...item} />
        ))}
      </View>
    </View>
  )
}
