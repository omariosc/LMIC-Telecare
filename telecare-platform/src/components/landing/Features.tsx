"use client";

import React from "react";

const FEATURE_LIST = [
  {
    id: 1,
    title: "Emergency Consultation",
    description:
      "24/7 instant access to UK specialists for critical medical emergencies in Gaza",
    icon: "🚨",
    highlight: "emergency",
  },
  {
    id: 2,
    title: "Secure Video Calls",
    description:
      "Encrypted video and chat communication between Gaza clinicians and UK experts",
    icon: "📹",
    highlight: "secure",
  },
  {
    id: 3,
    title: "Expert Matching",
    description:
      "Intelligent specialist matching based on medical expertise and availability",
    icon: "🎯",
    highlight: "specialist",
  },
  {
    id: 4,
    title: "Medical Records",
    description:
      "Secure patient data documentation and medical record management",
    icon: "📋",
    highlight: "documentation",
  },
  {
    id: 5,
    title: "Offline Access",
    description:
      "Works offline with limited internet - designed for Gaza&apos;s connectivity challenges",
    icon: "📱",
    highlight: "offline",
  },
  {
    id: 6,
    title: "Arabic-English Support",
    description:
      "Full multilingual interface with medical translation capabilities",
    icon: "🌍",
    highlight: "multilingual",
  },
] as const;

export const Features: React.FC = () => {
  return (
    <section
      className="py-24 md:py-32 relative medical-gradient"
      role="region"
      aria-label="platform features overview"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-medical-blue-400 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-medical-green-400 rounded-full blur-2xl" />
      </div>

      <div
        data-testid="features-container"
        className="container-responsive relative z-10"
      >
        <div className="text-center max-w-5xl mx-auto mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-medical-blue-100 rounded-full text-medical-blue-700 font-medium text-sm mb-6">
            ⚡ Advanced Medical Technology
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            <span className="text-gradient">Platform Features</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
            Humanitarian medical technology designed specifically for
            Gaza&apos;s healthcare crisis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {FEATURE_LIST.map((feature, index) => (
            <div
              key={feature.id}
              data-testid={`feature-${feature.id}`}
              className="card card-medical hover-lift group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Feature Icon Container */}
              <div className="card-icon mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span
                  data-testid={`feature-${feature.id}-icon`}
                  className="text-3xl"
                >
                  {feature.icon}
                </span>
              </div>

              {/* Feature Content */}
              <div className="text-center">
                <div className="card-subtitle mb-2">{feature.highlight}</div>
                <h3 className="card-title mb-3">{feature.title}</h3>
                <p className="card-description">{feature.description}</p>
              </div>

              {/* Hover indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-medical-blue-500 to-medical-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Emergency Emphasis */}
        <div className="text-center animate-slide-up">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-medical-red-200 shadow-lg hover-lift">
            <div className="w-3 h-3 bg-medical-red-500 rounded-full animate-pulse" />
            <span className="text-medical-red-700 font-semibold text-lg">
              🚨 Emergency consultations available 24/7 with HIPAA-compliant
              security
            </span>
          </div>
        </div>

        {/* Additional security badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {[
            { icon: "🔒", text: "End-to-End Encrypted" },
            { icon: "🏥", text: "HIPAA Compliant" },
            { icon: "🌍", text: "Globally Accessible" },
            { icon: "⚡", text: "Real-time Sync" },
          ].map((badge, index) => (
            <div
              key={badge.text}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover-lift"
              style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
            >
              <span>{badge.icon}</span>
              {badge.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
