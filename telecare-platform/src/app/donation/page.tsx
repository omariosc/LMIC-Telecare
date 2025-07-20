"use client";

import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import DonationForm from "@/components/donation/DonationForm";
import { useState, useEffect } from "react";

type Language = "en" | "ar";

export default function DonationPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const stored = localStorage.getItem("jusur-language");
        const lang = stored === "ar" || stored === "en" ? stored : "en";
        setCurrentLanguage(lang);

        if (lang === "ar") {
          const arTranslations = await import("../../locales/ar.json");
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
    <div 
      className={`min-h-screen bg-gray-50 ${
        currentLanguage === "ar" ? "text-right" : "text-left"
      }`}
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="bg-green-950 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 text-white hover:text-green-600 transition-colors ${
              currentLanguage === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            <ArrowLeftIcon className="h-4 w-4" strokeWidth={3} />
            <strong>{t("donation.backToHome", "Back to Jusur (جسور)")}</strong>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("donation.supportTitle", "Support Jusur (جسور)")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("donation.supportSubtitle", "Your donation directly funds critical medical equipment, platform development, and infrastructure to connect UK specialists with Gaza clinicians.")}
          </p>
        </div>

        {/* Trust and Security Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <div className="bg-blue-100 border-blue-500 border p-6 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-3">
              {t("donation.transparencyTitle", "100% Transparency")}
            </h3>
            <p className="text-blue-800">
              {t("donation.transparencyDesc", "Every donation is tracked and reported. We will publish quarterly impact reports showing exactly how funds are used to support Gaza.")}
            </p>
          </div>

          <div className="bg-green-100 border-green-500 border p-6 rounded-lg">
            <h3 className="font-bold text-green-900 mb-3">
              {t("donation.securityTitle", "Secure & Trusted")}
            </h3>
            <p className="text-green-800">
              {t("donation.securityDesc", "We never store your payment information. All donations are processed in accordance with international humanitarian aid guidelines.")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Donation Form */}
          <div>
            <DonationForm />
          </div>

          {/* Impact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t("donation.yourImpact", "Your Impact")}
            </h2>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg text-green-600 mb-2">£25</h3>
                <p className="text-gray-600">
                  {t("donation.impact25", "Funds one emergency consultation session between a Gaza clinician and UK specialist")}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg text-green-600 mb-2">£100</h3>
                <p className="text-gray-600">
                  {t("donation.impact100", "Supports platform infrastructure for a week, enabling 24/7 connectivity")}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg text-green-600 mb-2">£500</h3>
                <p className="text-gray-600">
                  {t("donation.impact500", "Helps fund essential medical equipment through our verified aid partners (once we can get aid into Gaza إن شاء الله)")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
