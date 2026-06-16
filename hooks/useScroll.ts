/**
 * Youtube style scroll header animation
 */

import {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function useScroll() {
  const headerTranslateY = useSharedValue(0);
  const pillsTranslateY = useSharedValue(60);

  const lastScrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;

      const isScrollingDown =
        currentY > lastScrollY.value;

      if (
        isScrollingDown &&
        currentY > 150
      ) {
        headerTranslateY.value =
          withTiming(-60);

        pillsTranslateY.value =
          withTiming(0);
      } else {
        headerTranslateY.value =
          withTiming(0);

        pillsTranslateY.value =
          withTiming(60);
      }

      lastScrollY.value = currentY;
    },
  });

  return {
    onScroll,
    headerTranslateY,
    pillsTranslateY,
  };
}