"use client";

import React, { useState, useEffect } from "react";

type Platform = "ios" | "android" | "unknown";

const APP_INFO = {
  name: "Telecare Platform",
  version: "2.4.1",
  iosVersion: "iOS 14.0+",
  androidVersion: "Android 8.0+",
  size: "45.2 MB",
  lastUpdated: "Dec 15, 2024",
  rating: "4.8",
  downloads: "100K+",
  appStoreUrl: "https://apps.apple.com/app/telecare/id123456789",
  playStoreUrl:
    "https://play.google.com/store/apps/details?id=com.telecare.app",
} as const;

const DOWNLOAD_STATS = [
  { label: "Downloads", value: "100K+", icon: "📱" },
  { label: "Rating", value: "4.8 ★", icon: "⭐" },
  { label: "Countries", value: "50+", icon: "🌍" },
  { label: "Languages", value: "12", icon: "🗣️" },
] as const;

const detectPlatform = (): Platform => {
  if (typeof window === "undefined") return "unknown";
  if (!navigator.userAgent) return "unknown";

  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) return "ios";
  if (/android/.test(userAgent)) return "android";
  return "unknown";
};

export const AppDownload: React.FC = () => {
  const [platform, setPlatform] = useState<Platform>("unknown");

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const handleAppStoreClick = () => {
    // Analytics tracking
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "download_click", {
        platform: "ios",
        store: "app_store",
      });
    }

    window.open(APP_INFO.appStoreUrl, "_blank");
  };

  const handlePlayStoreClick = () => {
    // Analytics tracking
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "download_click", {
        platform: "android",
        store: "google_play",
      });
    }

    window.open(APP_INFO.playStoreUrl, "_blank");
  };

  const getPlatformMessage = () => {
    switch (platform) {
      case "ios":
        return "📱 We detected you're using iOS - tap the App Store button to download!";
      case "android":
        return "🤖 We detected you're using Android - tap the Google Play button to download!";
      default:
        return "📲 Download our app on your mobile device for the best experience";
    }
  };

  return (
    <section
      className="py-24 md:py-32 relative overflow-hidden medical-gradient"
      role="region"
      aria-label="app download section"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-32 h-32 bg-medical-purple-400 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-medical-orange-400 rounded-full blur-2xl animate-pulse-slow" />
      </div>

      <div
        data-testid="download-buttons-container"
        className="container-responsive relative z-10"
      >
        <div className="text-center max-w-5xl mx-auto mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-medical-purple-100 rounded-full text-medical-purple-700 font-medium text-sm mb-6">
            📱 Mobile App
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            <span className="text-gradient">Download Our App</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
            Get instant access to the Telecare platform on your mobile device
            with our feature-rich app
          </p>

          {/* Platform Message */}
          <div data-testid="platform-message" className="mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-medical-blue-200 rounded-full shadow-lg">
              <div className="w-2 h-2 bg-medical-green-500 rounded-full animate-pulse" />
              <span className="text-gray-700 font-medium">
                {getPlatformMessage()}
              </span>
            </div>
          </div>
        </div>

        {/* Main Download Section */}
        <div className="card-glass p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Download Buttons */}
            <div className="space-y-8">
              <div
                data-testid="download-buttons-grid"
                className="flex flex-col sm:flex-row gap-4"
              >
                {/* App Store Button */}
                <button
                  aria-label="Download on App Store"
                  role="button"
                  className={`flex-1 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-xl p-4 hover-lift transition-all duration-300 shadow-lg ${
                    platform === "ios"
                      ? "ring-2 ring-medical-blue-500 ring-offset-2"
                      : ""
                  }`}
                  onClick={handleAppStoreClick}
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-2xl">🍎</div>
                    <div className="text-left">
                      <div className="text-xs text-gray-300">
                        Download on the
                      </div>
                      <div className="text-lg font-bold">App Store</div>
                    </div>
                  </div>
                </button>

                {/* Google Play Button */}
                <button
                  aria-label="Get it on Google Play"
                  role="button"
                  className={`flex-1 bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white rounded-xl p-4 hover-lift transition-all duration-300 shadow-lg ${
                    platform === "android"
                      ? "ring-2 ring-medical-blue-500 ring-offset-2"
                      : ""
                  }`}
                  onClick={handlePlayStoreClick}
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-2xl">📱</div>
                    <div className="text-left">
                      <div className="text-xs text-green-100">GET IT ON</div>
                      <div className="text-lg font-bold">Google Play</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* App Information */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version:</span>
                    <span className="font-medium">{APP_INFO.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{APP_INFO.size}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">iOS:</span>
                    <span className="font-medium">{APP_INFO.iosVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Android:</span>
                    <span className="font-medium">
                      {APP_INFO.androidVersion}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-600">
                Last Updated: {APP_INFO.lastUpdated}
              </div>
            </div>

            {/* QR Code Section */}
            <div data-testid="qr-code-section" className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Quick Download
              </h3>
              <p className="text-gray-600 mb-6">
                Scan with your phone camera to download instantly
              </p>

              {/* QR Code Placeholder */}
              <div
                data-testid="qr-code-placeholder"
                className="w-48 h-48 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 hover-lift"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <div className="text-sm text-gray-600">QR Code</div>
                  <div className="text-xs text-gray-500">Coming Soon</div>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Point your camera at the QR code to download
              </div>
            </div>
          </div>
        </div>

        {/* Download Statistics */}
        <div
          data-testid="download-stats"
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {DOWNLOAD_STATS.map((stat, index) => (
            <div
              key={stat.label}
              className="card card-medical hover-lift text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl font-black text-medical-purple-600 mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Preview */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Why Download Our App?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "⚡",
                title: "Instant Notifications",
                description:
                  "Get real-time alerts and updates directly to your phone",
              },
              {
                icon: "📊",
                title: "Advanced Analytics",
                description:
                  "Access detailed insights and data visualization on the go",
              },
              {
                icon: "🔒",
                title: "Enhanced Security",
                description:
                  "Biometric authentication and secure data encryption",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="card card-medical hover-lift text-center group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-slide-up">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-medical-purple-200 shadow-lg hover-lift">
            <div className="w-3 h-3 bg-medical-purple-500 rounded-full animate-pulse" />
            <span className="text-medical-purple-700 font-semibold text-lg">
              🚀 Join thousands of users already using our app
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
