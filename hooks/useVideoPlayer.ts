import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useVideoPlayer as useExpoVideoPlayer,
  type SubtitleTrack,
  type VideoPlayerStatus,
} from 'expo-video';

import type {
  PlaybackSpeed,
  QualitySource,
  SubtitleSource,
  VideoQuality,
} from '@/types/video';

const FALLBACK_DURATION = 0;

type UseVideoPlayerOptions = {
  title: string;
  videoUrl: string;
  duration?: number;
  qualities: QualitySource[];
  subtitles: SubtitleSource[];
};

export function formatPlayerTime(seconds: number) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const mins = Math.floor(safeSeconds / 60);
  const secs = Math.floor(safeSeconds % 60);

  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function useVideoPlayer({
  title,
  videoUrl,
  duration,
  qualities,
  subtitles,
}: UseVideoPlayerOptions) {
  const initialSource = useMemo(
    () => ({
      uri: videoUrl,
      metadata: { title },
    }),
    [title, videoUrl]
  );

  const player = useExpoVideoPlayer(initialSource, (instance) => {
    instance.loop = false;
    instance.playbackRate = 1;
    instance.timeUpdateEventInterval = 0.25;
    instance.keepScreenOnWhilePlaying = true;
    instance.play();
  });

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [status, setStatus] = useState<VideoPlayerStatus>('loading');
  const [position, setPosition] = useState(0);
  const [resolvedDuration, setResolvedDuration] = useState(
    duration ?? FALLBACK_DURATION
  );
  const [bufferedPosition, setBufferedPosition] = useState(0);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>('Auto');
  const [selectedSubtitleId, setSelectedSubtitleId] = useState<string>('off');
  const [nativeSubtitles, setNativeSubtitles] = useState<SubtitleTrack[]>([]);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isSwitchingQuality, setIsSwitchingQuality] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHideControls = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  }, [clearHideTimer]);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    scheduleHideControls();
  }, [scheduleHideControls]);

  const toggleControls = useCallback(() => {
    setControlsVisible((visible) => {
      const next = !visible;

      if (next) {
        scheduleHideControls();
      } else {
        clearHideTimer();
      }

      return next;
    });
  }, [clearHideTimer, scheduleHideControls]);

  useEffect(() => {
    scheduleHideControls();

    return clearHideTimer;
  }, [clearHideTimer, scheduleHideControls]);

  useEffect(() => {
    const subs = [
      player.addListener('playingChange', ({ isPlaying: nextPlaying }) => {
        setIsPlaying(nextPlaying);
        if (nextPlaying) {
          scheduleHideControls();
        } else {
          setControlsVisible(true);
          clearHideTimer();
        }
      }),
      player.addListener('statusChange', ({ status: nextStatus }) => {
        setStatus(nextStatus);
      }),
      player.addListener('timeUpdate', ({ currentTime, bufferedPosition }) => {
        setPosition(currentTime);
        setBufferedPosition(Math.max(0, bufferedPosition));
        setResolvedDuration((currentDuration) =>
          player.duration > 0 ? player.duration : currentDuration
        );
      }),
      player.addListener('sourceLoad', (payload) => {
        setHasEnded(false);
        setResolvedDuration(payload.duration || duration || FALLBACK_DURATION);
        setNativeSubtitles(payload.availableSubtitleTracks ?? []);
      }),
      player.addListener('playToEnd', () => {
        setHasEnded(true);
        setIsPlaying(false);
        setControlsVisible(true);
        clearHideTimer();
      }),
    ];

    return () => {
      subs.forEach((sub) => sub.remove());
    };
  }, [clearHideTimer, duration, player, scheduleHideControls]);

  const togglePlay = useCallback(() => {
    if (hasEnded) {
      player.replay();
      setHasEnded(false);
      setIsPlaying(true);
      showControls();
      return;
    }

    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }

    showControls();
  }, [hasEnded, isPlaying, player, showControls]);

  const seekTo = useCallback(
    (nextPosition: number) => {
      const maxDuration = resolvedDuration || player.duration || 0;
      player.currentTime = Math.max(0, Math.min(maxDuration, nextPosition));
      setPosition(player.currentTime);
      showControls();
    },
    [player, resolvedDuration, showControls]
  );

  const seekBy = useCallback(
    (seconds: number) => {
      const maxDuration = resolvedDuration || player.duration || 0;
      const nextPosition = Math.max(0, Math.min(maxDuration, player.currentTime + seconds));

      player.seekBy(seconds);
      player.currentTime = nextPosition;
      setPosition(nextPosition);
      showControls();
    },
    [player, resolvedDuration, showControls]
  );

  const changeSpeed = useCallback(
    (nextSpeed: PlaybackSpeed) => {
      player.playbackRate = nextSpeed;
      setSpeed(nextSpeed);
      showControls();
    },
    [player, showControls]
  );

  const changeQuality = useCallback(
    async (quality: QualitySource) => {
      if (!quality.url) return;

      const resumeAt = player.currentTime;
      const shouldResume = isPlaying;

      setIsSwitchingQuality(true);
      setSelectedQuality(quality.label);

      try {
        await player.replaceAsync({
          uri: quality.url,
          metadata: { title },
        });
        player.playbackRate = speed;
        player.currentTime = resumeAt;

        if (shouldResume) {
          player.play();
          setIsPlaying(true);
        } else {
          player.pause();
          setIsPlaying(false);
        }
      } finally {
        setIsSwitchingQuality(false);
        showControls();
      }
    },
    [isPlaying, player, showControls, speed, title]
  );

  const changeSubtitle = useCallback(
    (subtitleId: string) => {
      setSelectedSubtitleId(subtitleId);

      if (subtitleId === 'off') {
        player.subtitleTrack = null;
        return;
      }

      const appSubtitle = subtitles.find((item) => item.id === subtitleId);
      const nativeSubtitle = nativeSubtitles.find((track) => {
        return (
          track.language === appSubtitle?.language ||
          track.label === appSubtitle?.label ||
          track.id === appSubtitle?.id
        );
      });

      if (nativeSubtitle) {
        player.subtitleTrack = nativeSubtitle;
      }
    },
    [nativeSubtitles, player, subtitles]
  );

  return {
    player,
    status,
    isPlaying,
    hasEnded,
    position,
    duration: resolvedDuration,
    bufferedPosition,
    speed,
    selectedQuality,
    selectedSubtitleId,
    nativeSubtitles,
    controlsVisible,
    isBuffering: status === 'loading' || isSwitchingQuality,
    togglePlay,
    seekTo,
    seekBy,
    changeSpeed,
    changeQuality,
    changeSubtitle,
    showControls,
    toggleControls,
  };
}
