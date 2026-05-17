/**
 * ContinueWatchingCard (Hybrid Layout)
 * - Row layout (image + title + play)
 * - Progress bar below
 */

import { View, Text, Image, Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { useTheme } from "@/context/ThemeContext"

type Props = {
  title: string
  image: any
  progress?: number
  onPress?: () => void
}

export default function ContinueWatchingCard({
  title,
  image,
  progress = 0.3,
  onPress,
}: Props) {
  const { colors } = useTheme()

  return (
    <Pressable
      onPress={onPress}
      className="w-full rounded-2xl px-5 py-4"
      style={{
        backgroundColor: colors.card,
        width: "100%",
        maxWidth: 420,
        alignSelf: "center",
        shadowColor: colors.shadow,
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      {/* Row Content */}
      <View className="flex-row items-center gap-3">

        {/* Image */}
        <Image
          source={image}
          className="w-14 h-14 rounded-lg"
          resizeMode="cover"
        />

        {/* Title */}
        <View className="flex-1">
          <Text
            numberOfLines={2}
            className="text-sm font-semibold"
            style={{ color: colors.text }}
          >
            {title}
          </Text>
        </View>

        {/* Play Button */}
        <Ionicons name="play-circle" size={28} color={colors.primary} />
      </View>

      {/* Progress Bar */}
      <View
        className="mt-3 h-1 rounded-full"
        style={{ backgroundColor: colors.border }}
      >
        <View
          className="h-1 rounded-full"
          style={{ width: `${progress * 100}%`, backgroundColor: colors.primary }}
        />
      </View>
    </Pressable>
  )
}
