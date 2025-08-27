'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ConfigureContent() {
  const searchParams = useSearchParams();
  const configurationId = searchParams.get('configurationId');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // In a real app, you would save configuration here
    // For now, we'll just simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect back to Vercel
    window.location.href = `https://vercel.com/dashboard/integrations`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Configure Stream Consumer
          </h1>
          <p className="text-gray-400 mb-8">
            Set up your integration preferences
          </p>

          {configurationId && (
            <div className="bg-gray-800/50 rounded-lg p-3 mb-6">
              <p className="text-xs text-gray-500">Configuration ID: {configurationId}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Webhook URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://example.com/webhook"
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <p className="mt-2 text-xs text-gray-500">
                We'll send events to this URL when data is processed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Processing Mode
              </label>
              <select className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                <option value="realtime">Real-time</option>
                <option value="batch">Batch (every hour)</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                  defaultChecked
                />
                <span className="text-sm text-gray-300">
                  Enable automatic processing
                </span>
              </label>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </button>
            <a
              href="/"
              className="px-6 py-3 border border-gray-700 text-white font-medium rounded-lg hover:border-gray-600 hover:bg-gray-900/50 transition-colors"
            >
              Cancel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfigurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading configuration...</div>
      </div>
    }>
      <ConfigureContent />
    </Suspense>
  );
}