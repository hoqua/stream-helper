import Link from 'next/link';

export default function Support() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

      <div className="max-w-4xl mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-6">Support</h1>
          <p className="text-gray-400">
            Get help with StreamHelper SaaS Integration
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">📧 Contact Support</h2>
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <h3 className="text-xl font-semibold text-blue-400">Email Support</h3>
                  <p className="text-blue-200">Our primary support channel</p>
                </div>
              </div>
              <p className="text-white text-lg font-medium mb-2">
                <a href="mailto:support@durablr.run" className="hover:underline">
                  support@durablr.run
                </a>
              </p>
              <p className="text-gray-300">
                Send us detailed information about your issue, including error messages, 
                stream URLs, and webhook configurations for faster resolution.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">🚀 Quick Start</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">📖 Documentation</h3>
                <p className="text-gray-300 mb-3">
                  Check our examples page for implementation guides and API documentation.
                </p>
                <Link
                  href="/examples"
                  className="text-blue-400 hover:underline"
                >
                  View Examples →
                </Link>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">🔧 Testing</h3>
                <p className="text-gray-300 mb-3">
                  Use webhook.site to test your stream subscriptions and verify webhook delivery.
                </p>
                <a
                  href="https://webhook.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Test Webhooks →
                </a>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibent text-white mb-4">❓ Common Issues</h2>
            <div className="space-y-4">
              <div className="border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-2">Stream Not Starting</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Verify your stream URL is accessible and returns SSE data</li>
                  <li>• Check that authentication headers are correctly formatted</li>
                  <li>• Ensure webhook URL is publicly accessible</li>
                </ul>
              </div>
              <div className="border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-2">Missing Webhook Data</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Confirm webhook URL accepts POST requests</li>
                  <li>• Check webhook URL is HTTPS (required for production)</li>
                  <li>• Verify webhook endpoint handles JSON payloads</li>
                </ul>
              </div>
              <div className="border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-2">OpenAI Streaming Issues</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Set <code className="bg-gray-600 px-1 rounded">"stream": true</code> in your request body</li>
                  <li>• Use <code className="bg-gray-600 px-1 rounded">"method": "POST"</code> for chat completions</li>
                  <li>• Include proper Authorization header with your API key</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">📋 When Contacting Support</h2>
            <p className="text-gray-300 mb-4">
              To help us resolve your issue quickly, please include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Detailed description of the issue</li>
              <li>Stream ID (if applicable)</li>
              <li>Source stream URL (without sensitive tokens)</li>
              <li>Webhook destination URL</li>
              <li>Error messages or unexpected behavior</li>
              <li>Timestamp when the issue occurred</li>
              <li>Your Vercel team/project information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">⏰ Response Times</h2>
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-200">
                <strong>Standard Support:</strong> We aim to respond to all support requests within 24-48 hours 
                during business days. For urgent issues affecting production systems, please mention "URGENT" 
                in your email subject line.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">🔒 Security & Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              When reporting issues, please do not include sensitive information such as API keys, 
              authentication tokens, or personal data in your support requests. We may ask for 
              this information through secure channels if necessary for troubleshooting.
            </p>
          </section>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-gray-700 text-white font-medium rounded-lg hover:border-gray-600 hover:bg-gray-900/50 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}