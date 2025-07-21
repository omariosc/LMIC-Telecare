"use client";

import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  HeartIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

type Language = "en" | "ar";

export default function DonationSuccess() {
  const [copied, setCopied] = useState(false);
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

  const handleShare = async () => {
    const shareUrl = "https://jusur.org.uk";
    const shareText = t(
      "donationSuccess.shareText",
      "I just donated to Jusur (جسور) - a platform connecting UK medical specialists with Gaza clinicians. Join me in supporting this vital healthcare bridge: "
    );

    try {
      await navigator.clipboard.writeText(shareText + shareUrl);
      setCopied(true);

      // Reset after 3 seconds
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareText + shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div
        className={`max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center ${
          currentLanguage === "ar" ? "text-right" : "text-left"
        }`}
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      >
        <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-6" />

        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          {t("donationSuccess.title", "Thank You for Your Donation!")}
          <br />
          {t("donationSuccess.subtitle", "جزاك الله خيراً")}
        </h1>

        <p className="text-gray-600 mb-6 text-center">
          {t(
            "donationSuccess.description",
            "Your generous contribution will help fund critical medical equipment and support our platform development to serve the people of Gaza."
          )}
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-green-800">
            <HeartIcon className="h-5 w-5" />
            <span className="font-semibold">
              {t("donationSuccess.impactTitle", "Your impact matters")}
            </span>
          </div>
          <p className="text-green-700 text-sm mt-2 text-center">
            {t(
              "donationSuccess.impactDesc",
              "Every dollar helps bridge the healthcare gap and saves lives in Gaza."
            )}
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-6 text-center">
          {t(
            "donationSuccess.receiptNote",
            "You will receive a confirmation email shortly with your donation receipt."
          )}
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-full font-bold hover:bg-blue-700 transition-colors inline-block text-center"
          >
            {t("donationSuccess.returnHome", "Return to Home")}
          </Link>

          <button
            onClick={handleShare}
            className={`w-full py-3 px-6 rounded-full font-bold transition-colors inline-flex items-center justify-center gap-2 ${
              copied
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
            }`}
          >
            <LinkIcon className="h-4 w-4" />
            {copied
              ? t("donationSuccess.linkCopied", "Link Copied!")
              : t("donationSuccess.shareCause", "Share This Cause")}
          </button>
        </div>
      </div>
    </div>
  );
}
