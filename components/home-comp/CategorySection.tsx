/**
 * CategorySection (Top Categories)
 */

import { View, Text, Pressable } from "react-native"
import React from "react"
import CategoryCard from "./CategoryCard"

type Props = {
  data: {
    title: string
    subtitle?: string
    image: any
  }[]
}

export default function CategorySection({ data }: Props) {
  return (
    <View className="w-full">

      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-slate-900">
          Top Categories
        </Text>

        <Pressable>
          <Text className="text-blue-600 font-semibold">
            See All
          </Text>
        </Pressable>
      </View>

      {/* Grid */}
      <View className="flex-row justify-between">
        {data.map((item, index) => (
          <CategoryCard key={index} {...item} />
        ))}
      </View>

    </View>
  )
}
