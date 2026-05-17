
import { useEffect, useState } from "react"
import { View, Text, Pressable, ActivityIndicator, Image } from "react-native"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"

const webClientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID

export default function UserAuth() {
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const { colors } = useTheme()

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

        <Text
          className="text-4xl font-extrabold"
          style={{ color: colors.text }}
        >
          Nimsy
        </Text>

        <Text
          className="mt-2 text-center px-6"
          style={{ color: colors.secondaryText }}
        >
          Smart learning platform for students
        </Text>
      </View>

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        className="w-full py-4 rounded-2xl items-center flex-row justify-center gap-3"
        style={{ backgroundColor: colors.primary }}
      >
        {loading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <>
            <Image
              source={{
                uri: "https://developers.google.com/identity/images/g-logo.png",
              }}
              className="w-5 h-5"
            />
            <Text
              className="text-[16px] font-semibold"
              style={{ color: colors.buttonText }}
            >
              Continue with Google
            </Text>
          </>
        )}
      </Pressable>
    </View>
  )
}
