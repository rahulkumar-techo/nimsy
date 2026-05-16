/**
 * Profile Header
 */

import React from "react";

import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

const ProfileHeader = () => {
  const { user } = useAuth();
  return (
    <View className="flex-row items-start justify-between">
      {/* LEFT */}
      <View className="flex-1 flex-row">
        {/* IMAGE */}
        <View>
          <Image
            source={{
              uri: user?.photo ||"https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
            }}
            className="h-24 w-24 rounded-full border-4 border-violet-400"
          />

          <TouchableOpacity className="absolute bottom-0 right-0 h-10 w-10 items-center justify-center rounded-full bg-violet-600">
            <Ionicons
              name="pencil"
              size={18}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* INFO */}
        <View className="ml-4 flex-1">
          <Text
            numberOfLines={1}
            className="text-3xl font-black text-slate-900"
          >
           {user?.name}
          </Text>

          <View className="mt-3 self-start rounded-full bg-violet-600 px-4 py-2">
            <Text className="font-bold text-white">
              Level 12
            </Text>
          </View>

          <Text className="mt-3 text-base text-slate-500">
            ⭐ Little Explorer
          </Text>
        </View>
      </View>

      {/* RIGHT ICONS */}
      <View className="ml-3 flex-row items-center">
        <TouchableOpacity className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <Ionicons
            name="notifications-outline"
            size={24}
            color="black"
          />
        </TouchableOpacity>

        <TouchableOpacity className="h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <Ionicons
            name="settings-outline"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(
  ProfileHeader
);