/**
 * Profile Section Header
 */

import {
  memo,
  useCallback,
} from "react";

import {
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import SeeAll from "../SeeAll";
import { useTheme } from "@/context/ThemeContext";

type Props<T> = {
  title: string;
  data?: T[];
  renderItem?: ListRenderItem<T>;
  keyExtractor?: (
    item: T,
    index: number
  ) => string;
  horizontal?: boolean;
  onSeeAll?: () => void;
};

const SectionHeader = <T,>({
  title,
  data,
  renderItem,
  keyExtractor,
  horizontal,
  onSeeAll,
}: Props<T>) => {
  const { colors } = useTheme();
  const showModalSeeAll =
    !!data &&
    !!renderItem;

  const defaultKeyExtractor =
    useCallback(
      (
        item: any,
        index: number
      ) =>
        item?.id?.toString?.() ??
        index.toString(),
      []
    );

  return (
    <View className="mb-4 mt-8 flex-row items-center justify-between">
      <Text
        className="text-2xl font-black"
        style={{ color: colors.text }}
      >
        {title}
      </Text>

      {showModalSeeAll ? (
        <SeeAll
          title={title}
          data={data}
          renderItem={renderItem}
          keyExtractor={
            keyExtractor ??
            defaultKeyExtractor
          }
          horizontal={horizontal}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSeeAll}
        >
          <Text className="font-bold" style={{ color: colors.primary }}>
            View All
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(SectionHeader) as typeof SectionHeader;
