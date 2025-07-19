import { CheckCircleIcon, HeartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function DonationSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-6" />

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Thank You for Your Donation!
        </h1>

        <p className="text-gray-600 mb-6">
          Your generous contribution will help fund critical medical equipment
          and support our platform development to serve the people of Gaza.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-green-800">
            <HeartIcon className="h-5 w-5" />
            <span className="font-semibold">Your impact matters</span>
          </div>
          <p className="text-green-700 text-sm mt-2">
            Every dollar helps bridge the healthcare gap and saves lives in
            Gaza.
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          You will receive a confirmation email shortly with your donation
          receipt.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-full font-bold hover:bg-blue-700 transition-colors inline-block"
          >
            Return to Home
          </Link>

          <Link
            href="#share"
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors inline-block"
          >
            Share This Cause
          </Link>
        </div>
      </div>
    </div>
  );
}
