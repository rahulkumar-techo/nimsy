/**
 * Optimized Section Header
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
  /* SEE ALL VISIBILITY */
  const showModalSeeAll =
    !!data &&
    !!renderItem;

  /* DEFAULT KEY EXTRACTOR */
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
    <View className="mb-5 flex-row items-center justify-between px-5">
      <Text
        className="text-3xl font-black"
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
          <Text
            className="text-base font-bold"
            style={{ color: colors.primary }}
          >
            See All
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(SectionHeader) as typeof SectionHeader;
