/**
 * Dummy Audio Stories Data
 * Real Working Audio URLs
 */

export const DUMMY_AUDIO_STORIES = [
  {
    id: "1",
    title: "The Night Sky",
    subtitle: "Relaxing bedtime audio story",
    description:
      "A soft nighttime journey about looking up at the stars, slowing down, and letting the day become quiet. Best for bedtime, calm listening, and winding down after a busy evening.",
    narrator: "Nimsy Audio",
    duration: "6 min",
    progress: 50,

    audio:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",

    thumbnail:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },

  {
    id: "2",
    title: "Forest Dreams",
    subtitle: "Nature ambient storytelling",
    description:
      "A peaceful walk through a green forest where every sound feels gentle. This audio story blends simple narration with a calm mood for quiet time.",
    narrator: "Nimsy Audio",
    duration: "12 min",
    progress: 70,

    audio:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",

    thumbnail:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  },

  {
    id: "3",
    title: "Ocean Waves",
    subtitle: "Sleep meditation story",
    description:
      "A slow ocean-side story with steady waves, warm sand, and a calm breathing rhythm. Made for relaxed listening before sleep.",
    narrator: "Nimsy Audio",
    duration: "15 min",
    progress: 35,

    audio:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",

    thumbnail:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },

  {
    id: "4",
    title: "Moonlight Tales",
    subtitle: "Calm fantasy adventure",
    description:
      "A gentle fantasy tale under moonlight, with soft adventure, kind characters, and a dreamy ending that keeps the mood light.",
    narrator: "Nimsy Audio",
    duration: "10 min",
    progress: 90,

    audio:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",

    thumbnail:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },

  {
    id: "5",
    title: "Rainy Evening",
    subtitle: "Peaceful rain sound journey",
    description:
      "A cozy evening story shaped around rain, warm lights, and quiet thoughts. A simple listen for rest, focus, or calm background time.",
    narrator: "Nimsy Audio",
    duration: "8 min",
    progress: 60,

    audio:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",

    thumbnail:
      "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0",
  },
];

export type AudioStory = (typeof DUMMY_AUDIO_STORIES)[number];

export const getAudioStoryById = (id?: string) =>
  DUMMY_AUDIO_STORIES.find((story) => story.id === id);
