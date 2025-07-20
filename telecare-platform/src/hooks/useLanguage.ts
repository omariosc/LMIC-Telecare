"use client";

import { useEffect, useState } from "react";

export type Language = "en" | "ar";
export type Direction = "ltr" | "rtl";

type LanguageState = {
  language: Language;
  direction: Direction;
};

type UseLanguageReturn = {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void; // eslint-disable-line no-unused-vars
  toggleLanguage: () => void;
};

const STORAGE_KEY = "jusur-language";
const DEFAULT_LANGUAGE: Language = "en";

// Detect language from browser/location
const detectLanguage = (): Language => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY) as Language;
  if (stored && (stored === "en" || stored === "ar")) {
    return stored;
  }

  // Check browser language
  const browserLang = navigator.language.toLowerCase();

  // Arabic language detection
  if (
    browserLang.startsWith("ar") ||
    browserLang.includes("arabic") ||
    browserLang.includes("عربي")
  ) {
    return "ar";
  }

  // Check for Middle Eastern/Arabic regions
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const arabicTimeZones = [
      "Asia/Baghdad",
      "Asia/Kuwait",
      "Asia/Riyadh",
      "Asia/Qatar",
      "Asia/Dubai",
      "Asia/Beirut",
      "Asia/Damascus",
      "Africa/Cairo",
      "Asia/Jerusalem",
      "Asia/Gaza",
      "Asia/Hebron",
    ];

    if (arabicTimeZones.includes(timeZone)) {
      return "ar";
    }
  } catch (error) {
    console.warn("Could not detect timezone for language detection:", error);
  }

  return DEFAULT_LANGUAGE;
};

export const useLanguage = (): UseLanguageReturn => {
  // Detect language immediately during initialization
  const [state, setState] = useState<LanguageState>(() => {
    const detectedLang = detectLanguage();
    const direction: Direction = detectedLang === "ar" ? "rtl" : "ltr";

    return {
      language: detectedLang,
      direction,
    };
  });

  // Apply detected language to document on mount
  useEffect(() => {
    // Apply to document
    document.documentElement.lang = state.language;
    document.documentElement.dir = state.direction;

    // Store in localStorage
    localStorage.setItem(STORAGE_KEY, state.language);

    // Update content visibility immediately
    updateContentVisibility(state.language);
  }, [state.language, state.direction]);

  const setLanguage = (lang: Language) => {
    const direction: Direction = lang === "ar" ? "rtl" : "ltr";

    setState((prev) => ({
      ...prev,
      language: lang,
      direction,
    }));

    // Apply to document
    document.documentElement.lang = lang;
    document.documentElement.dir = direction;

    // Store in localStorage
    localStorage.setItem(STORAGE_KEY, lang);

    // Update existing content visibility
    updateContentVisibility(lang);
    
    // Dispatch custom event for components that need to know about language changes
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { language: lang } }));
  };

  const toggleLanguage = () => {
    const newLang: Language = state.language === "en" ? "ar" : "en";
    setLanguage(newLang);
  };

  return {
    language: state.language,
    direction: state.direction,
    setLanguage,
    toggleLanguage,
  };
};

// Update content visibility based on language
const updateContentVisibility = (language: Language) => {
  if (typeof window === "undefined") return;

  // Hide all language-specific content first
  const allLangElements = document.querySelectorAll(
    "[data-lang-en], [data-lang-ar]"
  );
  allLangElements.forEach((el) => {
    (el as HTMLElement).classList.add("hidden");
  });

  // Show content for the selected language
  const currentLangElements = document.querySelectorAll(
    `[data-lang-${language}]`
  );
  currentLangElements.forEach((el) => {
    (el as HTMLElement).classList.remove("hidden");
  });
};
