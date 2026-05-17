/**
 * FeatureCarousel (Logic + Slider)
 */

import React, { useState } from "react"
import {
  FlatList,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from "react-native"
import FeatureCard from "./FeatureCard"
import { useTheme } from "@/context/ThemeContext"

type Props = {
  data: {
    title: string
    subtitle?: string
    image: ImageSourcePropType
  }[]
}

export default function FeatureCarousel({ data }: Props) {
  const { width } = useWindowDimensions()
  const { colors } = useTheme()
  const [activeIndex, setActiveIndex] = useState(0)
  const cardWidth = width - 32

  return (
    <View>

      {/* Slider */}
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"

        // smooth animation
        decelerationRate="normal"

        // improves gesture feel
        scrollEventThrottle={16}

        // performance
        initialNumToRender={3}
        windowSize={3}
        removeClippedSubviews={false}

        keyExtractor={(_, i) => i.toString()}

        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / width
          )
          setActiveIndex(index)
        }}

        renderItem={({ item }) => (
          <View style={{ width, paddingHorizontal: 16 }}>
            <FeatureCard {...item} width={cardWidth} />
          </View>
        )}
      />

      {/* Pagination */}
      <View className="mt-4 flex-row justify-center gap-2">
        {data.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full ${index === activeIndex ? "w-6" : "w-2"}`}
            style={{
              backgroundColor:
                index === activeIndex ? colors.primary : colors.border,
            }}
          />
        ))}
      </View>

    </View>
  )
}
