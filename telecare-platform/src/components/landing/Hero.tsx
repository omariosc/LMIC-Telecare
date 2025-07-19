"use client";

import React from "react";

const CRISIS_HEADLINE = "Life-Saving Medical Support for Gaza";
const SURGEON_STATISTIC = "1,200+ UK Surgeons Ready to Help";
const CRISIS_URGENCY = "Critical healthcare crisis demands immediate action";

const CRISIS_STATISTICS = [
  {
    value: "2.3M",
    label: "People need urgent healthcare",
    color: "medical-red-600",
    bgColor: "medical-red-50",
    borderColor: "medical-red-200",
    icon: "🏥",
  },
  {
    value: "35",
    label: "Hospitals partially functional",
    color: "medical-orange-600",
    bgColor: "medical-orange-50",
    borderColor: "medical-orange-200",
    icon: "🚑",
  },
  {
    value: "24/7",
    label: "Platform availability",
    color: "medical-green-600",
    bgColor: "medical-green-50",
    borderColor: "medical-green-200",
    icon: "⚡",
  },
] as const;

export const Hero: React.FC = () => {
  const handleUKDoctorRegister = () => {
    // Future: Navigate to UK doctor registration
  };

  const handleGazaPlatformAccess = () => {
    // Future: Navigate to Gaza platform access
  };

  const handleEmergencyConsultation = () => {
    // Future: Navigate to emergency consultation
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-mesh"
      role="banner"
      aria-label="hero section"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-medical-blue-50/50 via-white to-medical-green-50/50" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-medical-blue-100/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-medical-green-100/20 rounded-full blur-3xl animate-pulse-slow" />
      
      <div data-testid="hero-container" className="container-responsive relative z-10">
        <div className="text-center max-w-6xl mx-auto animate-fade-in">
          {/* Crisis Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-medical-red-50 border border-medical-red-200 rounded-full text-medical-red-700 font-medium text-sm mb-6 animate-bounce-subtle">
            🚨 Crisis Response Active
          </div>

          {/* Crisis Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
            <span className="text-gradient animate-text bg-gradient-to-r from-medical-blue-600 via-medical-green-600 to-medical-blue-600">
              {CRISIS_HEADLINE}
            </span>
          </h1>
          
          {/* Surgeon Statistic */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-medical-blue-200 rounded-full shadow-lg">
              <div className="w-3 h-3 bg-medical-green-500 rounded-full animate-pulse-slow"></div>
              <p className="text-lg font-semibold text-medical-blue-700">
                {SURGEON_STATISTIC}
              </p>
            </div>
          </div>

          {/* Crisis Urgency Message */}
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
            {CRISIS_URGENCY}. Connect verified UK healthcare specialists with Gaza clinicians 
            for urgent medical consultations during this critical time.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              className="btn-primary hover-lift"
              onClick={handleUKDoctorRegister}
              aria-label="Register as UK Doctor"
            >
              <span>🩺</span>
              Register as UK Doctor
            </button>
            
            <button 
              className="btn-secondary hover-lift"
              onClick={handleGazaPlatformAccess}
              aria-label="Access Gaza Platform"
            >
              <span>🏥</span>
              Access Gaza Platform
            </button>
            
            <button 
              className="btn-urgent hover-lift animate-glow"
              onClick={handleEmergencyConsultation}
              aria-label="Start Emergency Consultation"
            >
              <span>🚨</span>
              Emergency Consultation
            </button>
          </div>

          {/* Gaza Flag Cultural Accent */}
          <div 
            data-testid="gaza-flag-accent" 
            className="gaza-flag-accent mx-auto max-w-md mb-16"
          ></div>

          {/* Crisis Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CRISIS_STATISTICS.map((stat, index) => (
              <div 
                key={stat.value}
                className="card glass-effect hover-lift text-center group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="card-icon mx-auto">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className={`text-3xl font-black text-${stat.color} mb-2 group-hover:scale-110 transition-transform`}>
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};