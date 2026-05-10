import React, { type ReactNode } from "react"
import { View } from "react-native"

type Props = {
  children: ReactNode
  className?: string
}

export default function HomeSectionContainer({
  children,
  className = "",
}: Props) {
  return (
    <View className={`w-full px-4 ${className}`.trim()}>
      {children}
    </View>
  )
}
