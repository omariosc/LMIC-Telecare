"use client";

import React from "react";

const PROCESS_STEPS = [
  {
    number: 1,
    title: "Gaza Clinician Request",
    description: "Gaza clinicians register and request urgent medical consultation for their patients",
    emergency: true,
  },
  {
    number: 2,
    title: "UK Specialist Match",
    description: "Our system instantly matches requests with available UK specialists based on expertise",
    emergency: false,
  },
  {
    number: 3,
    title: "Secure Consultation",
    description: "Private, encrypted video or chat consultation between specialists across borders",
    emergency: false,
  },
  {
    number: 4,
    title: "Follow-up Documentation",
    description: "Complete medical record documentation and follow-up care recommendations",
    emergency: false,
  },
] as const;

export const HowItWorks: React.FC = () => {
  return (
    <section 
      className="py-16 bg-white"
      role="region"
      aria-label="how it works process"
    >
      <div data-testid="how-it-works-container" className="container-responsive">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          
          <p className="text-large text-gray-700 mb-12">
            Connecting Gaza clinicians with UK specialists for emergency 24/7 medical support
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  <p className="text-sm text-gray-600">
                    {step.description}
                  </p>
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
              Emergency consultations available 24/7 with secure encrypted connections
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};