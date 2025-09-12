import { PricingTable } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-4xl min-h-screen flex flex-col items-center justify-center mx-auto h-full  px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-8">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          <h1 className="text-5xl font-bold text-white mb-6">Pricing</h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Never worry about serverless timeouts again. Handle long-running streams like OpenAI
            chat, analytics feeds, or real-time APIs without hitting platform limits.
          </p>
        </div>
        <PricingTable
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          }
          newSubscriptionRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
