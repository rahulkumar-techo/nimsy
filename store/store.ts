/**
 * Redux store configuration.
 */

import { configureStore } from "@reduxjs/toolkit";

import feedReducer from "@/features/home/store/feed.slice";
import uploadReducer from "@/features/upload/store/upload.slice";


export const store = configureStore({
  reducer: {
    upload: uploadReducer,
    feed:feedReducer
  },
});

export type RootState = ReturnType< typeof store.getState>;

export type AppDispatch =typeof store.dispatch;
