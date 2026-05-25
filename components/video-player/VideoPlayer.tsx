import { memo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { VideoView } from 'expo-video';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ScreenOrientation from 'expo-screen-orientation';

import ControlsOverlay from '@/components/video-player/ControlsOverlay';
import QualityModal from '@/components/video-player/QualityModal';
import SpeedModal from '@/components/video-player/SpeedModal';
import SubtitleModal from '@/components/video-player/SubtitleModal';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import type { PlayerModal, QualitySource, SubtitleSource } from '@/types/video';

type VideoPlayerProps = {
  title: string;
  videoUrl: string;
  duration?: number;
  qualities: QualitySource[];
  subtitles: SubtitleSource[];
  onBack: () => void;
};

function VideoPlayer({
  title,
  videoUrl,
  duration,
  qualities,
  subtitles,
  onBack,
}: VideoPlayerProps) {
  const [activeModal, setActiveModal] = useState<PlayerModal>(null);
  const controls = useVideoPlayer({
    title,
    videoUrl,
    duration,
    qualities,
    subtitles,
  });

  const relockLandscape = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    controls.showControls();
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.stage}>
        <VideoView
          player={controls.player}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={false}
          fullscreenOptions={{ enable: true, orientation: 'landscape' }}
          allowsPictureInPicture
        />

        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={controls.toggleControls}
          accessibilityRole="button"
          accessibilityLabel="Toggle player controls"
        />

        {controls.isBuffering ? (
          <View pointerEvents="none" style={styles.loader}>
            <ActivityIndicator color="#fff" size="large" />
          </View>
        ) : null}

        <ControlsOverlay
          title={title}
          visible={controls.controlsVisible}
          isPlaying={controls.isPlaying}
          hasEnded={controls.hasEnded}
          position={controls.position}
          duration={controls.duration}
          bufferedPosition={controls.bufferedPosition}
          speed={controls.speed}
          selectedQuality={controls.selectedQuality}
          selectedSubtitleId={controls.selectedSubtitleId}
          onBack={onBack}
          onTogglePlay={controls.togglePlay}
          onSeekBy={controls.seekBy}
          onSeekTo={controls.seekTo}
          onOpenModal={setActiveModal}
          onRelockLandscape={relockLandscape}
          onToggleControls={controls.toggleControls}
        />
      </View>

      <SpeedModal
        visible={activeModal === 'speed'}
        selectedSpeed={controls.speed}
        onSelect={controls.changeSpeed}
        onClose={() => setActiveModal(null)}
      />
      <QualityModal
        visible={activeModal === 'quality'}
        qualities={qualities}
        selectedQuality={controls.selectedQuality}
        onSelect={controls.changeQuality}
        onClose={() => setActiveModal(null)}
      />
      <SubtitleModal
        visible={activeModal === 'subtitle'}
        subtitles={subtitles}
        selectedSubtitleId={controls.selectedSubtitleId}
        onSelect={controls.changeSubtitle}
        onClose={() => setActiveModal(null)}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  stage: {
    flex: 1,
    backgroundColor: '#000',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
});

export default memo(VideoPlayer);
