import { XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DonationCancelled() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <XCircleIcon className="h-16 w-16 text-orange-500 mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Donation Cancelled
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your donation was cancelled. No payment has been processed.
        </p>
        
        <p className="text-gray-500 text-sm mb-6">
          We understand that donating is a personal decision. If you change your mind, you can always return to make a donation later.
        </p>
        
        <div className="space-y-3">
          <Link
            href="/donation"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-full font-bold hover:bg-green-700 transition-colors inline-block"
          >
            Try Again
          </Link>
          
          <Link
            href="/"
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}