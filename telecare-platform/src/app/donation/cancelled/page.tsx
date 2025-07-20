"use client";

import { useState, useEffect } from "react";
import { XCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type Language = "en" | "ar";

export default function DonationCancelled() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const stored = localStorage.getItem("jusur-language");
        const lang = stored === "ar" || stored === "en" ? stored : "en";
        setCurrentLanguage(lang);

        if (lang === "ar") {
          const arTranslations = await import("../../../locales/ar.json");
          setTranslations(arTranslations.default);
        }
      } catch (error) {
        console.error("Failed to load translations:", error);
      }
    };

    loadTranslations();

    // Listen for language changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "jusur-language") {
        loadTranslations();
      }
    };

    const handleLanguageChange = () => {
      loadTranslations();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("languageChanged", handleLanguageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  const t = (key: string, fallback: string) => {
    if (!translations) return fallback;
    const keys = key.split(".");
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || fallback;
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div 
        className={`max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center ${
          currentLanguage === "ar" ? "text-right" : "text-left"
        }`}
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      >
        <XCircleIcon className="h-16 w-16 text-orange-500 mx-auto mb-6" />

        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          {t("donationCancelled.title", "Donation Cancelled")}
        </h1>

        <p className="text-gray-600 mb-6 text-center">
          {t("donationCancelled.description", "Your donation was cancelled. No payment has been processed.")}
        </p>

        <p className="text-gray-500 text-sm mb-6 text-center">
          {t("donationCancelled.note", "We understand that donating is a personal decision. If you change your mind, you can always return to make a donation later.")}
        </p>

        <div className="space-y-3">
          <Link
            href="/donation"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-full font-bold hover:bg-green-700 transition-colors inline-block text-center"
          >
            {t("donationCancelled.tryAgain", "Try Again")}
          </Link>

          <Link
            href="/"
            className={`w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2 ${
              currentLanguage === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {t("donationCancelled.returnHome", "Return to Home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
