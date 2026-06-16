export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  channelAvatar: string;
  verified: boolean;
  views: string;
  duration: string;
  uploadedAt: string;
}

export const videos: Video[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `${i + 1}`,
  title: `Building a YouTube Clone with React Native Part ${i + 1}`,
  thumbnail: `https://picsum.photos/800/450?random=${i + 10}`,
  channelAvatar: `https://picsum.photos/100?random=${i + 100}`,
  channelName: `Tech Creator ${i + 1}`,
  verified: i % 2 === 0,
  views: `${(i + 1) * 120}K views`,
  duration: `${10 + i}:2${i % 9}`,
  uploadedAt: `${i + 1} days ago`,
}));