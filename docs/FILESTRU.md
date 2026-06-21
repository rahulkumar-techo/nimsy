# Nimsy Client — Proposed File Structure

## The core problem

You have **two architectures fighting each other**:
1. Layer-based (root-level `screens/`, `services/`, `store/`, `types/`, `validations/`, `utils/`)
2. Feature-based (`features/feed/`, `features/upload/`)

Because the migration to feature-based was never finished, every new feature gets split across both, and state management ends up using three different mechanisms (Redux in `store/`, Redux *again* in `features/upload/redux`, and React Context in `context/`) with no rule for which one to use when.

**The fix: go all-in on feature-based. One feature = one folder = everything that feature owns.**

---

## Proposed structure

```
nimsy-client/
│
├── app/                                # Expo Router routes only
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   └── _layout.tsx
│   │
│   ├── (tabs)/
│   │   ├── home.tsx
│   │   ├── explore.tsx
│   │   ├── library.tsx
│   │   ├── create.tsx
│   │   ├── profile.tsx
│   │   └── _layout.tsx
│   │
│   ├── (player)/
│   ├── (videos)/
│   ├── (create)/
│   ├── onboarding.tsx
│   ├── search.tsx
│   └── _layout.tsx
│
├── features/
│
│   ├── auth/
│   │   ├── components/
│   │   │   ├── AuthHeader.tsx
│   │   │   ├── AuthFooter.tsx
│   │   │   ├── AuthInput.tsx
│   │   │   ├── PasswordInput.tsx
│   │   │   ├── OTPInput.tsx
│   │   │   └── SocialButton.tsx
│   │   │
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   ├── ResetPasswordScreen.tsx
│   │   │   └── VerifyOTPScreen.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useLogin.ts
│   │   │   ├── useRegister.ts
│   │   │   └── useAuth.ts
│   │   │
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   │
│   │   ├── store/
│   │   │   ├── auth.slice.ts
│   │   │   ├── auth.thunk.ts
│   │   │   └── auth.selectors.ts
│   │   │
│   │   ├── types/
│   │   │   ├── auth.types.ts
│   │   │   └── auth.dto.ts
│   │   │
│   │   ├── validations/
│   │   │   ├── login.schema.ts
│   │   │   └── register.schema.ts
│   │   │
│   │   └── constants/
│   │       └── auth.constants.ts
│
│   ├── video/
│   │   ├── components/
│   │   │   ├── VideoCard.tsx
│   │   │   ├── VideoList.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   ├── VideoActions.tsx
│   │   │   └── VideoComments.tsx
│   │   │
│   │   ├── screens/
│   │   │   ├── VideoScreen.tsx
│   │   │   ├── VideoPlayerScreen.tsx
│   │   │   └── WatchHistoryScreen.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useVideo.ts
│   │   │   └── useVideoPlayer.ts
│   │   │
│   │   ├── services/
│   │   │   └── video.service.ts
│   │   │
│   │   ├── store/
│   │   │   ├── video.slice.ts
│   │   │   ├── video.thunk.ts
│   │   │   └── video.selectors.ts
│   │   │
│   │   ├── types/
│   │   │   ├── video.types.ts
│   │   │   └── video.dto.ts
│   │   │
│   │   └── utils/
│   │       └── video-navigation.util.ts
│
│   ├── upload/
│   │   ├── components/
│   │   │   ├── UploadForm.tsx
│   │   │   ├── UploadProgress.tsx
│   │   │   ├── UploadThumbnail.tsx
│   │   │   ├── UploadChapters.tsx
│   │   │   ├── UploadVisibility.tsx
│   │   │   └── UploadProcessing.tsx
│   │   │
│   │   ├── screens/
│   │   │   ├── UploadVideoScreen.tsx
│   │   │   ├── EditVideoScreen.tsx
│   │   │   └── UploadedVideosScreen.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useUploadForm.ts
│   │   │   ├── useThumbnailPicker.ts
│   │   │   └── useVideoPicker.ts
│   │   │
│   │   ├── services/
│   │   │   ├── upload.service.ts
│   │   │   ├── upload-polling.service.ts
│   │   │   └── video-upload.service.ts
│   │   │
│   │   ├── store/
│   │   │   ├── upload.slice.ts
│   │   │   ├── upload.thunk.ts
│   │   │   ├── upload.selectors.ts
│   │   │   └── upload.types.ts
│   │   │
│   │   ├── validations/
│   │   │   ├── upload.schema.ts
│   │   │   └── chapter.schema.ts
│   │   │
│   │   ├── types/
│   │   │   ├── upload.types.ts
│   │   │   ├── upload.dto.ts
│   │   │   └── chapter.types.ts
│   │   │
│   │   └── utils/
│   │       ├── video-file.util.ts
│   │       ├── upload-progress.util.ts
│   │       └── upload-format.util.ts
│
│   ├── feed/
│   ├── comments/
│   ├── playlist/
│   ├── subscriptions/
│   ├── notifications/
│   ├── search/
│   ├── library/
│   ├── profile/
│   ├── dashboard/
│   └── parental-controls/
│
├── shared/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── IconButton.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Loader/
│   │   ├── EmptyState/
│   │   └── Header/
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── usePagination.ts
│   │   └── useTheme.ts
│   │
│   ├── services/
│   │   ├── api.service.ts
│   │   ├── storage.service.ts
│   │   └── network.service.ts
│   │
│   ├── constants/
│   │   ├── routes.ts
│   │   ├── themes.ts
│   │   └── env.ts
│   │
│   ├── utils/
│   │   ├── date.util.ts
│   │   ├── file.util.ts
│   │   ├── string.util.ts
│   │   └── validation.util.ts
│   │
│   └── context/
│       └── ThemeContext.tsx
│
├── store/
│   ├── store.ts
│   ├── rootReducer.ts
│   └── middleware.ts
│
├── providers/
│   ├── ReduxProvider.tsx
│   ├── ThemeProvider.tsx
│   └── QueryProvider.tsx
│
├── config/
│   ├── env.ts
│   ├── query-client.ts
│   └── app.config.ts
│
├── navigation/
│   ├── guards/
│   │   ├── AuthGuard.tsx
│   │   └── GuestGuard.tsx
│   │
│   └── deep-links/
│       └── linking.ts
│
├── assets/
├── docs/
├── tests/
├── package.json
└── tsconfig.json

```

This kills the `app/` vs `screens/` duplication entirely — `screens/` content moves into each feature's `screens/` folder, and `app/` just points to it.

### 3. Merge duplicate components before moving anything
You have two `VideoCard.tsx` (`components/cards/` and `components/video/`) and two `UploadProgressCircle.tsx` (`components/` and `components/loader/`). Diff them first, keep the better one, delete the other, fix imports — otherwise you'll just duplicate the duplication into the new structure.

### 4. Migrate one feature at a time, starting with `auth`
It's the most self-contained (clear service, clear validation, clear screens). Do it end-to-end, confirm the app still builds, then move to `upload` (already half feature-based), then `video`/`feed`, then the rest. Don't try to do all of `features/` in one pass.

---

## Suggested path alias
Add to `tsconfig.json` to avoid relative-path hell once things move into `src/`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```