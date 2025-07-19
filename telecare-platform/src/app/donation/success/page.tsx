"use client";

import { useState } from "react";
import { CheckCircleIcon, HeartIcon, LinkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function DonationSuccess() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const shareUrl = "https://jusur.org.uk";
      const shareText = "I just donated to Jusur (جسور) - a platform connecting UK medical specialists with Gaza clinicians. Join me in supporting this vital healthcare bridge: ";
      
      await navigator.clipboard.writeText(shareText + shareUrl);
      setCopied(true);
      
      // Reset after 3 seconds
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = "I just donated to Jusur (جسور) - a platform connecting UK medical specialists with Gaza clinicians. Join me in supporting this vital healthcare bridge: https://jusur.org.uk";
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
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-6" />

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Thank You for Your Donation!
        </h1>

        <p className="text-gray-600 mb-6">
          Your generous contribution will help fund critical medical equipment
          and support our platform development to serve the people of Gaza.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-green-800">
            <HeartIcon className="h-5 w-5" />
            <span className="font-semibold">Your impact matters</span>
          </div>
          <p className="text-green-700 text-sm mt-2">
            Every dollar helps bridge the healthcare gap and saves lives in
            Gaza.
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          You will receive a confirmation email shortly with your donation
          receipt.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-full font-bold hover:bg-blue-700 transition-colors inline-block"
          >
            Return to Home
          </Link>

          <button
            onClick={handleShare}
            className={`w-full py-3 px-6 rounded-full font-bold transition-colors inline-flex items-center justify-center gap-2 ${
              copied
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <LinkIcon className="h-4 w-4" />
            {copied ? "Link Copied!" : "Share This Cause"}
          </button>
        </div>
      </div>
    </div>
  );
}
