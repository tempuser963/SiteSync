import React, { useState, useEffect, useCallback } from 'react';
import { Theme, ResolvedTheme } from './tokens';
import {
  ThemeContext,
  FontScale,
  FONT_SCALE_MIN,
  FONT_SCALE_MAX,
  FONT_SCALE_STEP,
} from '../context/ThemeContext';

const STORAGE_KEY = 'karyasetu_theme';
const FONT_STORAGE_KEY = 'karyasetu_font_scale';

const migrateStorageKey = (legacyKey: string, currentKey: string) => {
  try {
    const legacyValue = localStorage.getItem(legacyKey);
    if (localStorage.getItem(currentKey) === null && legacyValue !== null) {
      localStorage.setItem(currentKey, legacyValue);
    }
    if (legacyValue !== null) localStorage.removeItem(legacyKey);
  } catch {
    // Ignore unavailable browser storage.
  }
};

const clampFontScale = (value: number): FontScale =>
  Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, value));

const isStoredFontScale = (value: string | null): value is string =>
  value !== null && !Number.isNaN(Number(value));

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
}) => {
  migrateStorageKey('sitesync_theme', STORAGE_KEY);
  migrateStorageKey('sitesync_font_scale', FONT_STORAGE_KEY);

  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored;
      }
    } catch (e) {
      // localStorage error fallback
    }
    return defaultTheme;
  });

  const [fontScale, setFontScaleState] = useState<FontScale>(() => {
    try {
      const stored = localStorage.getItem(FONT_STORAGE_KEY);
      if (isStoredFontScale(stored)) return clampFontScale(Number(stored));
    } catch (e) {
      // localStorage error fallback
    }
    return 100;
  });

  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  // Listen for OS system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? systemTheme : theme;

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  }, [resolvedTheme]);

  // Apply overall text size to the root element (all rem-based Tailwind utilities scale with it)
  useEffect(() => {
    const root = document.documentElement;
    if (fontScale === 100) {
      root.style.removeProperty('font-size');
    } else {
      root.style.fontSize = `${fontScale}%`;
    }
  }, [fontScale]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        // ignore
      }
      return next;
    });
  }, []);

  const setFontScale = useCallback((scale: FontScale) => {
    const clamped = clampFontScale(scale);
    setFontScaleState(clamped);
    try {
      localStorage.setItem(FONT_STORAGE_KEY, String(clamped));
    } catch (e) {
      // ignore
    }
  }, []);

  const decreaseFont = useCallback(() => {
    setFontScaleState((prev) => {
      const next = clampFontScale(prev - FONT_SCALE_STEP);
      try {
        localStorage.setItem(FONT_STORAGE_KEY, String(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  }, []);

  const increaseFont = useCallback(() => {
    setFontScaleState((prev) => {
      const next = clampFontScale(prev + FONT_SCALE_STEP);
      try {
        localStorage.setItem(FONT_STORAGE_KEY, String(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  }, []);

  const resetFont = useCallback(() => {
    setFontScale(100);
  }, [setFontScale]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        fontScale,
        setFontScale,
        decreaseFont,
        increaseFont,
        resetFont,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
