'use client';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Index() {
  const { isSignedIn } = useUser();
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

          <h1 className="text-5xl font-bold text-white mb-6">Durablr</h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Never worry about serverless timeouts again. Handle long-running streams like OpenAI
            chat, analytics feeds, or real-time APIs without hitting platform limits.
          </p>

          {isSignedIn ? (
            <div className="mb-8">
              <Link
                href="/dashboard"
                className="px-8 py-4  bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="mb-8">
              <Link
                href="/sign-in"
                className="px-8 py-4  bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Sign In
              </Link>
            </div>
          )}

          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">The Problem</h2>
            <p className="text-gray-400 mb-4">
              Your serverless function times out waiting for long streams (OpenAI responses,
              analytics data, etc). Vercel, Netlify and similar platforms have execution time
              limits.
            </p>
            <h2 className="text-lg font-semibold text-white mb-4">The Solution</h2>
            <ol className="text-left text-gray-400 space-y-2 max-w-2xl">
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-3">1.</span>
                <span>Send your streaming URL to Durablr</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-3">2.</span>
                <span>Durablr connects and receives the stream data</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-3">3.</span>
                <span>Real-time updates are sent to your webhook</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-3">4.</span>
                <span>No timeouts, no waiting!</span>
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">OpenAI Compatible</h3>
              <p className="text-gray-400 text-sm">
                Handle 30+ minute OpenAI research tasks without timeouts
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Webhooks</h3>
              <p className="text-gray-400 text-sm">
                Receive streaming data as it arrives via webhooks
              </p>
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Simple REST API</h3>
              <p className="text-gray-400 text-sm">
                Just POST your stream URL and webhook endpoint
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              🚀 Get Started - View API Docs
            </Link>
            <Link
              href="/support"
              className="px-8 py-4 border border-gray-700 text-white font-medium rounded-lg hover:border-gray-600 hover:bg-gray-900/50 transition-colors text-center"
            >
              💬 Need Help?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
