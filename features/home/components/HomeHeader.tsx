import { Bell, Search } from "lucide-react-native";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";

export default function HomeHeader() {
  const { colors } = useTheme()
  const totalNotifications = 1250;
  const readNotifications = 25;

  const unreadCount = Math.max(totalNotifications - readNotifications, 0);
  const notificationBadge = unreadCount > 99 ? "99" : unreadCount > 0 ? String(unreadCount) : null;
  return (
    <View className="flex-row items-center justify-between px-4 py-3"
      style={{ backgroundColor: colors.background }}>

      <View className="flex-row items-center">

        <Text className="text-xl font-bold ml-1" style={{ color: colors.primaryText }}>Nimsy</Text>
      </View>

      <View className="flex-row items-center gap-5"

      >
        <TouchableOpacity className="relative">
          <Bell size={24} color={colors.text} />

          {notificationBadge && (
            <View className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-red-600 rounded-full items-center justify-center flex-row">
              <Text className=" text-[10px] font-bold"
                style={{ color: colors.text }}
              >{notificationBadge}</Text>
              {unreadCount > 99 && <Text className="text-white text-[10px] font-bold">+</Text>}
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/search")}>
          <Search size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}