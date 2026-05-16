export type StoryBody = {
  intro: string;
  content: string[];
  moral: string;
};

export type CategoryStory = {
  id: string;
  title: string;
  slug: string;
  author: string;
  duration: string;
  ageGroup: string;
  language: string;
  thumbnail: string;
  videoUrl: string;
  audioUrl: string;
  tags: string[];
  likes: number;
  views: number;
  featured: boolean;
  createdAt: string;
  story: StoryBody;
};

export type StoryCategory = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  stories: CategoryStory[];
};

export type RecommendedStory = {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
};

export type Story = CategoryStory & {
  categoryId: string;
  categoryTitle: string;
};

type StoryData = {
  app: string;
  version: string;
  categories: StoryCategory[];
  recommendedStories: RecommendedStory[];
};

const STORY_DATA: StoryData = {
  app: "Nimsy",
  version: "1.0.0",
  categories: [
    {
      id: "moral-stories",
      title: "Moral Stories",
      description: "Short inspiring stories with life lessons for kids.",
      thumbnail: "https://images.unsplash.com/photo-1516627145497-ae6968895b74",
      stories: [
        {
          id: "honest-woodcutter",
          title: "The Honest Woodcutter",
          slug: "the-honest-woodcutter",
          author: "Aesop",
          duration: "4 min",
          ageGroup: "5-10",
          language: "English",
          thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          tags: ["honesty", "kindness", "kids"],
          likes: 1890,
          views: 25400,
          featured: true,
          createdAt: "2026-05-10T10:30:00Z",
          story: {
            intro: "A poor woodcutter accidentally drops his axe into a river.",
            content: [
              "One day, a poor woodcutter was cutting wood near a river.",
              "Suddenly, his axe slipped from his hand and fell into the water.",
              "The woodcutter sat near the river and started crying because it was his only axe.",
              "A river goddess appeared and asked him why he was sad.",
              "She brought out a golden axe and asked if it was his.",
              "The woodcutter honestly said no.",
              "Then she showed a silver axe, but again he refused.",
              "Finally, she showed his old iron axe, and the woodcutter happily accepted it.",
              "The goddess was impressed by his honesty and rewarded him with all three axes.",
            ],
            moral: "Honesty is always rewarded.",
          },
        },
        {
          id: "lion-and-mouse",
          title: "The Lion and the Mouse",
          slug: "the-lion-and-the-mouse",
          author: "Aesop",
          duration: "3 min",
          ageGroup: "4-9",
          language: "English",
          thumbnail: "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
          videoUrl: "https://www.w3schools.com/html/movie.mp4",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
          tags: ["friendship", "help", "animals"],
          likes: 2200,
          views: 31200,
          featured: false,
          createdAt: "2026-05-11T08:00:00Z",
          story: {
            intro: "A tiny mouse teaches a lion the value of kindness.",
            content: [
              "A lion was sleeping peacefully in the jungle.",
              "A little mouse accidentally ran across his body.",
              "The angry lion caught the mouse in his huge paw.",
              "The mouse begged for mercy and promised to help someday.",
              "The lion laughed but decided to let him go.",
              "A few days later, the lion got trapped in a hunter's net.",
              "Hearing the lion roar, the mouse rushed to help.",
              "The mouse gnawed the ropes with his tiny teeth and freed the lion.",
              "The lion realized that even the smallest friend can be helpful.",
            ],
            moral: "Kindness is never wasted.",
          },
        },
      ],
    },
    {
      id: "bedtime-stories",
      title: "Bedtime Stories",
      description: "Calming bedtime stories for peaceful sleep.",
      thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
      stories: [
        {
          id: "moon-rabbit",
          title: "The Moon Rabbit",
          slug: "the-moon-rabbit",
          author: "Japanese Folktale",
          duration: "5 min",
          ageGroup: "5-12",
          language: "English",
          thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
          tags: ["bedtime", "moon", "peaceful"],
          likes: 1300,
          views: 15800,
          featured: true,
          createdAt: "2026-05-09T07:00:00Z",
          story: {
            intro: "A magical rabbit lives on the moon and helps travelers.",
            content: [
              "Long ago, a kind rabbit lived in a peaceful forest.",
              "The rabbit always helped hungry animals and tired travelers.",
              "One evening, an old man visited the forest asking for food.",
              "The rabbit had nothing to offer except himself.",
              "Touched by his kindness, the old man revealed himself as a god.",
              "The god placed the rabbit on the moon so the world would remember his kindness forever.",
            ],
            moral: "True kindness shines forever.",
          },
        },
      ],
    },
    {
      id: "animal-stories",
      title: "Animal Stories",
      description: "Fun and educational animal adventures.",
      thumbnail: "https://images.unsplash.com/photo-1474511320723-9a56873867b5",
      stories: [
        {
          id: "clever-crow",
          title: "The Clever Crow",
          slug: "the-clever-crow",
          author: "Indian Folktale",
          duration: "2 min",
          ageGroup: "3-8",
          language: "English",
          thumbnail: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
          videoUrl: "https://www.w3schools.com/html/movie.mp4",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
          tags: ["crow", "smart", "learning"],
          likes: 3100,
          views: 44200,
          featured: true,
          createdAt: "2026-05-12T06:00:00Z",
          story: {
            intro: "A thirsty crow finds a smart way to drink water.",
            content: [
              "One hot summer day, a thirsty crow searched everywhere for water.",
              "After flying for a long time, he found a pot with very little water.",
              "The crow could not reach the water with his beak.",
              "He looked around and saw small stones nearby.",
              "The clever crow dropped stones into the pot one by one.",
              "Slowly, the water level rose high enough for him to drink.",
              "The crow happily drank the water and flew away.",
            ],
            moral: "Where there is a will, there is a way.",
          },
        },
      ],
    },
    {
      id: "adventure-stories",
      title: "Adventure Stories",
      description: "Exciting adventures and journeys.",
      thumbnail: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
      stories: [
        {
          id: "hidden-treasure",
          title: "The Hidden Treasure",
          slug: "the-hidden-treasure",
          author: "Classic Tale",
          duration: "6 min",
          ageGroup: "7-14",
          language: "English",
          thumbnail: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
          tags: ["adventure", "treasure", "journey"],
          likes: 4120,
          views: 58200,
          featured: true,
          createdAt: "2026-05-13T10:00:00Z",
          story: {
            intro: "Three friends search for a mysterious treasure map.",
            content: [
              "Three best friends discovered an old map inside a dusty library book.",
              "The map pointed toward a hidden cave deep in the forest.",
              "They crossed rivers, climbed hills, and solved riddles together.",
              "Inside the cave, they found not gold but ancient books and knowledge.",
              "The children learned that knowledge is the greatest treasure.",
            ],
            moral: "Knowledge is more valuable than gold.",
          },
        },
      ],
    },
  ],
  recommendedStories: [
    {
      id: "story-01",
      title: "The Golden Egg",
      category: "Moral Stories",
      thumbnail: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
      duration: "3 min",
      views: 15400,
      likes: 1100,
    },
    {
      id: "story-02",
      title: "The Brave Little Fox",
      category: "Animal Stories",
      thumbnail: "https://images.unsplash.com/photo-1516934024742-b461fba47600",
      duration: "4 min",
      views: 12100,
      likes: 980,
    },
    {
      id: "story-03",
      title: "Magic Forest Adventure",
      category: "Adventure Stories",
      thumbnail: "https://images.unsplash.com/photo-1448375240586-882707db888b",
      duration: "7 min",
      views: 19300,
      likes: 1600,
    },
    {
      id: "story-04",
      title: "The Sleepy Moon",
      category: "Bedtime Stories",
      thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      duration: "5 min",
      views: 14300,
      likes: 1200,
    },
    {
      id: "story-05",
      title: "The Talking Tree",
      category: "Fantasy Stories",
      thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      duration: "6 min",
      views: 20100,
      likes: 1800,
    },
    {
      id: "story-06",
      title: "Rabbit and Turtle Race",
      category: "Moral Stories",
      thumbnail: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
      duration: "2 min",
      views: 25100,
      likes: 2300,
    },
    {
      id: "story-07",
      title: "The Star Boy",
      category: "Fantasy Stories",
      thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      duration: "5 min",
      views: 16700,
      likes: 1300,
    },
    {
      id: "story-08",
      title: "The Helpful Elephant",
      category: "Animal Stories",
      thumbnail: "https://images.unsplash.com/photo-1517849845537-4d257902454a",
      duration: "4 min",
      views: 18700,
      likes: 1700,
    },
    {
      id: "story-09",
      title: "Princess of the Lake",
      category: "Fantasy Stories",
      thumbnail: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      duration: "8 min",
      views: 21100,
      likes: 2000,
    },
    {
      id: "story-10",
      title: "The Tiny Firefly",
      category: "Bedtime Stories",
      thumbnail: "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
      duration: "3 min",
      views: 9800,
      likes: 760,
    },
    {
      id: "story-11",
      title: "Captain Leo's Ship",
      category: "Adventure Stories",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      duration: "7 min",
      views: 27500,
      likes: 2400,
    },
    {
      id: "story-12",
      title: "The Kind Prince",
      category: "Moral Stories",
      thumbnail: "https://images.unsplash.com/photo-1511988617509-a57c8a288659",
      duration: "5 min",
      views: 17800,
      likes: 1490,
    },
    {
      id: "story-13",
      title: "Jungle Drum Mystery",
      category: "Adventure Stories",
      thumbnail: "https://images.unsplash.com/photo-1448375240586-882707db888b",
      duration: "6 min",
      views: 19400,
      likes: 1650,
    },
    {
      id: "story-14",
      title: "The Friendly Dolphin",
      category: "Animal Stories",
      thumbnail: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
      duration: "4 min",
      views: 22300,
      likes: 2100,
    },
    {
      id: "story-15",
      title: "The Lost Robot",
      category: "Sci-Fi Stories",
      thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
      duration: "9 min",
      views: 30200,
      likes: 2900,
    },
    {
      id: "story-16",
      title: "Grandma's Lantern",
      category: "Bedtime Stories",
      thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
      duration: "5 min",
      views: 14600,
      likes: 1220,
    },
    {
      id: "story-17",
      title: "The Flying Bicycle",
      category: "Fantasy Stories",
      thumbnail: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
      duration: "6 min",
      views: 25500,
      likes: 2250,
    },
    {
      id: "story-18",
      title: "The Snow Mountain",
      category: "Adventure Stories",
      thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      duration: "8 min",
      views: 18900,
      likes: 1560,
    },
    {
      id: "story-19",
      title: "The Smart Sparrow",
      category: "Animal Stories",
      thumbnail: "https://images.unsplash.com/photo-1444464666168-49d633b86797",
      duration: "3 min",
      views: 17200,
      likes: 1420,
    },
    {
      id: "story-20",
      title: "Galaxy Kids",
      category: "Sci-Fi Stories",
      thumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
      duration: "10 min",
      views: 33100,
      likes: 3010,
    },
    {
      id: "story-21",
      title: "The Magic Paint Brush",
      category: "Fantasy Stories",
      thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
      duration: "5 min",
      views: 21500,
      likes: 1810,
    },
    {
      id: "story-22",
      title: "The Forest King",
      category: "Animal Stories",
      thumbnail: "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
      duration: "4 min",
      views: 26000,
      likes: 2330,
    },
    {
      id: "story-23",
      title: "The Night Train",
      category: "Adventure Stories",
      thumbnail: "https://images.unsplash.com/photo-1474487548417-781cb71495f3",
      duration: "7 min",
      views: 24000,
      likes: 1980,
    },
    {
      id: "story-24",
      title: "The Little Wizard",
      category: "Fantasy Stories",
      thumbnail: "https://images.unsplash.com/photo-1511988617509-a57c8a288659",
      duration: "6 min",
      views: 21900,
      likes: 1900,
    },
    {
      id: "story-25",
      title: "The Polar Bear Cub",
      category: "Animal Stories",
      thumbnail: "https://images.unsplash.com/photo-1474511320723-9a56873867b5",
      duration: "4 min",
      views: 18600,
      likes: 1540,
    },
    {
      id: "story-26",
      title: "The Sleeping Castle",
      category: "Bedtime Stories",
      thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
      duration: "5 min",
      views: 14400,
      likes: 1120,
    },
    {
      id: "story-27",
      title: "The Ocean Secret",
      category: "Adventure Stories",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      duration: "9 min",
      views: 31000,
      likes: 2800,
    },
    {
      id: "story-28",
      title: "The Time Machine Kid",
      category: "Sci-Fi Stories",
      thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
      duration: "11 min",
      views: 35800,
      likes: 3300,
    },
    {
      id: "story-29",
      title: "The Rainbow Bird",
      category: "Fantasy Stories",
      thumbnail: "https://images.unsplash.com/photo-1444464666168-49d633b86797",
      duration: "5 min",
      views: 20300,
      likes: 1740,
    },
    {
      id: "story-30",
      title: "The Desert Explorer",
      category: "Adventure Stories",
      thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      duration: "8 min",
      views: 27600,
      likes: 2410,
    },
  ],
};

export const appName = STORY_DATA.app;
export const version = STORY_DATA.version;
export const categories = STORY_DATA.categories;
export const recommendedStories = STORY_DATA.recommendedStories;

export const stories: Story[] = categories.flatMap((category) =>
  category.stories.map((story) => ({
    ...story,
    categoryId: category.id,
    categoryTitle: category.title,
  }))
);

export const getCategoryById = (id?: string) =>
  categories.find((category) => category.id === id);

export const getStoryById = (id?: string) =>
  stories.find((story) => story.id === id);

export const getStoriesByCategory = (categoryId?: string) =>
  stories.filter((story) => story.categoryId === categoryId);

export const getRelatedStories = (
  storyId?: string,
  categoryId?: string
) =>
  stories.filter(
    (story) =>
      story.id !== storyId &&
      (!categoryId || story.categoryId === categoryId)
  );
