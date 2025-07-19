"use client";

import React from "react";

export const Donation: React.FC = () => {
  const handleDonateClick = () => {
    // Future: Integrate with donation platform
  };

  const handleMonthlyClick = () => {
    // Future: Set up recurring donations
  };

  return (
    <section
      className="py-16 bg-gradient-to-br from-medical-red-50 to-medical-blue-50"
      role="region"
      aria-label="donation support for Gaza healthcare"
    >
      <div data-testid="donation-container" className="container-responsive">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Support Gaza Healthcare Crisis Response
          </h2>

          <p className="text-large text-gray-700 mb-8">
            Your donations help sustain this humanitarian platform providing
            emergency medical support despite the ongoing blockade restrictions
            limiting healthcare access in Gaza
          </p>

          {/* Impact Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-medical-red-200">
              <div className="text-3xl font-bold text-medical-red-600 mb-2">
                24/7
              </div>
              <div className="text-sm text-gray-600">
                Emergency consultations enabled by your support
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-medical-blue-200">
              <div className="text-3xl font-bold text-medical-blue-600 mb-2">
                100%
              </div>
              <div className="text-sm text-gray-600">
                Transparent funding for humanitarian medical technology
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-medical-green-200">
              <div className="text-3xl font-bold text-medical-green-600 mb-2">
                ∞
              </div>
              <div className="text-sm text-gray-600">
                Lives that can be saved through specialist consultations
              </div>
            </div>
          </div>

          {/* Blockade Impact Messaging */}
          <div className="bg-white rounded-lg p-8 mb-8 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Breaking Through Healthcare Barriers
            </h3>
            <p className="text-gray-700 leading-relaxed">
              The ongoing blockade has severely restricted medical supplies,
              specialist access, and healthcare infrastructure in Gaza. This
              platform provides a critical digital bridge, enabling Gaza
              clinicians to access UK medical expertise when physical barriers
              prevent traditional humanitarian medical aid delivery. Your
              support helps maintain this life-saving connection during the
              humanitarian crisis.
            </p>
          </div>

          {/* Donation CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              className="btn-primary text-lg px-8 py-4"
              onClick={handleDonateClick}
              aria-label="Make a one-time donation"
            >
              💝 Donate Now
            </button>

            <button
              className="btn-secondary text-lg px-8 py-4"
              onClick={handleMonthlyClick}
              aria-label="Set up monthly recurring support"
            >
              🔄 Monthly Support
            </button>
          </div>

          {/* Trust and Impact Messaging */}
          <div className="bg-medical-green-50 rounded-lg p-6 border border-medical-green-200">
            <p className="text-medical-green-800 font-medium">
              🛡️ Secure and transparent donations directly fund platform
              operations to help save lives by providing Gaza healthcare workers
              with immediate access to UK medical specialists
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
