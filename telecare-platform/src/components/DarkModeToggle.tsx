"use client";

import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useDarkMode } from "@/hooks/useDarkMode";

export const DarkModeToggle = () => {
  const { isDarkMode, isLoaded, toggleDarkMode } = useDarkMode();

  // Don't render anything until dark mode preference is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:scale-105"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <SunIcon className="h-6 w-6 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
      ) : (
        <MoonIcon className="h-6 w-6 text-gray-700 group-hover:text-gray-600 transition-colors" />
      )}
    </button>
  );
};