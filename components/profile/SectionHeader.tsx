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
      <Text className="text-2xl font-black text-slate-900">
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
          <Text className="font-bold text-violet-600">
            View All
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(SectionHeader) as typeof SectionHeader;
