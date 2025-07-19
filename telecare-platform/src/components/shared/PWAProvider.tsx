"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import PWA components to avoid SSR issues
const PWAInstallPrompt = dynamic(() => import("./PWAInstallPrompt"), {
  ssr: false,
});
const NetworkStatus = dynamic(() => import("./NetworkStatus"), { ssr: false });

interface PWAProviderProps {
  children: React.ReactNode;
}

export default function PWAProvider({ children }: PWAProviderProps) {
  useEffect(() => {
    // Register service worker in production
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // eslint-disable-next-line no-console
          console.log(
            "Service Worker registered successfully:",
            registration.scope
          );

          // Handle updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New content is available, prompt user to refresh
                  if (confirm("New version available! Refresh to update?")) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    // Handle app updates
    const handleAppUpdate = () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration) {
            registration.update();
          }
        });
      }
    };

    // Check for updates when app becomes visible
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        handleAppUpdate();
      }
    });

    // Prevent zoom on iOS
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    let lastTouchEnd = 0;
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <>
      <NetworkStatus />
      {children}
      <PWAInstallPrompt />
    </>
  );
}
