/**
 * Selectable Option Chip
 */

import {
  Text,
  TouchableOpacity,
} from "react-native";

type Props = {
  title: string;
  active?: boolean;
};

const OptionChip = ({
  title,
  active,
}: Props) => {
  return (
    <TouchableOpacity
      className={`
      px-5 py-3 rounded-full mr-3 mb-3
      ${
        active
          ? "bg-indigo-100"
          : "bg-white border border-gray-200"
      }
    `}
    >
      <Text
        className={
          active
            ? "text-primary font-semibold"
            : "text-gray-600"
        }
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default OptionChip;