import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { memo, useEffect } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { formatPlayerTime } from '@/hooks/useVideoPlayer';
import type { PlaybackSpeed, PlayerModal, VideoQuality } from '@/types/video';

type ControlsOverlayProps = {
  title: string;
  visible: boolean;
  isPlaying: boolean;
  hasEnded: boolean;
  position: number;
  duration: number;
  bufferedPosition: number;
  speed: PlaybackSpeed;
  selectedQuality: VideoQuality;
  selectedSubtitleId: string;
  onBack: () => void;
  onTogglePlay: () => void;
  onSeekBy: (seconds: number) => void;
  onSeekTo: (seconds: number) => void;
  onOpenModal: (modal: PlayerModal) => void;
  onRelockLandscape: () => void;
  onToggleControls: () => void;
};

function ControlsOverlay({
  title,
  visible,
  isPlaying,
  hasEnded,
  position,
  duration,
  bufferedPosition,
  speed,
  selectedQuality,
  selectedSubtitleId,
  onBack,
  onTogglePlay,
  onSeekBy,
  onSeekTo,
  onOpenModal,
  onRelockLandscape,
  onToggleControls,
}: ControlsOverlayProps) {
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const opacity = useSharedValue(1);
  const isCompact = height < 380 || width < 680;

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 180 });
  }, [opacity, visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const progress = duration > 0 ? position / duration : 0;
  const buffered = duration > 0 ? bufferedPosition / duration : 0;

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[styles.container, animatedStyle]}
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onToggleControls}
        accessibilityRole="button"
        accessibilityLabel="Hide player controls"
      />

      <View
        style={[
          styles.topBar,
          isCompact && styles.topBarCompact,
          {
            paddingLeft: Math.max(insets.left, 12),
            paddingRight: Math.max(insets.right, 12),
            paddingTop: Math.max(insets.top, 0),
          },
        ]}
      >
        <Pressable
          style={[styles.iconButton, isCompact && styles.iconButtonCompact]}
          onPress={onBack}
          accessibilityLabel="Close player"
        >
          <Ionicons name="arrow-back" size={isCompact ? 19 : 22} color="#fff" />
        </Pressable>
        <Text style={[styles.title, isCompact && styles.titleCompact]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View
        pointerEvents="box-none"
        style={[
          styles.centerControls,
          {
            top: (isCompact ? 48 : 64) + Math.max(insets.top, 0),
            bottom: (isCompact ? 78 : 96) + Math.max(insets.bottom, 0),
          },
        ]}
      >
        <Pressable
          style={[styles.seekButton, isCompact && styles.seekButtonCompact]}
          onPress={() => onSeekBy(-10)}
        >
          <Ionicons name="play-back" size={isCompact ? 20 : 24} color="#fff" />
          <Text style={styles.seekText}>10</Text>
        </Pressable>
        <Pressable
          style={[styles.playButton, isCompact && styles.playButtonCompact]}
          onPress={onTogglePlay}
        >
          <Ionicons
            name={hasEnded ? 'refresh' : isPlaying ? 'pause' : 'play'}
            size={isCompact ? 30 : 36}
            color="#0b0d12"
          />
        </Pressable>
        <Pressable
          style={[styles.seekButton, isCompact && styles.seekButtonCompact]}
          onPress={() => onSeekBy(10)}
        >
          <Ionicons name="play-forward" size={isCompact ? 20 : 24} color="#fff" />
          <Text style={styles.seekText}>10</Text>
        </Pressable>
      </View>

      <View
        style={[
          styles.bottomBar,
          isCompact && styles.bottomBarCompact,
          {
            paddingLeft: Math.max(insets.left, 12),
            paddingRight: Math.max(insets.right, 12),
            paddingBottom: Math.max(insets.bottom, isCompact ? 8 : 12),
          },
        ]}
      >
        <View style={styles.seekTrack}>
          <View style={[styles.bufferTrack, { width: `${Math.min(buffered, 1) * 100}%` }]} />
          <Slider
            style={StyleSheet.absoluteFill}
            value={Math.min(progress, 1)}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="transparent"
            thumbTintColor="#ffffff"
            onSlidingComplete={(value) => onSeekTo(value * duration)}
            accessibilityLabel="Video progress"
          />
        </View>

        <View style={styles.bottomRow}>
          <Text style={[styles.timeText, isCompact && styles.timeTextCompact]} numberOfLines={1}>
            {formatPlayerTime(position)} / {formatPlayerTime(duration)}
          </Text>
          <View style={[styles.actions, isCompact && styles.actionsCompact]}>
            <Pressable
              style={[styles.pill, isCompact && styles.pillCompact]}
              onPress={() => onOpenModal('speed')}
            >
              <Text style={[styles.pillText, isCompact && styles.pillTextCompact]}>
                {speed}x
              </Text>
            </Pressable>
            <Pressable
              style={[styles.pill, isCompact && styles.pillCompact]}
              onPress={() => onOpenModal('quality')}
            >
              <Text
                style={[styles.pillText, isCompact && styles.pillTextCompact]}
                numberOfLines={1}
              >
                {selectedQuality}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.pill, isCompact && styles.pillCompact]}
              onPress={() => onOpenModal('subtitle')}
            >
              <Ionicons
                name={selectedSubtitleId === 'off' ? 'text-outline' : 'text'}
                size={isCompact ? 13 : 15}
                color="#fff"
              />
            </Pressable>
            <Pressable
              style={[styles.pill, isCompact && styles.pillCompact]}
              onPress={onRelockLandscape}
            >
              <Ionicons name="scan-outline" size={isCompact ? 14 : 16} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.34)',
  },
  topBar: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.36)',
  },
  topBarCompact: {
    minHeight: 50,
    gap: 8,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  iconButtonCompact: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  titleCompact: {
    fontSize: 14,
  },
  centerControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 34,
  },
  seekButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  seekButtonCompact: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  seekText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    marginTop: -3,
  },
  playButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  playButtonCompact: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  bottomBar: {
    paddingTop: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomBarCompact: {
    paddingTop: 8,
  },
  seekTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  bufferTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.34)',
  },
  bottomRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeText: {
    minWidth: 86,
    flexShrink: 1,
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  timeTextCompact: {
    minWidth: 72,
    fontSize: 10,
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionsCompact: {
    gap: 5,
  },
  pill: {
    minWidth: 42,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  pillCompact: {
    minWidth: 32,
    maxWidth: 58,
    height: 28,
    paddingHorizontal: 7,
    borderRadius: 14,
  },
  pillText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  pillTextCompact: {
    fontSize: 10,
  },
});

export default memo(ControlsOverlay);
