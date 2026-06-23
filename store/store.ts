/**
 * Redux store configuration.
 */

import { configureStore } from "@reduxjs/toolkit";

import feedReducer from "@/features/home/store/feed.slice";
import uploadReducer from "@/features/upload/store/upload.slice";
import uploadApiReducer from "@/features/upload/store/uploadApi.slice";

export const store = configureStore({
  reducer: {
    upload: uploadReducer,
    uploadApi: uploadApiReducer,
    feed: feedReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
