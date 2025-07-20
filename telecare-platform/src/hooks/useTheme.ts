"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

type UseThemeReturn = {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "jusur-theme";
const DEFAULT_THEME: Theme = "system";

// Detect if user prefers dark mode
const detectDarkMode = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

// Apply theme to document
const applyTheme = (theme: Theme) => {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  
  // Remove existing theme classes
  root.classList.remove("dark", "light");

  if (theme === "system") {
    // Use system preference
    if (detectDarkMode()) {
      root.classList.add("dark");
    } else {
      root.classList.add("light");
    }
  } else {
    // Use explicit theme
    root.classList.add(theme);
  }
};

export const useTheme = (): UseThemeReturn => {
  // Initialize with default to avoid hydration mismatch
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [isDark, setIsDark] = useState(false);

  // Detect and set theme on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Get stored theme or use default
    const stored = localStorage.getItem(STORAGE_KEY) as Theme;
    const initialTheme = stored && ["light", "dark", "system"].includes(stored) ? stored : DEFAULT_THEME;
    
    setThemeState(initialTheme);
    
    // Calculate if dark mode should be active
    const shouldBeDark = initialTheme === "dark" || (initialTheme === "system" && detectDarkMode());
    setIsDark(shouldBeDark);
    
    // Apply theme to document
    applyTheme(initialTheme);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        const shouldBeDark = detectDarkMode();
        setIsDark(shouldBeDark);
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    
    // Calculate if dark mode should be active
    const shouldBeDark = newTheme === "dark" || (newTheme === "system" && detectDarkMode());
    setIsDark(shouldBeDark);
    
    // Store in localStorage
    localStorage.setItem(STORAGE_KEY, newTheme);
    
    // Apply to document
    applyTheme(newTheme);

    // Dispatch custom event for components that need to know about theme changes
    window.dispatchEvent(
      new CustomEvent("themeChanged", { detail: { theme: newTheme, isDark: shouldBeDark } })
    );
  };

  const toggleTheme = () => {
    if (theme === "system") {
      // From system, go to opposite of current system preference
      setTheme(isDark ? "light" : "dark");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  };
};