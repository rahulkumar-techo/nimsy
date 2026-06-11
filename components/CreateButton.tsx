/**
 * Floating Create Button
 */

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  TouchableOpacity,
  View,
} from "react-native";

export function CreateButton() {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() =>
        router.push("/(tabs)/create")
      }
      style={{
        position: "absolute",
        alignSelf: "center",
        bottom: 55,
      }}
    >
      <View
        style={{
          width: 62,
          height: 62,
          borderRadius: 31,

          justifyContent: "center",
          alignItems: "center",

          backgroundColor: "#000",

          shadowOpacity: 0.2,
          shadowRadius: 10,
          shadowOffset: {
            width: 0,
            height: 5,
          },

          elevation: 8,
        }}
      >
        <Ionicons
          name="add"
          size={34}
          color="#fff"
        />
      </View>
    </TouchableOpacity>
  );
}