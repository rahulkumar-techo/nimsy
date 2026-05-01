
import { useEffect, useState } from "react"
import { View, Text, Pressable, ActivityIndicator, Image } from "react-native"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { useAuth } from "@/context/AuthContext"

const webClientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID

export default function UserAuth() {
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()

  useEffect(() => {
    GoogleSignin.configure({
      webClientId,
      scopes: ["profile", "email"],
    })
  }, [])

  const handleLogin = async () => {
    if (loading) return
    setLoading(true)

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })

      const response = await GoogleSignin.signIn()
      if (response.type !== "success") return

      const user = response.data.user

      setUser({
        id: user.id,
        name: user.name ?? user.givenName ?? "User",
        email: user.email,
        photo: user.photo ?? undefined,
      })
    } catch (error) {
      console.log("Login failed", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 justify-center items-center px-6">
      <View className="items-center mb-16">
        <Image
          source={require("@/assets/branding/nimsy-logo.png")}
          className="w-24 h-24 mb-4 rounded-full self-center"
          resizeMode="cover"
        />

        <Text className="text-4xl font-extrabold text-slate-900">Nimsy</Text>

        <Text className="text-slate-500 mt-2 text-center px-6">
          Smart learning platform for students
        </Text>
      </View>

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        className="w-full bg-blue-600 py-4 rounded-2xl items-center flex-row justify-center gap-3"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Image
              source={{
                uri: "https://developers.google.com/identity/images/g-logo.png",
              }}
              className="w-5 h-5"
            />
            <Text className="text-white text-[16px] font-semibold">
              Continue with Google
            </Text>
          </>
        )}
      </Pressable>
    </View>
  )
}
