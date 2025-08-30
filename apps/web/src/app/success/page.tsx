'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function SuccessContent() {
  const searchParameters = useSearchParams();
  const [installationId, setInstallationId] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);

  useEffect(() => {
    setInstallationId(searchParameters.get('installation_id'));
    setTeamId(searchParameters.get('team_id'));
  }, [searchParameters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">
            Integration Installed Successfully!
          </h2>

          <p className="text-gray-400 mb-6">
            Stream Consumer has been successfully added to your Vercel account.
          </p>

          {installationId && (
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Installation ID</p>
              <p className="text-white font-mono text-sm break-all">{installationId}</p>
            </div>
          )}

          {teamId && (
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Team ID</p>
              <p className="text-white font-mono text-sm break-all">{teamId}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <a
              href="https://vercel.com/dashboard/integrations"
              className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              View in Dashboard
            </a>
            <button
              onClick={() => (globalThis.location.href = '/')}
              className="px-6 py-3 border border-gray-700 text-white font-medium rounded-lg hover:border-gray-600 hover:bg-gray-900/50 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
