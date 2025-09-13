'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface ApiExamplesProps {
  projectId: string;
}

export function ApiExamples({ projectId }: ApiExamplesProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000';

  const examples = [
    {
      title: 'Create Stream Subscription',
      description: 'Start streaming data from any HTTP endpoint',
      command: `curl -X POST ${baseUrl}/api/stream/subscribe \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "streamUrl": "https://httpbin.org/stream/100",
    "webhookUrl": "http://localhost:3001/test",
    "method": "GET",
    "projectId": "${projectId}",
    "saveStreamData": false
  }'`,
    },
  ];

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">API Examples</h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-md transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Collapse</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Expand</span>
              </>
            )}
          </button>
        </div>
        <p className="text-gray-400">
          Copy-paste ready curl commands for your project. Replace{' '}
          <code className="bg-gray-800 px-2 py-1 rounded text-orange-400">YOUR_API_KEY</code>{' '}
          with your actual API key.
        </p>
      </div>

      {isExpanded && (
        <>
          <div className="grid gap-4">
            {examples.map((example, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{example.title}</h3>
                    <p className="text-sm text-gray-400">{example.description}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(example.command, index)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-md transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-black rounded-md p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                    <code>{example.command}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">💡 Getting Started</h3>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Replace <code className="bg-blue-900/50 px-1 rounded">YOUR_API_KEY</code> with your actual API key</li>
              <li>• Replace <code className="bg-blue-900/50 px-1 rounded">{'{streamId}'}</code> with actual stream IDs from responses</li>
              <li>• Your project ID is already configured: <code className="bg-blue-900/50 px-1 rounded">{projectId}</code></li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}