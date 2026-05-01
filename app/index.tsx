import { useAuth } from "@/context/AuthContext"
import { Redirect } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import UserAuth from "@/components/UserAuth"

export default function Index() {
  const { user } = useAuth()

  if (user) {
    return <Redirect href="/(tabs)/home" />
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <UserAuth />
    </SafeAreaView>
  )
}