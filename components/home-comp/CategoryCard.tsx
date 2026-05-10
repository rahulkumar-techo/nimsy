/**
 * CategoryCard
 * - Icon + Title
 */

import { Image, Text, Pressable, View } from "react-native"
import React from "react"

type Props = {
  title: string
  subtitle?: string
  image: any
  onPress?: () => void
}

export default function CategoryCard({
  title,
  subtitle,
  image,
  onPress,
}: Props) {
  return (
    <Pressable onPress={onPress} className="items-center w-[70px]">

      {/* Icon */}
      <View className="w-16 h-16 rounded-2xl bg-white items-center justify-center overflow-hidden shadow-sm">
        <Image
          source={image}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Text */}
      <Text className="text-sm font-semibold text-slate-800 mt-2 text-center">
        {title}
      </Text>

      {subtitle && (
        <Text className="text-xs text-slate-500 text-center">
          {subtitle}
        </Text>
      )}
    </Pressable>
  )
}