import { useCallback, useEffect, useMemo, useState } from 'react';
import { THEME, THEME_STORAGE_KEY } from '../constants/theme.js';
import { ThemeContext } from './themeContext.js';

function applyThemeClass(theme) {
  const root = document.documentElement;
  if (theme === THEME.DARK) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === THEME.DARK || stored === THEME.LIGHT) {
      return stored;
    }
  } catch {
    /* ignore */
  }
  return THEME.LIGHT;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme);

  useEffect(() => {
    applyThemeClass(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const setTheme = useCallback((next) => {
    setThemeState(next === THEME.DARK ? THEME.DARK : THEME.LIGHT);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === THEME.DARK ? THEME.LIGHT : THEME.DARK));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === THEME.DARK,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
