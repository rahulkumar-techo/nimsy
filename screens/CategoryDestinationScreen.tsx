import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { Pressable, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type Props = {
  title: string
  subtitle: string
  icon: keyof typeof Ionicons.glyphMap
}

export default function CategoryDestinationScreen({
  title,
  subtitle,
  icon,
}: Props) {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-6 pt-6">
        <Pressable
          onPress={() => router.back()}
          className="mb-8 h-11 w-11 items-center justify-center rounded-full bg-white"
        >
          <Ionicons name="arrow-back" size={20} color="#0f172a" />
        </Pressable>

        <View className="rounded-[28px] bg-white p-6">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <Ionicons name={icon} size={26} color="#2563eb" />
          </View>

          <Text className="mt-6 text-3xl font-extrabold text-slate-900">
            {title}
          </Text>

          <Text className="mt-3 text-base leading-6 text-slate-500">
            {subtitle}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
