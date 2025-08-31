import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

      <div className="max-w-4xl mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-gray-400">
            StreamHelper SaaS Integration for Vercel
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <div className="text-gray-300 space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Integration Data</h3>
                <p>When you install the StreamHelper integration, we collect:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Your Vercel account information (name, email, team details)</li>
                  <li>Project names and deployment URLs where the integration is installed</li>
                  <li>Configuration settings for stream processing</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Usage Data</h3>
                <p>We collect operational data including:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>API usage metrics (request counts, response times)</li>
                  <li>Stream metadata (source URLs, webhook destinations, timestamps)</li>
                  <li>Error logs and performance diagnostics</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Do NOT Collect</h2>
            <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
              <p className="text-green-300 font-medium mb-2">Stream Content Protection</p>
              <ul className="list-disc list-inside space-y-1 text-green-200">
                <li>We do not store or log the actual content of your streams</li>
                <li>Stream data passes through our service in transit only</li>
                <li>No persistent storage of user data or stream contents</li>
                <li>No access to your API keys or authentication tokens</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <div className="text-gray-300 space-y-3">
              <p>We use collected information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Provide the Service:</strong> Process and forward your streams to designated webhooks</li>
                <li><strong>Maintain Performance:</strong> Monitor service health and optimize delivery</li>
                <li><strong>Improve Features:</strong> Analyze usage patterns to enhance the integration</li>
                <li><strong>Customer Support:</strong> Troubleshoot issues and provide technical assistance</li>
                <li><strong>Security:</strong> Detect and prevent abuse or unauthorized access</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Sharing and Disclosure</h2>
            <div className="text-gray-300 space-y-4">
              <p>We do not sell, trade, or rent your personal information to third parties. We may share information only in these circumstances:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>With Vercel:</strong> Integration data necessary for the Vercel platform functionality</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                <li><strong>Security Threats:</strong> To protect against fraud, abuse, or security vulnerabilities</li>
                <li><strong>Business Transfer:</strong> In the event of a merger, acquisition, or sale of assets</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
              <li>Encryption in transit using TLS/SSL for all API communications</li>
              <li>Access controls and authentication for all service components</li>
              <li>Regular security audits and monitoring</li>
              <li>Secure infrastructure hosted on trusted cloud providers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Data Retention</h2>
            <div className="text-gray-300 space-y-3">
              <p>We retain different types of data for varying periods:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Stream Content:</strong> Not retained - processed in real-time only</li>
                <li><strong>Usage Logs:</strong> 90 days for performance monitoring</li>
                <li><strong>Account Information:</strong> Until integration is uninstalled</li>
                <li><strong>Error Logs:</strong> 30 days for troubleshooting</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights</h2>
            <div className="text-gray-300 space-y-3">
              <p>You have the following rights regarding your data:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request information about data we collect</li>
                <li><strong>Deletion:</strong> Request removal of your data (subject to legal requirements)</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Uninstall:</strong> Remove the integration to stop data collection</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. International Data Transfers</h2>
            <p className="text-gray-300 leading-relaxed">
              Your data may be processed in countries other than your own. We ensure appropriate safeguards 
              are in place to protect your data in accordance with applicable privacy laws, including GDPR 
              and CCPA where relevant.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes 
              via email or through the Vercel integration interface. The &quot;Last updated&quot; date at the bottom 
              indicates when this policy was last revised.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have questions about this Privacy Policy or how we handle your data, please contact 
              us through the support channels provided in the Vercel integration interface or via the 
              contact information in your integration settings.
            </p>
          </section>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
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