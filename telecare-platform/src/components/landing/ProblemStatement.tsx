import React from "react";

const HEALTHCARE_STATISTICS = [
  {
    id: "critical",
    value: "2.3 Million",
    label: "People need urgent healthcare access",
    description: "Entire population affected by medical supply shortages",
    priority: "critical",
    testId: "statistic-card-critical",
  },
  {
    id: "hospitals",
    value: "35",
    label: "Hospitals partially functional",
    description: "Out of 70+ medical facilities before the crisis",
    priority: "urgent",
    testId: "statistic-card-urgent",
  },
  {
    id: "specialists",
    value: "90%",
    label: "Specialist shortage",
    description: "Critical lack of specialized medical expertise",
    priority: "warning",
    testId: "statistic-card-warning",
  },
  {
    id: "access",
    value: "Limited",
    label: "Medical supply access due to blockade restrictions",
    description: "Essential medicines and equipment severely restricted",
    priority: "critical",
    testId: "statistic-card-access",
  },
] as const;

export const ProblemStatement: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div
        data-testid="problem-statement-container"
        className="container-responsive"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="heading-section text-gray-900 mb-4">
            A Healthcare System in Collapse
          </h2>
          <p className="text-large text-gray-600 max-w-3xl mx-auto">
            In Gaza, hospitals are overwhelmed, operating at over 350% capacity
            with a critical shortage of specialist doctors. Triage is happening,
            but without the right expertise to guide complex treatments, lives
            that could be saved are being lost. When physical aid cannot get in,
            knowledge is the most powerful resource we can send.
          </p>
        </div>

        {/* Crisis Statistics Grid */}
        <div className="grid grid-mobile-first gap-6 mb-12">
          {HEALTHCARE_STATISTICS.map((stat) => (
            <div
              key={stat.id}
              data-testid={stat.testId}
              className={`medical-card medical-card-${stat.priority} p-6 text-center`}
            >
              <div className={`text-4xl font-bold text-${stat.priority} mb-3`}>
                {stat.value}
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {stat.label}
              </h3>
              <p className="text-gray-600 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Context for UK Doctor Involvement */}
        <div className="bg-gradient-to-r from-medical-blue-50 to-medical-green-50 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Why UK Medical Specialists Are Critical
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div>
              <h4 className="font-semibold text-medical-blue-700 mb-2">
                Remote Consultation Expertise
              </h4>
              <p className="text-gray-600 text-sm">
                UK doctors provide life-saving specialist guidance when local
                expertise is overwhelmed or unavailable.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-medical-green-700 mb-2">
                Immediate Access Breaking Barriers
              </h4>
              <p className="text-gray-600 text-sm">
                Digital consultations bypass physical restrictions and blockade
                limitations to deliver urgent medical support.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Context */}
        <div className="text-center mt-12">
          <p className="text-gray-700 mb-6">
            Your expertise can bridge the gap between critical need and
            life-saving care.
          </p>
          <div className="gaza-flag-accent mx-auto max-w-lg"></div>
        </div>
      </div>
    </section>
  );
};
