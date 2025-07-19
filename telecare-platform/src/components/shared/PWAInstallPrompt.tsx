"use client";

import { useState, useEffect } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;

    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show install prompt after user has been on the site for 30 seconds
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 30000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setIsInstalled(true);
      }

      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    } catch (error) {
      console.error("Error during PWA installation:", error);
    }
  };

  const dismissPrompt = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem("pwa-prompt-dismissed", "true");
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null;
  }

  // Don't show if user already dismissed it this session
  if (sessionStorage.getItem("pwa-prompt-dismissed")) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🏥</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Install Telecare Platform
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Access medical consultations instantly, even offline. Perfect for
              emergency situations.
            </p>

            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleInstallClick}
                className="btn-primary text-xs px-3 py-1.5"
              >
                Install App
              </button>
              <button
                onClick={dismissPrompt}
                className="text-xs px-3 py-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Not now
              </button>
            </div>
          </div>

          <button
            onClick={dismissPrompt}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <span className="sr-only">Close</span>✕
          </button>
        </div>
      </div>
    </div>
  );
}
