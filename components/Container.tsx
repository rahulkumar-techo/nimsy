import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { memo, type ReactNode } from "react"
import { Pressable, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

interface ContainerProps {
  wantBackBtn?: boolean
  title: string
  subtitle: string
  icon: keyof typeof Ionicons.glyphMap
  children?: ReactNode
}

const COLORS = {
  background: "bg-slate-50",
  cardBg: "bg-white",
  iconBg: "bg-blue-100",
  iconColor: "#2563eb",
  backBtnColor: "#0f172a",
  titleText: "text-slate-900",
  subtitleText: "text-slate-500",
} as const

const ICON_SIZES = {
  backBtn: 20,
  main: 26,
} as const

/** A reusable container component with optional back button, title, subtitle, and icon */
const Container = memo(function Container({
  wantBackBtn = false,
  title,
  subtitle,
  icon,
  children,
}: ContainerProps) {
  const handleBackPress = () => {
    router.back()
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-6 pt-6">
        {wantBackBtn && (
          <Pressable
            onPress={handleBackPress}
            className="mb-8 h-11 w-11 items-center justify-center rounded-full bg-white"
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons
              name="arrow-back"
              size={ICON_SIZES.backBtn}
              color={COLORS.backBtnColor}
            />
          </Pressable>
        )}
        <View className="rounded-[28px] bg-white p-6">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <Ionicons
              name={icon}
              size={ICON_SIZES.main}
              color={COLORS.iconColor}
            />
          </View>

          <Text className="mt-6 text-3xl font-extrabold text-slate-900">
            {title}
          </Text>

          <Text className="mt-3 text-base leading-6 text-slate-500">
            {subtitle}
          </Text>

          {children ? <View className="mt-6">{children}</View> : null}
        </View>
      </View>
    </SafeAreaView>
  )
})

export default Container
