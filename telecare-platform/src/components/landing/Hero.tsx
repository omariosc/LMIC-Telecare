"use client";

import React from "react";

const CRISIS_HEADLINE = "A Healthcare System in Collapse";
const SURGEON_STATISTIC =
  "100% UK Surgeons Agree: Your remote guidance is the #1 most impactful intervention";
const CRISIS_URGENCY =
  "In Gaza, hospitals are overwhelmed, operating at over 350% capacity with a critical shortage of specialist doctors. Triage is happening, but without the right expertise to guide complex treatments, lives that could be saved are being lost. When physical aid cannot get in, knowledge is the most powerful resource we can send.";

const CRISIS_STATISTICS = [
  {
    value: "350%+",
    label: "Average Hospital Capacity",
    type: "critical",
    icon: "🏥",
  },
  {
    value: "75%+",
    label: "Shortage of Surgical Specialists",
    type: "critical",
    icon: "⚕️",
  },
  {
    value: "100%",
    label:
      "UK Surgeons Agree: Your remote guidance is the #1 most impactful intervention",
    type: "success",
    icon: "💚",
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
      className="relative section-padding bg-gradient-to-b from-background to-muted/20 overflow-hidden"
      role="banner"
      aria-label="hero section"
    >
      {/* Subtle background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-subtle" />
      <div
        className="absolute bottom-20 right-10 w-80 h-80 bg-gaza-green/5 rounded-full blur-3xl animate-pulse-subtle"
        style={{ animationDelay: "1s" }}
      />

      <div data-testid="hero-container" className="container relative z-10">
        <div className="text-center max-w-6xl mx-auto animate-fade-in">
          {/* Crisis Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-full text-destructive font-medium text-sm mb-8">
            🚨 Crisis Response Active
          </div>

          {/* Crisis Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-primary via-gaza-green to-primary bg-clip-text text-transparent">
              {CRISIS_HEADLINE}
            </span>
          </h1>

          {/* Surgeon Statistic */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-lg">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <p className="text-lg font-medium text-foreground">
                {SURGEON_STATISTIC}
              </p>
            </div>
          </div>

          {/* Crisis Urgency Message */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            {CRISIS_URGENCY}
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              className="btn btn-primary btn-lg gap-2"
              onClick={handleUKDoctorRegister}
              aria-label="Register as UK Doctor"
            >
              <span>🩺</span>
              Register as UK Doctor
            </button>

            <button
              className="btn btn-secondary btn-lg gap-2"
              onClick={handleGazaPlatformAccess}
              aria-label="Access Gaza Platform"
            >
              <span>🏥</span>
              Access Gaza Platform
            </button>

            <button
              className="btn btn-lg gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
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
            className="gaza-accent mx-auto max-w-md mb-16 h-2 rounded-full"
          />

          {/* Crisis Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CRISIS_STATISTICS.map((stat, index) => (
              <div
                key={stat.value}
                className="stat-card animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4">
                  <span className="text-3xl">{stat.icon}</span>
                </div>
                <div
                  className={`text-4xl font-bold mb-3 ${
                    stat.type === "critical"
                      ? "text-destructive"
                      : "text-success"
                  }`}
                >
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
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