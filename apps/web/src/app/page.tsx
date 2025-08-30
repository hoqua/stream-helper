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

          <h1 className="text-5xl font-bold text-white mb-6">Stream Consumer</h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Simple integration for Vercel Marketplace. Process and manage data streams with ease.
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
                <span>Search for &quot;Stream Consumer&quot;</span>
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Configurable</h3>
              <p className="text-gray-400 text-sm">Customize processing modes and webhooks</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <a
              href="https://vercel.com/integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              View on Marketplace
            </a>
            <a
              href="/api/hello"
              className="px-8 py-3 border border-gray-700 text-white font-medium rounded-lg hover:border-gray-600 hover:bg-gray-900/50 transition-colors"
            >
              Test API
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
