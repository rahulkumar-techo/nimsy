/**
 * Profile Item Types
 */

import { Href } from "expo-router";

export type ProfileItemType =
  | "playlist"
  | "downloads"
  | "course"
  | "analytics"
  | "certificate"
  | "movie";

export interface ProfileItem {
  id: string;

  title: string;

  subtitle: string;

  icon: string;

  count: string;

  thumbnail: string;

  type: ProfileItemType;

  link: Href;
}


export const PROFILE_DATA: ProfileItem[] = [
  {
    id: "favorites",

    title: "My Favorites",

    subtitle:
      "Saved movies, playlists and courses",

    icon: "heart-outline",

    count: "24 Items",

    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200",

    type: "playlist",

    link: {
      pathname: "favorites/[id]",

      params: {
        id: "favorites-playlist",
      },
    },
  },

  {
    id: "downloads",

    title: "Downloads",

    subtitle:
      "Offline downloaded content",

    icon: "download-outline",

    count: "12 Videos",

    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200",

    type: "downloads",

    link: {
      pathname: "/downloads/[id]",

      params: {
        id: "offline-content",
      },
    },
  },

  {
    id: "recent",

    title: "Recent Viewed",

    subtitle:
      "Continue where you stopped",

    icon: "time-outline",

    count: "18 Lessons",

    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200",

    type: "course",

    link: {
      pathname: "/courses/[id]",

      params: {
        id: "react-native-masterclass",
      },
    },
  },

  {
    id: "progress",

    title: "Learning Progress",

    subtitle:
      "Track your learning analytics",

    icon: "analytics-outline",

    count: "78%",

    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200",

    type: "analytics",

    link: {
      pathname: "/analytics/[id]",

      params: {
        id: "learning-progress",
      },
    },
  },

  {
    id: "certificates",

    title: "Certificates",

    subtitle:
      "Your earned achievements",

    icon: "ribbon-outline",

    count: "5 Earned",

    thumbnail:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200",

    type: "certificate",

    link: {
      pathname: "/certificates/[id]",

      params: {
        id: "frontend-certificates",
      },
    },
  },

  {
    id: "terminator4",

    title: "Terminator 4",

    subtitle:
      "Science fiction movie collection",

    icon: "film-outline",

    count: "4K UHD",

    thumbnail:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200",

    type: "movie",

    link: {
      pathname: "/movies/[id]",

      params: {
        id: "terminator-4",
      },
    },
  },
];