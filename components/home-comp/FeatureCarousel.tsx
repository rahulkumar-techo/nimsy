/**
 * FeatureCarousel (Logic + Slider)
 */

import React, { useRef, useState } from "react"
import {
  FlatList,
  Platform,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from "react-native"
import FeatureCard from "./FeatureCard"

type Props = {
  data: {
    title: string
    subtitle?: string
    image: ImageSourcePropType
  }[]
}

export default function FeatureCarousel({ data }: Props) {
  const { width } = useWindowDimensions()
  const [activeIndex, setActiveIndex] = useState(0)
  const cardWidth = width - 32
  const snapDecelerationRate = Platform.select({
    ios: 0.994,
    android: 0.985,
    default: 0.99,
  })

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  })

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      const index = viewableItems[0]?.index
      if (typeof index === "number") {
        setActiveIndex(index)
      }
    }
  )

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
            className={`h-2 rounded-full ${index === activeIndex
                ? "w-6 bg-blue-600"
                : "w-2 bg-blue-200"
              }`}
          />
        ))}
      </View>

    </View>
  )
}
