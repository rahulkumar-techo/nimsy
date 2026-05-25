export type VideoQuality = 'Auto' | '240p' | '480p' | '720p' | '1080p';

export type PlaybackSpeed = 0.5 | 1 | 1.25 | 1.5 | 2;

export type QualitySource = {
  label: VideoQuality;
  url: string;
};

export type SubtitleSource = {
  id: string;
  label: string;
  language: string;
  url?: string;
};

export type VideoItem = {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  duration?: number;
  subtitles?: SubtitleSource[];
  qualities?: QualitySource[];
};

export type PlayerModal = 'speed' | 'quality' | 'subtitle' | null;
