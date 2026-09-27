import { createContext, useContext } from 'react';
import { Theme, ResolvedTheme } from '../theme/tokens';

/**
 * Overall text-size preset, expressed as a percentage of the browser default
 * root font size (100 = normal). Clamped by the provider between
 * FONT_SCALE_MIN and FONT_SCALE_MAX in FONT_SCALE_STEP increments.
 */
export type FontScale = number;

export const FONT_SCALE_MIN = 50;
export const FONT_SCALE_MAX = 150;
export const FONT_SCALE_STEP = 10;

export interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
  decreaseFont: () => void;
  increaseFont: () => void;
  resetFont: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
