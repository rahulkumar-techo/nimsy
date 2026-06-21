/**
 * Redux store configuration.
 */

import { configureStore } from "@reduxjs/toolkit";

import uploadReducer from "@/features/upload/redux/upload.slice";
import feedReducer from "@/store/feed/feed.slice"


export const store = configureStore({
  reducer: {
    upload: uploadReducer,
    feed:feedReducer
  },
});

export type RootState = ReturnType< typeof store.getState>;

export type AppDispatch =typeof store.dispatch;