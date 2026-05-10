import React, { useState } from "react"
import { Alert, Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "@/context/AuthContext"

type SettingsIconName = keyof typeof Ionicons.glyphMap

const SETTINGS_ITEMS: {
  id: string
  title: string
  subtitle: string
  icon: SettingsIconName
}[] = [
  {
    id: "notifications",
    title: "Notifications",
    subtitle: "Control reminders and learning updates.",
    icon: "notifications-outline",
  },
  {
    id: "privacy",
    title: "Privacy",
    subtitle: "Manage account visibility and permissions.",
    icon: "lock-closed-outline",
  },
  {
    id: "help",
    title: "Help and support",
    subtitle: "Find answers and contact the Nimsy team.",
    icon: "help-circle-outline",
  },
]

function SettingsRow({
  title,
  subtitle,
  icon,
  onPress,
  destructive = false,
}: {
  title: string
  subtitle: string
  icon: SettingsIconName
  onPress?: () => void
  destructive?: boolean
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-3xl bg-white px-4 py-4"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
        <Ionicons
          name={icon}
          size={22}
          color={destructive ? "#dc2626" : "#0f172a"}
        />
      </View>

      <View className="flex-1">
        <Text
          className={`text-base font-semibold ${
            destructive ? "text-red-600" : "text-slate-900"
          }`}
        >
          {title}
        </Text>
        <Text className="mt-1 text-sm leading-5 text-slate-500">
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={destructive ? "#f87171" : "#94a3b8"}
      />
    </Pressable>
  )
}

export default function UserSettingsSection() {
  const { logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    Alert.alert("Sign out", "Do you want to sign out from this account?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          if (isLoggingOut) return

          setIsLoggingOut(true)
          try {
            await logout()
          } finally {
            setIsLoggingOut(false)
          }
        },
      },
    ])
  }

  return (
    <View className="mt-8">
      <Text className="mb-4 text-lg font-bold text-slate-900">Settings</Text>

      {SETTINGS_ITEMS.map((item) => (
        <SettingsRow
          key={item.id}
          title={item.title}
          subtitle={item.subtitle}
          icon={item.icon}
        />
      ))}

      <SettingsRow
        title={isLoggingOut ? "Signing out..." : "Sign out"}
        subtitle="Log out from the current account on this device."
        icon="log-out-outline"
        destructive
        onPress={isLoggingOut ? undefined : handleLogout}
      />
    </View>
  )
}
