"use client";

import React from "react";

const PROCESS_STEPS = [
  {
    number: 1,
    title: "Register & Verify",
    description:
      "Complete a quick registration. Your credentials will be instantly and securely verified against the official GMC register to build immediate trust.",
    emergency: false,
  },
  {
    number: 2,
    title: "Connect on Your Terms",
    description:
      "Offer support via our three consultation modes: answer urgent queries on our asynchronous forum, join scheduled MDT meetings, or accept on-call pings for emergencies.",
    emergency: false,
  },
  {
    number: 3,
    title: "Guide and Save Lives",
    description:
      "Share your specialist knowledge, supported by our live translation feature, to guide a clinician in Gaza through a critical decision. Your advice has a direct, life-saving impact.",
    emergency: true,
  },
] as const;

export const HowItWorks: React.FC = () => {
  return (
    <section
      className="py-16 bg-white"
      role="region"
      aria-label="how it works process"
    >
      <div
        data-testid="how-it-works-container"
        className="container-responsive"
      >
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Secure, and Built for Impact
          </h2>

          <p className="text-large text-gray-700 mb-12">
            We connect your expertise to where it&apos;s needed most in three
            simple steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.number}
                data-testid={`step-${step.number}`}
                className="relative"
              >
                {/* Step Indicator */}
                <div
                  data-testid={`step-${step.number}-indicator`}
                  className="w-12 h-12 rounded-full bg-medical-blue-500 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4"
                >
                  {step.number}
                </div>

                {/* Step Content */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>

                {/* Connection Line */}
                {step.number < PROCESS_STEPS.length && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-medical-blue-200 transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>

          {/* Emergency Emphasis */}
          <div className="mt-12 p-6 bg-medical-red-50 rounded-lg border border-medical-red-200">
            <p className="text-medical-red-700 font-semibold">
              Emergency consultations available 24/7 with secure encrypted
              connections
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
