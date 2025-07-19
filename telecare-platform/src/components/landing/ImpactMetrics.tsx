"use client";

import React from "react";

const IMPACT_METRICS = [
  {
    id: 1,
    title: "Emergency Consultations",
    value: "---",
    unit: "completed",
    description:
      "Life-saving consultations between Gaza clinicians and UK specialists",
    isComingSoon: true,
  },
  {
    id: 2,
    title: "Lives Impacted",
    value: "---",
    unit: "patients helped",
    description: "Palestinian patients receiving expert medical guidance",
    isComingSoon: true,
  },
  {
    id: 3,
    title: "Average Response Time",
    value: "---",
    unit: "minutes",
    description: "Real-time connection speed for emergency consultations",
    isComingSoon: true,
  },
  {
    id: 4,
    title: "UK Specialists Registered",
    value: "---",
    unit: "doctors verified",
    description:
      "GMC-verified specialists ready to provide humanitarian support",
    isComingSoon: true,
  },
] as const;

export const ImpactMetrics: React.FC = () => {
  return (
    <section
      className="py-16 bg-medical-blue-50"
      role="region"
      aria-label="impact metrics and statistics"
    >
      <div
        data-testid="impact-metrics-container"
        className="container-responsive"
      >
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Platform Impact
          </h2>

          <p className="text-large text-gray-700">
            Real-time tracking of our humanitarian medical technology&apos;s
            impact on Gaza healthcare crisis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {IMPACT_METRICS.map((metric) => (
            <div
              key={metric.id}
              data-testid={`metric-${metric.id}`}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center relative"
            >
              {/* Coming Soon Badge */}
              {metric.isComingSoon && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-medical-green-100 text-medical-green-700">
                    Coming Soon
                  </span>
                </div>
              )}

              {/* Metric Value */}
              <div
                data-testid={`metric-${metric.id}-value`}
                className="text-3xl font-bold text-medical-blue-600 mb-2"
              >
                {metric.value}
              </div>

              {/* Metric Unit */}
              <div className="text-sm text-gray-500 mb-3">{metric.unit}</div>

              {/* Metric Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {metric.title}
              </h3>

              {/* Metric Description */}
              <p className="text-sm text-gray-600">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Launch Message */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-medical-blue-200">
            <span className="text-medical-blue-700 font-medium">
              📊 Live impact data collection begins at platform launch - 24/7
              tracking of humanitarian outcomes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
