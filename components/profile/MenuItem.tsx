/**
 * Profile Menu Item
 */

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";
import {
  Href,
  useRouter,
} from "expo-router";

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  link?: Href;
};

const MenuItem = ({
  title,
  icon,
  link,
}: Props) => {
  const router = useRouter();

  const handleRedirect = () => {
    const destination =
      link ?? {
        pathname: "/profile/[id]",
        params: { id: title },
      };

    router.push(destination);
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-5 flex-row items-center justify-between border border-gray-100 mb-3"
      onPress={handleRedirect}
    >
      <View className="flex-row items-center">
        <Ionicons name={icon} size={22} color="#5B5FFF" />

        <Text className="ml-4 font-medium text-base">
          {title}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );
};

export default MenuItem;