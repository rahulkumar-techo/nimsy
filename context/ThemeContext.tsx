import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  defaultTheme,
  themes,
  type ThemeColors,
  type ThemeType,
} from "@/constants/themes";

const THEME_STORAGE_KEY = "nimsy:selected-theme";

type ThemeContextValue = {
  theme: ThemeType;
  colors: ThemeColors;
  isThemeReady: boolean;
  setTheme: (theme: ThemeType) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const isThemeType = (value: string | null): value is ThemeType =>
  value !== null && value in themes;

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>(defaultTheme);
  const [isThemeReady, setIsThemeReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (mounted && isThemeType(savedTheme)) {
          setThemeState(savedTheme);
        }
      } finally {
        if (mounted) {
          setIsThemeReady(true);
        }
      }
    };

    loadTheme();

    return () => {
      mounted = false;
    };
  }, []);

  const setTheme = useCallback(async (nextTheme: ThemeType) => {
    setThemeState(nextTheme);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      colors: themes[theme].colors,
      isThemeReady,
      setTheme,
    }),
    [isThemeReady, setTheme, theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
};

export type { ThemeColors, ThemeType };
