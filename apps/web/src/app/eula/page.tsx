import Link from 'next/link';

export default function EULA() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

      <div className="max-w-4xl mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-6">End User License Agreement</h1>
          <p className="text-gray-400">StreamHelper SaaS Integration for Vercel</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. License Grant</h2>
            <p className="text-gray-300 leading-relaxed">
              Subject to the terms of this Agreement, Anthropic grants you a non-exclusive,
              non-transferable license to use the StreamHelper integration (&quot;Service&quot;) to
              handle Server-Sent Events streams for your applications deployed on Vercel or
              compatible serverless platforms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Acceptable Use</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                You agree to use the Service only for lawful purposes and in accordance with this
                Agreement. You may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the Service to stream or process illegal, harmful, or malicious content</li>
                <li>Attempt to reverse engineer, decompile, or disassemble the Service</li>
                <li>Use the Service to violate any applicable laws or regulations</li>
                <li>Overload or attempt to disrupt the Service infrastructure</li>
                <li>Share your API access credentials with unauthorized parties</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Data Processing</h2>
            <p className="text-gray-300 leading-relaxed">
              The Service processes streaming data by forwarding it to your specified webhook
              endpoints. We do not store or retain the content of your streams. All data processing
              is performed in transit to facilitate real-time delivery to your applications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Service Availability</h2>
            <p className="text-gray-300 leading-relaxed">
              While we strive to maintain high availability, the Service is provided &quot;as
              is&quot; without guarantees of uptime or performance. We may perform maintenance,
              updates, or modifications that temporarily affect service availability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibent text-white mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ANTHROPIC SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT
              LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES,
              RESULTING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              This Agreement is effective until terminated. You may terminate it at any time by
              discontinuing use of the Service and removing the integration from your Vercel
              account. We may terminate or suspend your access immediately, without prior notice,
              for conduct that we believe violates this Agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Updates to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify this Agreement at any time. We will notify users of
              material changes via email or through the Vercel integration interface. Continued use
              of the Service after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Information</h2>
            <p className="text-gray-300 leading-relaxed">
              For questions about this Agreement or the Service, please contact us through the
              support channels provided in the Vercel integration interface.
            </p>
          </section>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-sm text-gray-500">
              Last updated:{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
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
