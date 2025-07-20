"use client";

import { useEffect, useState } from "react";

const DARK_MODE_COOKIE = "darkMode";

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Get cookie value
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  // Set cookie value
  const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === "undefined") return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  // Check system preference
  const getSystemPreference = (): boolean => {
    if (typeof window === "undefined") return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  useEffect(() => {
    // Priority: Cookie > System Preference > Default (false)
    const cookieValue = getCookie(DARK_MODE_COOKIE);
    let darkMode = false;

    if (cookieValue !== null) {
      // Cookie exists, use its value
      darkMode = cookieValue === "true";
    } else {
      // No cookie, check system preference
      darkMode = getSystemPreference();
    }

    setIsDarkMode(darkMode);
    setIsLoaded(true);

    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    setCookie(DARK_MODE_COOKIE, newDarkMode.toString());

    // Apply dark mode class to document
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const setDarkMode = (darkMode: boolean) => {
    setIsDarkMode(darkMode);
    setCookie(DARK_MODE_COOKIE, darkMode.toString());

    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return {
    isDarkMode,
    isLoaded,
    toggleDarkMode,
    setDarkMode,
  };
};