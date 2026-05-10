/**
 * HomeFeatureCard (Slider Card)
 * - Image background
 * - Overlay
 * - Title + subtitle
 * - Read More button
 */

import React from "react"
import {
  ImageBackground,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native"

type Props = {
  title: string
  subtitle?: string
  image: ImageSourcePropType
  onPress?: () => void
  ctaLabel?: string
  width?: number
}

const FeatureCard = ({
  title,
  subtitle,
  image,
  onPress,
  ctaLabel = "Read More",
  width = 280,
}: Props) => {
  const isInteractive = typeof onPress === "function"

  return (
    <View className="h-[180px] overflow-hidden rounded-2xl" style={{ width }}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="flex-1 justify-end bg-black/40 p-4">
          {subtitle && (
            <Text className="text-xs font-semibold uppercase tracking-wide text-gray-200">
              {subtitle}
            </Text>
          )}

          <Text className="mt-2 text-lg font-bold text-white">
            {title}
          </Text>

          {isInteractive ? (
            <Pressable
              onPress={onPress}
              className="mt-4 self-start rounded-lg bg-white/90 px-3 py-2"
            >
              <Text className="text-sm font-semibold text-black">
                {ctaLabel}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </ImageBackground>
    </View>
  )
}

export default FeatureCard
