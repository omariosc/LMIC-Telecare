"use client";

import React, { useEffect, useState } from "react";
import NetworkStatus from "../shared/NetworkStatus";
import PWAInstallPrompt from "../shared/PWAInstallPrompt";

const SKIP_LINK_STYLES =
  "sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:border-2 focus:border-border focus:rounded-md";
const MAIN_CONTENT_ID = "main-content";
const PLATFORM_NAME = "Gaza Telecare";
const PLATFORM_TAGLINE = "Connecting UK Specialists with Gaza Clinicians";

type BaseLayoutProps = {
  children: React.ReactNode;
  direction?: "ltr" | "rtl";
  className?: string;
};

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  direction = "ltr",
  className = "",
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [notifications] = useState(3);

  useEffect(() => {
    // Set document direction for RTL support
    document.documentElement.dir = direction;
    document.documentElement.lang = direction === "rtl" ? "ar" : "en";

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [direction]);

  return (
    <>
      {/* Skip navigation link for accessibility */}
      <a href={`#${MAIN_CONTENT_ID}`} className={SKIP_LINK_STYLES}>
        Skip to main content
      </a>

      {/* PWA Status Components */}
      <div data-testid="network-status">
        <NetworkStatus />
      </div>
      <div data-testid="pwa-install-prompt">
        <PWAInstallPrompt />
      </div>

      <div
        data-testid="layout-container"
        className={`min-h-screen flex flex-col bg-gray-50 ${className}`}
      >
        {/* Professional Medical Header */}
        <header
          role="banner"
          className="medical-header h-16 flex items-center justify-between px-4 sticky top-0 z-40"
        >
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 text-lg">
                  {PLATFORM_NAME}
                </span>
                <span className="text-xs text-gray-600 hidden sm:block">
                  {PLATFORM_TAGLINE}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              className="btn btn-outline btn-sm gap-1"
              onClick={() => {
                // TODO: Implement translation toggle
              }}
              aria-label="Toggle language to Arabic"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
              <span className="text-xs">عربي</span>
            </button>

            {/* Online/Offline Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-xs text-gray-600 hidden sm:block">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
                  />
                </svg>
              </button>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>

            {/* User Avatar */}
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main
          id={MAIN_CONTENT_ID}
          role="main"
          className="flex-1 overflow-auto"
          tabIndex={-1}
        >
          {children}
        </main>

        {/* Professional Footer */}
        <footer
          role="contentinfo"
          className="bg-white border-t border-gray-200"
        >
          <div className="container py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Platform Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {PLATFORM_NAME}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Connecting UK healthcare professionals with clinicians in Gaza
                  for life-saving remote consultations through secure,
                  HIPAA-compliant telemedicine.
                </p>
                <div className="gaza-accent w-full h-1 rounded-full"></div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Quick Links</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#how-it-works"
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#features"
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq"
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Support</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#contact"
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#privacy"
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#terms"
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                © 2025 Gaza Telecare Platform. Built for Gaza healthcare
                support.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="font-medium">Hack for Gaza 2025</span>
                <span className="text-xs">إن شاء الله</span>
              </div>
            </div>
          </div>
        </footer>

        {/* Offline Banner */}
        {!isOnline && (
          <div className="fixed bottom-4 left-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 flex items-center space-x-2 z-50">
            <svg
              className="w-5 h-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-yellow-800 text-sm">
              Working offline - Data will sync when connection is restored
            </span>
          </div>
        )}
      </div>
    </>
  );
};
