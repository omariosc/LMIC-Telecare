"use client";

import React, { useEffect } from "react";
import NetworkStatus from "../shared/NetworkStatus";
import PWAInstallPrompt from "../shared/PWAInstallPrompt";

const SKIP_LINK_STYLES =
  "sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:border-2 focus:border-black";
const MAIN_CONTENT_ID = "main-content";
const PLATFORM_NAME = "Telecare Platform";
const PLATFORM_TAGLINE = "Gaza Healthcare Support";

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
  useEffect(() => {
    // Set document direction for RTL support
    document.documentElement.dir = direction;
    document.documentElement.lang = direction === "rtl" ? "ar" : "en";
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
        className={`min-h-screen flex flex-col container-responsive ${className}`}
      >
        {/* Header - Navigation Area */}
        <header role="banner" className="bg-white border-b border-gray-200">
          <div className="container-responsive py-4">
            {/* Future navigation will go here */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-medical-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TC</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {PLATFORM_NAME}
                </span>
              </div>

              {/* Future navigation items */}
              <nav
                className="flex items-center gap-4"
                aria-label="Primary navigation"
              >
                <span className="text-sm text-gray-500">
                  {PLATFORM_TAGLINE}
                </span>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main
          id={MAIN_CONTENT_ID}
          role="main"
          className="flex-1 bg-gray-50"
          tabIndex={-1}
        >
          {children}
        </main>

        {/* Footer */}
        <footer
          role="contentinfo"
          className="bg-white border-t border-gray-200"
        >
          <div className="container-responsive py-8">
            <div className="grid grid-mobile-first gap-8">
              {/* Platform Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  {PLATFORM_NAME}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Connecting UK healthcare professionals with clinicians in Gaza
                  for life-saving remote consultations.
                </p>
                <div className="gaza-flag-accent"></div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <a
                      href="#how-it-works"
                      className="hover:text-medical-blue-600"
                    >
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a href="#features" className="hover:text-medical-blue-600">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="hover:text-medical-blue-600">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <a href="#contact" className="hover:text-medical-blue-600">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#privacy" className="hover:text-medical-blue-600">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#terms" className="hover:text-medical-blue-600">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                © 2025 Telecare Platform. Built for Gaza healthcare support.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Hack for Gaza 2025 Winner (إن شاء الله)</span>
                <div className="verification-badge gmc-badge">GMC Verified</div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
