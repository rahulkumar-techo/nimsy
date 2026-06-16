import HomeFeed from "@/components/home/HomeFeed"
import { useTheme } from "@/context/ThemeContext"
import { SafeAreaView } from "react-native-safe-area-context"



export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      className="flex-1"
      edges={[ "left", "right"]}
      style={{ backgroundColor: colors.background }}
    >
      <HomeFeed />
    </SafeAreaView>
  )
}

