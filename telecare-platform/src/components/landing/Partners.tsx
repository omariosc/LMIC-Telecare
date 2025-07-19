"use client";

import React from "react";

const PARTNER_ORGANIZATIONS = [
  {
    id: 1,
    name: "NHS Foundation Trust",
    type: "medical",
    description:
      "UK National Health Service providing specialist medical expertise",
    logoPlaceholder: "🏥",
    category: "Healthcare",
  },
  {
    id: 2,
    name: "Medical Relief International",
    type: "humanitarian",
    description:
      "Humanitarian aid organization supporting emergency medical care",
    logoPlaceholder: "🚑",
    category: "Humanitarian",
  },
  {
    id: 3,
    name: "Digital Health Innovation Hub",
    type: "technology",
    description: "Technology partner enabling secure medical communication",
    logoPlaceholder: "💻",
    category: "Technology",
  },
  {
    id: 4,
    name: "Gaza Medical Association",
    type: "medical",
    description: "Local medical organization coordinating healthcare support",
    logoPlaceholder: "🩺",
    category: "Healthcare",
  },
  {
    id: 5,
    name: "Emergency Response Charity",
    type: "humanitarian",
    description: "International charity providing crisis emergency support",
    logoPlaceholder: "🆘",
    category: "Humanitarian",
  },
] as const;

export const Partners: React.FC = () => {
  return (
    <section
      className="py-16 bg-white"
      role="region"
      aria-label="partner organizations supporting the mission"
    >
      <div data-testid="partners-container" className="container-responsive">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Partner Organizations
          </h2>

          <p className="text-large text-gray-700">
            Collaboration with medical, humanitarian, and technology
            organizations supporting Gaza healthcare crisis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {PARTNER_ORGANIZATIONS.map((partner) => (
            <div
              key={partner.id}
              data-testid={`partner-${partner.id}`}
              className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Logo Placeholder */}
              <div
                data-testid={`partner-${partner.id}-logo`}
                className="text-6xl mb-4"
              >
                {partner.logoPlaceholder}
              </div>

              {/* Partner Details */}
              <div className="mb-2">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-medical-blue-100 text-medical-blue-700 rounded-full">
                  {partner.category}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {partner.name}
              </h3>

              <p className="text-sm text-gray-600">{partner.description}</p>
            </div>
          ))}
        </div>

        {/* Partnership CTA */}
        <div className="text-center bg-medical-blue-50 rounded-lg p-8 border border-medical-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Join Our Partner Network
          </h3>
          <p className="text-gray-700 mb-6">
            Partner with us to support this humanitarian mission providing
            emergency medical assistance during the Gaza healthcare crisis
          </p>
          <button className="btn-primary">Become a Partner</button>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-full border border-gray-300">
            <span className="text-gray-600 font-medium">
              🤝 Partner logos and official partnerships coming soon
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
