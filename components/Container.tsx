import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { memo, type ReactNode } from "react"
import { Pressable, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/context/ThemeContext"

interface ContainerProps {
  wantBackBtn?: boolean
  title: string
  subtitle: string
  icon: keyof typeof Ionicons.glyphMap
  children?: ReactNode,
  className?:string
}

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
  className
}: ContainerProps) {
  const { colors } = useTheme()

  const handleBackPress = () => {
    router.back()
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <View className={className}>
        {wantBackBtn && (
          <Pressable
            onPress={handleBackPress}
            className="mb-8 h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.card }}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons
              name="arrow-back"
              size={ICON_SIZES.backBtn}
              color={colors.text}
            />
          </Pressable>
        )}
        <View
          className="rounded-[28px] p-6"
          style={{ backgroundColor: colors.card }}
        >
          <View
            className="h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: colors.primaryLight }}
          >
            <Ionicons
              name={icon}
              size={ICON_SIZES.main}
              color={colors.primary}
            />
          </View>

          <Text
            className="mt-6 text-3xl font-extrabold"
            style={{ color: colors.text }}
          >
            {title}
          </Text>

          <Text
            className="mt-3 text-base leading-6"
            style={{ color: colors.secondaryText }}
          >
            {subtitle}
          </Text>

          {children ? <View className="mt-6">{children}</View> : null}
        </View>
      </View>
    </SafeAreaView>
  )
})

export default Container
