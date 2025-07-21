"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

type Language = "en" | "ar";

// Log the publishable key for debugging (first and last 4 chars)
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
console.log(
  "Using Stripe Publishable Key:",
  publishableKey.substring(0, 7) + "..." + publishableKey.slice(-4)
);

const stripePromise = loadStripe(publishableKey);

const DONATION_AMOUNTS = [25, 50, 100];

export default function DonationForm() {
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");

  // Load translations
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

  const handleDonate = async () => {
    try {
      setIsLoading(true);
      const donationAmount = isCustom ? parseFloat(customAmount) : amount;

      if (!donationAmount || donationAmount < 1) {
        alert(
          t(
            "donation.minAmount",
            "Please enter a valid donation amount (minimum £1)"
          )
        );
        return;
      }

      console.log("Making request to:", "/api/create-checkout-session");
      console.log("Request data:", { amount: donationAmount, currency: "usd" });

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: donationAmount,
          currency: "usd",
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        alert(`HTTP Error ${response.status}: ${errorText}`);
        return;
      }

      const responseData = await response.json();
      console.log("Response data:", responseData);

      const { sessionId, error } = responseData;

      if (error) {
        alert(`Error: £{error}`);
        return;
      }

      const stripe = await stripePromise;
      console.log("Stripe instance loaded:", !!stripe);
      console.log("Redirecting to checkout with sessionId:", sessionId);

      // Add a small delay to ensure session is fully created
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        console.error("Stripe redirect error:", stripeError);
        alert(`Stripe error: ${stripeError.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(t("donation.error", "An error occurred. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto ${
        currentLanguage === "ar" ? "text-right" : "text-left"
      }`}
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
    >
      <div className="text-center mb-6">
        <div className="h-12 w-12 mx-auto mb-4 relative">
          <Image
            src="/images/jusur-logo.png"
            alt="Jusur Logo"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {t("donation.formTitle", "Support Jusur (جسور)")}
        </h3>
        <p className="text-gray-600">
          {t(
            "donation.formDescription",
            "Your donation helps fund platform development"
          )}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("donation.chooseAmount", "Choose Amount (USD)")}
          </label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {DONATION_AMOUNTS.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setAmount(preset);
                  setIsCustom(false);
                  setCustomAmount("");
                }}
                className={`py-2 px-4 rounded-md border font-medium transition-colors ${
                  !isCustom && amount === preset
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-green-600 cursor-pointer"
                }`}
              >
                £{preset}
              </button>
            ))}
          </div>
        </div>

        <div>
          <button
            onClick={() => {
              setIsCustom(true);
              setCustomAmount(amount.toString());
            }}
            className={`w-full py-2 px-4 rounded-md border font-medium transition-colors ${
              isCustom
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-green-600 cursor-pointer"
            }`}
          >
            {t("donation.customAmount", "Custom Amount")}
          </button>
        </div>

        {isCustom && (
          <div>
            <label
              htmlFor="customAmount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("donation.enterAmount", "Enter Amount")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">£</span>
              </div>
              <input
                type="text"
                inputMode="decimal"
                id="customAmount"
                value={customAmount}
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow empty input
                  if (value === "") {
                    setCustomAmount("");
                    return;
                  }

                  // Check if the input is a valid number with max 2 decimal places
                  // Allows: 123, 123.4, 123.45, .45, but not 123.456
                  if (!/^(\d+\.?\d{0,2}|\.\d{1,2})$/.test(value)) {
                    return; // Don't update if it doesn't match the pattern
                  }

                  setCustomAmount(value);
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  if (value && !isNaN(parseFloat(value))) {
                    // Format to 2 decimal places on blur
                    const formatted = parseFloat(value).toFixed(2);
                    setCustomAmount(formatted);
                  }
                }}
                className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="0.00"
                min="1"
                step="0.01"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleDonate}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-full font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {t("donation.processing", "Processing...")}
            </>
          ) : (
            <>
              <div className="h-5 w-5 relative">
                <Image
                  src="/images/jusur-logo.png"
                  alt="Jusur Logo"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              </div>
              {t("donation.donateButton", "Donate")} £
              {isCustom ? customAmount || "0" : amount}
            </>
          )}
        </button>

        <div className="text-xs text-gray-500 text-center">
          {t("donation.securePayment", "Secure payment powered by Stripe.")}
        </div>
      </div>
    </div>
  );
}
