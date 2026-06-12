# Nimsy

Nimsy is a kid-friendly storytelling and learning app built with Expo, React Native, and Expo Router. It combines onboarding, Google sign-in, a discovery-style home screen, category navigation, and a simple user profile flow into a clean mobile-first experience.

## Overview

The current app includes:

- Google sign-in for user authentication
- A 7-step onboarding flow stored per user with `AsyncStorage`
- A discovery home screen with featured content, categories, and continue-watching cards
- Category destination screens for `Stories`, `Videos`, `Audio`, and `Favorites`
- A user details screen with profile editing and logout
- Shared auth state with protected navigation behavior

## Tech Stack

| Layer | Tools |
| --- | --- |
| App framework | `Expo` |
| UI | `React Native`, `NativeWind` |
| Routing | `Expo Router` |
| Auth | `@react-native-google-signin/google-signin` |
| State | React Context |
| Local storage | `@react-native-async-storage/async-storage` |
| Language | `TypeScript` |

## Project Structure

```text
app/
  _layout.tsx
  index.tsx
  onboarding.tsx
  userdetails.tsx
  audio.tsx
  favorites.tsx
  stories.tsx
  videos.tsx
  (tabs)/
    _layout.tsx
    home.tsx

screens/
  home.tsx
  onboarding.tsx
  UserDetails.tsx
  CategoryDestinationScreen.tsx

components/
  UserAuth.tsx
  NavHeader.tsx
  details/
    UserProfileDetails.tsx
    UserSettingsSection.tsx
  home-comp/
    CategoriesChip.tsx
    CategoryCard.tsx
    CategorySection.tsx
    ContinueWatchingCard.tsx
    ContinueWatchingSection.tsx
    FeatureCard.tsx
    FeatureCarousel.tsx
    HomeSectionContainer.tsx

context/
  AuthContext.tsx
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create your local environment file

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_WEB_CLIENT_ID=your_google_web_client_id
```

Notes:

- Do not commit `.env`
- The project already ignores `.env` in `.gitignore`
- If you use Google sign-in on Android or iOS, make sure your OAuth client configuration also matches your native app setup

### 3. Start the app

```bash
npm run start
```

Then open it in:

- Expo Go
- Android emulator/device
- iOS simulator/device
- Web with `npm run web`

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run start` | Start the Expo dev server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm run web` | Run in the browser |
| `npm run lint` | Run ESLint |
| `npm run reset-project` | Run the local reset script |

## App Flow

### Authentication

- `app/index.tsx` checks auth state from `AuthContext`
- Signed-out users see the Google sign-in screen
- Signed-in users are redirected either to onboarding or the home tab

### Onboarding

- The onboarding flow contains 7 slides
- Completion is stored with `AsyncStorage` using the current user id
- After completion, users are redirected to `/(tabs)/home`

### Home

The home screen currently includes:

- Header with avatar and greeting
- Featured story carousel
- Quick category chips
- Top categories section
- Continue watching section

### Profile

The user details screen supports:

- Viewing the current avatar and email
- Editing display name
- Updating avatar using a URL or preset options
- Logging out from the current session

## Assets

The project includes local assets for:

- Branding and splash screens
- Onboarding illustrations
- Category artwork for the home screen

## Development Notes

- Styling is primarily done with `NativeWind` utility classes
- Navigation uses file-based routing from `Expo Router`
- Shared auth state lives in [`context/AuthContext.tsx`](context/AuthContext.tsx)
- Home screen UI lives in [`screens/home.tsx`](screens/home.tsx)
- Profile screen UI is split between [`screens/UserDetails.tsx`](screens/UserDetails.tsx) and the `components/details` folder

## Linting

Run:

```bash
npm run lint
```

There are currently a few non-blocking warnings in `components/home-comp/FeatureCarousel.tsx`, but the app changes themselves lint successfully.

## Future Improvements

- Connect home screen sections to real backend content
- Add real settings actions for notifications and privacy
- Add image picker support for avatar uploads
- Improve tests and CI coverage
- Add production-ready environment examples such as `.env.example`

## License

This project is private unless you choose to publish it under a separate license.
