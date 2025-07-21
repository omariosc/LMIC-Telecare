"use client";

import { useEffect } from "react";
import { useTheme } from "../hooks/useTheme";

type ClientThemeProviderProps = {
  children: React.ReactNode;
};

export default function ClientThemeProvider({
  children,
}: ClientThemeProviderProps) {
  // Initialize theme system
  useTheme();

  // Apply theme to HTML element for proper CSS cascade
  useEffect(() => {
    // Detect initial theme preference
    const detectDarkMode = () => {
      if (typeof window === "undefined") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    };

    // Get stored theme or use system preference
    const storedTheme = localStorage.getItem("jusur-theme");
    const shouldUseDark =
      storedTheme === "dark" || (storedTheme !== "light" && detectDarkMode());

    // Apply theme class to HTML element
    const root = document.documentElement;
    if (shouldUseDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, []);

  return <>{children}</>;
}
