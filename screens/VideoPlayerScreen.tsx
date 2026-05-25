import { useCallback, useEffect, useMemo, useRef } from 'react';
import { BackHandler, Platform, StatusBar as RNStatusBar, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';

import VideoPlayer from '@/components/video-player/VideoPlayer';
import type { QualitySource, SubtitleSource } from '@/types/video';

const DEFAULT_VIDEO =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

async function lockPlayerLandscape() {
  RNStatusBar.setHidden(true, 'fade');

  if (Platform.OS === 'android') {
    RNStatusBar.setTranslucent(true);
    RNStatusBar.setBackgroundColor('transparent', true);
  }

  try {
    const canUseLandscape = await ScreenOrientation.supportsOrientationLockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );

    await ScreenOrientation.lockAsync(
      canUseLandscape
        ? ScreenOrientation.OrientationLock.LANDSCAPE
        : ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    );
  } catch {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    ).catch(() => {});
  }
}

async function restorePortrait() {
  try {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  } finally {
    RNStatusBar.setHidden(false, 'fade');

    if (Platform.OS === 'android') {
      RNStatusBar.setTranslucent(false);
      RNStatusBar.setBackgroundColor('#000000', true);
    }
  }
}

function safeJson<T>(value: string | string[] | undefined, fallback: T): T {
  const raw = Array.isArray(value) ? value[0] : value;

  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function VideoPlayerScreen() {
  const isClosingRef = useRef(false);
  const params = useLocalSearchParams<{
    videoUrl?: string;
    thumbnail?: string;
    title?: string;
    duration?: string;
    qualities?: string;
    subtitles?: string;
  }>();

  const videoUrl = params.videoUrl || DEFAULT_VIDEO;
  const title = params.title || 'Video';
  const duration = Number(params.duration || 0);

  const qualities = useMemo<QualitySource[]>(() => {
    const parsed = safeJson<QualitySource[]>(params.qualities, []);

    if (parsed.length) {
      return parsed.map((quality) => ({
        ...quality,
        url: quality.url || videoUrl,
      }));
    }

    return [
      { label: 'Auto', url: videoUrl },
      { label: '240p', url: videoUrl },
      { label: '480p', url: videoUrl },
      { label: '720p', url: videoUrl },
      { label: '1080p', url: videoUrl },
    ];
  }, [params.qualities, videoUrl]);

  const subtitles = useMemo(
    () => safeJson<SubtitleSource[]>(params.subtitles, []),
    [params.subtitles]
  );

  const closePlayer = useCallback(async () => {
    if (isClosingRef.current) return;

    isClosingRef.current = true;
    await restorePortrait();
    router.back();
  }, []);

  useEffect(() => {
    const orientationTimer = setTimeout(() => {
      lockPlayerLandscape();
    }, 80);

    const backSub = BackHandler.addEventListener('hardwareBackPress', () => {
      closePlayer();
      return true;
    });

    return () => {
      clearTimeout(orientationTimer);
      backSub.remove();
      restorePortrait();
    };
  }, [closePlayer]);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar hidden />
      <VideoPlayer
        title={title}
        videoUrl={videoUrl}
        duration={duration}
        qualities={qualities}
        subtitles={subtitles}
        onBack={closePlayer}
      />
    </View>
  );
}
