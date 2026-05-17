/**
 * Tab Bar Visibility Store
 */

import {
  create,
} from "zustand";

type State = {
  visible: boolean;

  show: () => void;
  hide: () => void;
};

export const useTabBar =
  create<State>((set) => ({
    visible: true,

    show: () =>
      set({
        visible: true,
      }),

    hide: () =>
      set({
        visible: false,
      }),
  }));