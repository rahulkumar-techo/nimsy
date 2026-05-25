import { memo, useMemo } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { QualitySource, SubtitleSource, VideoItem } from '@/types/video';
import { formatPlayerTime } from '@/hooks/useVideoPlayer';
import { openVideoPlayer } from '@/utils/videoNavigation';

const DEFAULT_QUALITIES: QualitySource[] = [
  { label: 'Auto', url: '' },
  { label: '240p', url: '' },
  { label: '480p', url: '' },
  { label: '720p', url: '' },
  { label: '1080p', url: '' },
];

type VideoCardProps = {
  video: VideoItem;
  className?:string
};

function VideoCard({ video,className }: VideoCardProps) {
  const qualities = useMemo(() => {
    const incoming = video.qualities?.length
      ? video.qualities
      : DEFAULT_QUALITIES.map((quality) => ({ ...quality, url: video.url }));

    return incoming.map((quality) => ({
      ...quality,
      url: quality.url || video.url,
    }));
  }, [video.qualities, video.url]);

  const subtitles: SubtitleSource[] = video.subtitles ?? [];

  const handlePress = () => {
    openVideoPlayer({
      ...video,
      qualities,
      subtitles,
    });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Play ${video.title}`}
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      className={className}
    >
      <ImageBackground
        source={{ uri: video.thumbnail }}
        resizeMode="cover"
        style={styles.poster}
        imageStyle={styles.posterImage}
      >
        <View style={styles.scrim} />
        <View style={styles.playButton}>
          <Ionicons name="play" size={22} color="#0b0d12" />
        </View>
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={1}>
            {video.title}
          </Text>
          {video.duration ? (
            <Text style={styles.duration}>{formatPlayerTime(video.duration)}</Text>
          ) : null}
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 188,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#151922',
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.82,
  },
  poster: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 14,
  },
  posterImage: {
    borderRadius: 8,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.24)',
  },
  playButton: {
    alignSelf: 'center',
    marginTop: 58,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  meta: {
    gap: 4,
  },
  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  duration: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default memo(VideoCard);
