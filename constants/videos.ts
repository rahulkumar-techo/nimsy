/**
 * Video Types
 */

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  uri: string;
  channelName: string;
  channelAvatar: string;
  verified: boolean;
  views: string;
  duration: string;
  uploadedAt: string;
}

/**
 * Public Working Videos
 */

const sampleVideos = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://media.w3.org/2010/05/sintel/trailer.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://flutter.github.io/assets-for-api-docs/assets/videos/bee.mp4",
];

/**
 * Sample Feed Data
 */

export const videos: Video[] = Array.from(
  { length: 20 },
  (_, index): Video => ({
    id: String(index + 1),

    title: `Building a YouTube Clone with React Native Part ${
      index + 1
    }`,

    uri: sampleVideos[index % sampleVideos.length],

    thumbnail: `https://picsum.photos/1280/720?random=${index + 1}`,

    channelAvatar: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,

    channelName: `Tech Creator ${index + 1}`,

    verified: index % 2 === 0,

    views: `${(index + 1) * 125}K views`,

    duration: `${5 + (index % 15)}:${String(
      10 + (index % 50)
    ).padStart(2, "0")}`,

    uploadedAt: `${index + 1} days ago`,
  })
);