"use client";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export default function NetworkStatus() {
  const { isOnline, connectionType, isSlowConnection } = useOnlineStatus();

  // Don't show anything if online with good connection
  if (isOnline && !isSlowConnection) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm font-medium ${
        !isOnline
          ? "bg-red-500 text-white"
          : isSlowConnection
            ? "bg-orange-500 text-white"
            : "bg-green-500 text-white"
      }`}
    >
      {!isOnline ? (
        <div className="flex items-center justify-center space-x-2">
          <span className="animate-pulse">⚠️</span>
          <span>You&apos;re offline. Some features may be limited.</span>
        </div>
      ) : isSlowConnection ? (
        <div className="flex items-center justify-center space-x-2">
          <span>🐌</span>
          <span>
            Slow connection detected ({connectionType}). Optimizing for your
            network.
          </span>
        </div>
      ) : null}
    </div>
  );
}
