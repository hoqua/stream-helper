import Link from 'next/link';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

      <div className="max-w-4xl mx-auto px-4 py-24">
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

          <h1 className="text-5xl font-bold text-white mb-6">Durablr SaaS</h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Generic SaaS that handles any Server-Sent Events (SSE) stream without serverless timeout
            issues. Perfect for Vercel, Netlify, and other serverless platforms.
          </p>

          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">How to Install</h2>
            <ol className="text-left text-gray-400 space-y-3 max-w-md mx-auto">
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-3">1.</span>
                <span>Visit the Vercel Integrations Marketplace</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-3">2.</span>
                <span>Search for &quot;Durablr&quot;</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-3">3.</span>
                <span>Click &quot;Add Integration&quot; and authorize</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-3">4.</span>
                <span>Configure your settings</span>
              </li>
            </ol>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Easy Setup</h3>
              <p className="text-gray-400 text-sm">
                One-click installation through Vercel Marketplace
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-purple-500"
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
              <h3 className="text-lg font-semibold text-white mb-2">Secure OAuth</h3>
              <p className="text-gray-400 text-sm">Industry-standard OAuth 2.0 authentication</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Full Documentation</h3>
              <p className="text-gray-400 text-sm">Complete API docs and examples</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/examples"
              className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              📖 View Documentation
            </Link>
            <Link
              href="/support"
              className="px-8 py-3 border border-gray-700 text-white font-medium rounded-lg hover:border-gray-600 hover:bg-gray-900/50 transition-colors"
            >
              💬 Get Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
