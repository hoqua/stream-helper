import Link from 'next/link';

export default function PaymentFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="max-w-4xl mx-auto px-4 py-24">
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Premium Access Required</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            This dashboard is only available to premium subscribers. Please upgrade your plan to
            access advanced streaming features and tools.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            View Pricing Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
