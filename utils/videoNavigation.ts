import { router } from 'expo-router';

import type { Story } from '@/constants/story';
import type { QualitySource, SubtitleSource, VideoItem } from '@/types/video';

export function durationToSeconds(duration?: string | number) {
  if (typeof duration === 'number') return duration;
  if (!duration) return 0;

  const normalized = duration.trim().toLowerCase();
  const minuteMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(min|mins|minute|minutes)/);

  if (minuteMatch) {
    return Math.round(Number(minuteMatch[1]) * 60);
  }

  const clockParts = normalized.split(':').map(Number);

  if (clockParts.length === 2 && clockParts.every(Number.isFinite)) {
    return clockParts[0] * 60 + clockParts[1];
  }

  return Number.parseInt(normalized, 10) || 0;
}

export function createQualitySources(url: string): QualitySource[] {
  return [
    { label: 'Auto', url },
    { label: '240p', url },
    { label: '480p', url },
    { label: '720p', url },
    { label: '1080p', url },
  ];
}

export function storyToVideoItem(story: Story): VideoItem {
  return {
    id: story.id,
    title: story.title,
    url: story.videoUrl,
    thumbnail: story.thumbnail,
    duration: durationToSeconds(story.duration),
    subtitles: [] satisfies SubtitleSource[],
    qualities: createQualitySources(story.videoUrl),
  };
}

export function openVideoPlayer(video: VideoItem) {
  const qualities = video.qualities?.length
    ? video.qualities
    : createQualitySources(video.url);

  router.push({
    pathname: '/video-player',
    params: {
      videoUrl: video.url,
      thumbnail: video.thumbnail ?? '',
      title: video.title,
      duration: String(video.duration ?? 0),
      subtitles: JSON.stringify(video.subtitles ?? []),
      qualities: JSON.stringify(qualities),
    },
  } as never);
}

export function openStoryVideo(story: Story) {
  openVideoPlayer(storyToVideoItem(story));
}
