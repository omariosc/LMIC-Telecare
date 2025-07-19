"use client";

import React from "react";

const TESTIMONIALS = [
  {
    id: 1,
    quote: "This platform has been absolutely life-saving for our emergency consultations. The ability to connect instantly with UK specialists has made a critical impact on patient outcomes during this humanitarian crisis.",
    author: "Dr. Sarah Mitchell",
    title: "Consultant Emergency Medicine",
    location: "NHS Foundation Trust, London",
    type: "uk_specialist",
  },
  {
    id: 2,
    quote: "Having direct access to UK medical expertise has been invaluable for our complex cases. The secure communication and professional collaboration gives us confidence in providing the best care possible for our patients in Gaza.",
    author: "Dr. Ahmed Hassan",
    title: "Senior Emergency Physician",
    location: "Gaza Medical Complex",
    type: "gaza_clinician",
  },
  {
    id: 3,
    quote: "The trust and reliability of this platform ensures we can provide professional humanitarian support effectively. It bridges the gap between UK medical expertise and Gaza's urgent healthcare needs.",
    author: "Dr. James Thompson",
    title: "Consultant Trauma Surgeon",
    location: "Royal London Hospital",
    type: "uk_specialist",
  },
] as const;

export const Testimonials: React.FC = () => {
  return (
    <section 
      className="py-16 bg-white"
      role="region"
      aria-label="testimonials from medical professionals"
    >
      <div data-testid="testimonials-container" className="container-responsive">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Medical Professional Testimonials
          </h2>
          
          <p className="text-large text-gray-700">
            Trust signals from verified UK specialists and Gaza clinicians using the platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div 
              key={testimonial.id}
              data-testid={`testimonial-${testimonial.id}`}
              className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200 relative"
            >
              
              {/* Quote */}
              <div className="mb-6">
                <blockquote className="text-gray-700 italic">
                  "{testimonial.quote}"
                </blockquote>
              </div>
              
              {/* Author Attribution */}
              <div data-testid={`testimonial-${testimonial.id}-author`} className="border-t border-gray-200 pt-4">
                <div className="font-semibold text-gray-900">
                  {testimonial.author}
                </div>
                <div className="text-sm text-medical-blue-600 font-medium">
                  {testimonial.title}
                </div>
                <div className="text-sm text-gray-500">
                  {testimonial.location}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Message */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-medical-green-50 rounded-full border border-medical-green-200">
            <span className="text-medical-green-700 font-medium">
              🏥 Professional collaboration bridging UK medical expertise with Gaza healthcare crisis
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};