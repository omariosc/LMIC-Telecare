"use client";

import React, { useState } from "react";

const FAQ_ITEMS = [
  {
    id: 1,
    question: "Is the platform secure and private?",
    answer: "Yes, our platform uses end-to-end encryption for all communications between Gaza clinicians and UK specialists. All medical data is protected with bank-level security and complies with international privacy standards.",
  },
  {
    id: 2,
    question: "How quickly can I get emergency consultation support?",
    answer: "Emergency consultations are available 24/7 with typical response times under 15 minutes. Our system instantly matches urgent requests with available UK specialists based on expertise and current availability.",
  },
  {
    id: 3,
    question: "How do UK specialists join the platform?",
    answer: "UK doctors and specialists can register through our verification process. We welcome medical professionals who want to provide humanitarian support during this healthcare crisis in Gaza.",
  },
  {
    id: 4,
    question: "What types of Gaza healthcare scenarios does this support?",
    answer: "Our platform supports emergency consultations, complex case discussions, surgical guidance, and general medical advice. We focus on bridging the gap during this humanitarian crisis when local resources are severely limited.",
  },
  {
    id: 5,
    question: "Is this service free for Gaza healthcare workers?",
    answer: "Yes, this platform is completely free for Gaza clinicians and healthcare workers. It's funded as a humanitarian initiative to support medical care during this critical time.",
  },
  {
    id: 6,
    question: "When will the platform be available?",
    answer: "The platform is currently in development and will launch soon. Gaza healthcare workers can register for early access, and UK specialists can sign up to provide support.",
  },
  {
    id: 7,
    question: "How can I get help or contact support?",
    answer: "For technical support or questions about the platform, you can contact our humanitarian support team through the contact form or reach out during the beta launch phase.",
  },
] as const;

export const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section 
      className="py-16 bg-gray-50"
      role="region"
      aria-label="frequently asked questions"
    >
      <div data-testid="faq-container" className="container-responsive">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          
          <p className="text-large text-gray-700">
            Common questions about our humanitarian medical platform for Gaza healthcare crisis
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {FAQ_ITEMS.map((item) => (
            <div 
              key={item.id}
              data-testid={`faq-${item.id}`}
              className="bg-white rounded-lg border border-gray-200 shadow-sm"
            >
              {/* Question Header */}
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:ring-inset rounded-lg"
                onClick={() => toggleItem(item.id)}
                aria-expanded={openItems.has(item.id)}
                aria-controls={`faq-${item.id}-answer`}
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {item.question}
                </span>
                <span className="flex-shrink-0 text-medical-blue-500 text-xl">
                  {openItems.has(item.id) ? "−" : "+"}
                </span>
              </button>
              
              {/* Answer Content */}
              {openItems.has(item.id) && (
                <div 
                  id={`faq-${item.id}-answer`}
                  className="px-6 pb-4 text-gray-700"
                >
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-medical-blue-200">
            <span className="text-medical-blue-700 font-medium">
              💬 Need more help? Contact our humanitarian support team for assistance
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};