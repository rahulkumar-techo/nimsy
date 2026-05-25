/**
 * CategoryChips (Action Version)
 * - No selected state
 * - Acts like navigation / trigger
 */

import { FlatList, Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Href, useRouter } from "expo-router"
import { useTheme } from "@/context/ThemeContext"

export type CategoryChip = {
  id: string
  title: string
  icon: keyof typeof Ionicons.glyphMap
  route:Href
}

type Props = {
  data: CategoryChip[]
}

const CATEGORY_ROUTES: Record<string, Href> = {
  stories: "/stories",
  videos: "/videos",
  audio: {
    pathname: "/audio",
    params: {
      id: "1",
    },
  },
  favorites: "/favorites",
}

export default function CategoryChips({ data }: Props) {
  const router = useRouter()
  const { colors } = useTheme()

  return (
    <FlatList
      data={data}
      horizontal
      style={{ width: "100%" }}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}

      ItemSeparatorComponent={() => <View style={{ width: 12 }} />}

      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            const route = CATEGORY_ROUTES[item.id]

            if (route) {
              router.push(route)
            }
          }}
          className="flex-row items-center px-4 py-3 rounded-2xl border"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.shadow,
            shadowOpacity: 0.05,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <Ionicons
            name={item.icon}
            size={18}
            color={colors.text}
            style={{ marginRight: 6 }}
          />

          <Text
            className="text-sm font-semibold"
            style={{ color: colors.text }}
          >
            {item.title}
          </Text>
        </Pressable>
      )}
    />
  )
}
