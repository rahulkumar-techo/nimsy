/**
 * Top Menu Component
 */


import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  item: {
    title: string;
    icon: string;
    color: string;
  };
};

const TopMenu = ({
  item,
}: Props) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity className="items-center">
      <View
        className={`h-20 w-20 items-center justify-center rounded-[30px] ${item.color}`}
      >
        <Ionicons
          name={item.icon as any}
          size={34}
          color="white"
        />
      </View>

      <Text
        className="mt-3 text-base font-semibold"
        style={{ color: colors.text }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

export default TopMenu;
