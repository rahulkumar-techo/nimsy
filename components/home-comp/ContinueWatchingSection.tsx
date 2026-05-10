/**
 * ContinueWatchingSection
 */

import { View, Text, Pressable } from "react-native"
import React from "react"
import ContinueWatchingCard from "./ContinueWatchingCard"
import { type ImageSourcePropType } from "react-native"

type Item = {
  id: string
  title: string
  image: ImageSourcePropType
}

type Props = {
  data: Item[]
}

export default function ContinueWatchingSection({ data }: Props) {
  return (
    <View className="w-full">

      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-slate-900">
          Continue Watching
        </Text>

        <Pressable>
          <Text className="text-blue-600 font-semibold">
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
