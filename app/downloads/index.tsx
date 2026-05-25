import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/context/ThemeContext';

import {
  useFocusEffect,
  useRouter,
} from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import {
  deleteDownload,
  getDownloads,
} from '@/utils/async-storage';

const MAX_STORAGE_MB = 1024; // 1 GB

const Downloads = () => {
  const { colors } = useTheme();

  const router = useRouter();

  const [downloads, setDownloads] =
    useState<any[]>([]);

  const loadDownloads = async () => {
    const data = await getDownloads();

    setDownloads(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadDownloads();
    }, [])
  );

  const handleDelete = async (
    id: string
  ) => {
    await deleteDownload(id);

    loadDownloads();
  };

  /* ---------------- STORAGE CALCULATION ---------------- */

  const totalUsedMB = useMemo(() => {
    return downloads.reduce(
      (acc: number, item: any) => {
        return (
          acc + (item.sizeMB || 0)
        );
      },
      0
    );
  }, [downloads]);

  const remainingMB =
    MAX_STORAGE_MB - totalUsedMB;

  const isStorageFull =
    totalUsedMB >= MAX_STORAGE_MB;

  /* ---------------- ITEM ---------------- */

  const renderItem = ({
    item,
  }: {
    item: any;
  }) => {
    return (
      <Pressable
        onPress={() =>
          router.push({
            pathname:
              '/video-player',
            params: {
              videoUrl:
                item.localPath,
              title: item.title,
              duration: String(item.duration || 0),
              qualities: JSON.stringify([
                { label: 'Auto', url: item.localPath },
                { label: '240p', url: item.localPath },
                { label: '480p', url: item.localPath },
                { label: '720p', url: item.localPath },
                { label: '1080p', url: item.localPath },
              ]),
              subtitles: JSON.stringify([]),
            },
          } as never)
        }
        className="mb-4 flex-row items-center rounded-2xl p-3"
        style={{
          backgroundColor:
            colors.card,
        }}
      >
        {/* ICON */}
        <View
          className="h-20 w-20 items-center justify-center rounded-xl"
          style={{
            backgroundColor:
              colors.primary,
          }}
        >
          <Ionicons
            name="videocam"
            size={30}
            color="#fff"
          />
        </View>

        {/* INFO */}
        <View className="ml-4 flex-1">
          <Text
            numberOfLines={2}
            className="text-base font-bold"
            style={{
              color: colors.text,
            }}
          >
            {item.title}
          </Text>

          <Text
            className="mt-1 text-xs"
            style={{
              color:
                colors.secondaryText,
            }}
          >
            {(item.sizeMB || 0).toFixed(
              2
            )}{' '}
            MB
          </Text>
        </View>

        {/* DELETE */}
        <Pressable
          onPress={() =>
            handleDelete(item.id)
          }
          className="p-2"
        >
          <Ionicons
            name="trash"
            size={22}
            color="red"
          />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor:
          colors.background,
      }}
    >
      <View className="flex-1 px-4 py-3">
        {/* HEADER */}
        <View className="flex-row items-center">
          <Pressable
            onPress={() =>
              router.back()
            }
            className="h-10 w-10 items-center justify-center"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={colors.text}
            />
          </Pressable>

          <Text
            className="ml-3 text-xl font-black"
            style={{
              color: colors.text,
            }}
          >
            Downloads
          </Text>
        </View>

        {/* STORAGE CARD */}
        <View
          className="mt-5 rounded-3xl p-4"
          style={{
            backgroundColor:
              colors.card,
          }}
        >
          <View className="flex-row items-center justify-between">
            <Text
              className="text-base font-bold"
              style={{
                color: colors.text,
              }}
            >
              Storage Usage
            </Text>

            <Text
              className="text-sm"
              style={{
                color:
                  colors.secondaryText,
              }}
            >
              {totalUsedMB.toFixed(
                2
              )}{' '}
              MB / 1024 MB
            </Text>
          </View>

          {/* PROGRESS */}
          <View
            className="mt-4 h-3 overflow-hidden rounded-full"
            style={{
              backgroundColor:
                '#d1d5db',
            }}
          >
            <View
              className="h-full rounded-full"
              style={{
                width: `${
                  (totalUsedMB /
                    MAX_STORAGE_MB) *
                  100
                }%`,
                backgroundColor:
                  isStorageFull
                    ? '#ef4444'
                    : '#22c55e',
              }}
            />
          </View>

          {/* REMAINING */}
          <Text
            className="mt-3 text-sm"
            style={{
              color:
                colors.secondaryText,
            }}
          >
            Remaining:{' '}
            {remainingMB.toFixed(2)} MB
          </Text>

          {/* WARNING */}
          {isStorageFull && (
            <View className="mt-4 flex-row items-center">
              <Ionicons
                name="warning"
                size={18}
                color="#ef4444"
              />

              <Text
                className="ml-2 flex-1 text-sm"
                style={{
                  color: '#ef4444',
                }}
              >
                Storage limit exceeded.
                Delete some videos to
                download more.
              </Text>
            </View>
          )}
        </View>

        {/* EMPTY */}
        {downloads.length === 0 ? (
          <View className="mt-40 items-center">
            <Ionicons
              name="cloud-download-outline"
              size={70}
              color={
                colors.secondaryText
              }
            />

            <Text
              className="mt-4 text-lg font-bold"
              style={{
                color: colors.text,
              }}
            >
              No Downloads Yet
            </Text>

            <Text
              className="mt-2 text-center"
              style={{
                color:
                  colors.secondaryText,
              }}
            >
              Download videos to
              watch offline
            </Text>
          </View>
        ) : (
          <FlatList
            data={downloads}
            keyExtractor={(item) =>
              item.id
            }
            renderItem={renderItem}
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingTop: 20,
              paddingBottom: 120,
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Downloads;
