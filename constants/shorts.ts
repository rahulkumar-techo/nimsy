export const shorts = Array.from({ length: 8 }).map((_, i) => ({
  id: `${i + 1}`,
  title: `Short Video ${i + 1}`,
  thumbnail: `https://picsum.photos/300/500?random=${i + 1}`,
  views: `${(i + 1) * 120}K`,
}));