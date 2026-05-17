/**
 * Reusable Full Screen SeeAll Modal
 * React Native + NativeWind
 */

import React, {
    useState,
} from "react";

import {
    FlatList,
    ListRenderItem,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

type Props<T> = {
    title?: string;

    // data
    data: T[];

    // render item
    renderItem: ListRenderItem<T>;

    // key extractor
    keyExtractor?: (
        item: T,
        index: number
    ) => string;

    // list direction
    horizontal?: boolean;

    // custom style
    className?: string;
    limit?: number;
};

const SeeAll = <T,>({
    title = "Section",
    data,
    renderItem,
    keyExtractor,
    horizontal = false,
    className,
    limit
}: Props<T>) => {
    const [visible, setVisible] =
        useState(false);

    return (
        <>
            {/* Open Button */}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setVisible(true)}
                className="flex-row items-center gap-1"
            >
                <Text className=" text-xl font-semibold text-blue-500">
                    See All
                </Text>

                <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#3b82f6"
                />
            </TouchableOpacity>

            {/* Full Screen Modal */}
            <Modal
                visible={visible}
                animationType="slide"
                presentationStyle="fullScreen"
                onRequestClose={() =>
                    setVisible(false)
                }
            >
                <View
                    className={`flex-1 bg-white dark:bg-black ${className}`}
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between border-b border-zinc-200 px-5 pb-4 pt-14 dark:border-zinc-800">
                        <Text className="text-2xl font-bold text-black dark:text-white">
                            {title}
                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() =>
                                setVisible(false)
                            }
                            className="h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900"
                        >
                            <Ionicons
                                name="close"
                                size={22}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <FlatList
                        horizontal={horizontal}
                        data={data.slice(0, limit)}
                        renderItem={renderItem}
                        keyExtractor={
                            keyExtractor ||
                            ((_, index) =>
                                index.toString())
                        }
                        showsHorizontalScrollIndicator={
                            false
                        }
                        showsVerticalScrollIndicator={
                            false
                        }
                        contentContainerStyle={{
                            padding: 20,
                            gap: 16,
                        }}

                    />
                </View>
            </Modal>
        </>
    );
};

export default SeeAll;