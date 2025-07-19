import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import DonationForm from "@/components/donation/DonationForm";

export const metadata: Metadata = {
  title: "Donate to Jusur (جسور) - Support Medical Aid",
  description:
    "Support our mission to provide critical medical consultations and equipment to Gaza. Every donation helps save lives.",
};

export default function DonationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" strokeWidth={3} />
            <strong>Back to Jusur (جسور)</strong>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Support Jusur (جسور)
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your donation directly funds critical medical equipment, platform
            development, and infrastructure to connect UK specialists with Gaza
            clinicians.
          </p>
        </div>

        {/* Trust and Security Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <div className="bg-blue-100 border-blue-500 border p-6 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-3">100% Transparency</h3>
            <p className="text-blue-800">
              Every donation is tracked and reported. We will publish quarterly
              impact reports showing exactly how funds are used to support Gaza.
            </p>
          </div>

          <div className="bg-green-100 border-green-500 border p-6 rounded-lg">
            <h3 className="font-bold text-green-900 mb-3">Secure & Trusted</h3>
            <p className="text-green-800">
              We never store your payment information. All donations are
              processed in accordance with international humanitarian aid
              guidelines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Donation Form */}
          <div>
            <DonationForm />
          </div>

          {/* Impact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Impact
            </h2>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg text-green-600 mb-2">£25</h3>
                <p className="text-gray-600">
                  Funds one emergency consultation session between a Gaza
                  clinician and UK specialist
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg text-green-600 mb-2">£100</h3>
                <p className="text-gray-600">
                  Supports platform infrastructure for a week, enabling 24/7
                  connectivity
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg text-green-600 mb-2">£500</h3>
                <p className="text-gray-600">
                  Helps fund essential medical equipment through our verified
                  aid partners (once we can get aid into Gaza إن شاء الله)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
