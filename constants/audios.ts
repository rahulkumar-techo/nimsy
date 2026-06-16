export interface Audio {
  id: string;
  title: string;
  cover: string;
  artist: string;
  duration: string;
}

export const audios: Audio[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `${i + 1}`,
  title: `Podcast Episode ${i + 1}`,
  cover: `https://picsum.photos/400?random=${i + 200}`,
  artist: `Creator ${i + 1}`,
  duration: `${20 + i} min`,
}));