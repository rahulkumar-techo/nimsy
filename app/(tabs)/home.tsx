import HomeScreen from "@/screens/home"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Home() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <HomeScreen />
    </SafeAreaView>
  )
}