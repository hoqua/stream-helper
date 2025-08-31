import Link from 'next/link';

export default function Examples() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

      <div className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">Durablr API Examples</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real-world examples of using Durablr to handle Server-Sent Events streams without
            serverless timeouts
          </p>
        </div>

        {/* Getting Started */}
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">🚀 Getting Started</h2>
          <div className="bg-black/50 rounded-lg p-4 mb-4">
            <code className="text-green-400 text-sm">
              # Durablr API is hosted at:
              <br />
              https://www.durablr.run
            </code>
          </div>
          <p className="text-gray-400">
            The API is available at <span className="text-blue-400">https://www.durablr.run</span>
          </p>
        </div>

        {/* OpenAI Streaming Example */}
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">🤖 OpenAI Chat Streaming</h2>
          <p className="text-gray-400 mb-4">
            Stream OpenAI chat completions through webhooks to avoid serverless timeouts:
          </p>

          <div className="bg-black/50 rounded-lg p-4 mb-4 overflow-x-auto">
            <code className="text-green-400 text-xs whitespace-pre">
              {`curl -X POST https://www.durablr.run/stream/subscribe \\
  -H "Content-Type: application/json" \\
  -d '{
    "method": "POST",
    "streamUrl": "https://api.openai.com/v1/chat/completions",
    "webhookUrl": "https://webhook.site/your-unique-url",
    "headers": {
      "Authorization": "Bearer YOUR_OPENAI_API_KEY",
      "Content-Type": "application/json"
    },
    "body": {
      "model": "gpt-4",
      "messages": [{"role": "user", "content": "Write a creative story about space exploration"}],
      "stream": true,
      "max_tokens": 500
    }
  }'`}
            </code>
          </div>

          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
            <h3 className="text-blue-400 font-medium mb-2">Response:</h3>
            <code className="text-blue-300 text-sm">
              {'{'}&quot;streamId&quot;: &quot;7f8c9d2e-4b5a-1c3d-9e8f-2a1b3c4d5e6f&quot;{'}'}
            </code>
          </div>
        </div>

        {/* Simple GET Stream */}
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">📡 Simple GET Stream</h2>
          <p className="text-gray-400 mb-4">Subscribe to any Server-Sent Events endpoint:</p>

          <div className="bg-black/50 rounded-lg p-4 mb-4 overflow-x-auto">
            <code className="text-green-400 text-xs whitespace-pre">
              {`curl -X POST https://www.durablr.run/stream/subscribe \\
  -H "Content-Type: application/json" \\
  -d '{
    "streamUrl": "https://your-sse-endpoint.com/events",
    "webhookUrl": "https://webhook.site/your-unique-url",
    "headers": {
      "Authorization": "Bearer YOUR_TOKEN"
    }
  }'`}
            </code>
          </div>
        </div>

        {/* Webhook Testing */}
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">🔗 Testing with Webhook.site</h2>
          <ol className="text-gray-400 space-y-3">
            <li className="flex items-start">
              <span className="text-blue-500 font-bold mr-3 mt-0.5">1.</span>
              <span>
                Go to{' '}
                <a
                  href="https://webhook.site"
                  target="_blank"
                  className="text-blue-400 hover:underline"
                >
                  webhook.site
                </a>{' '}
                and copy your unique URL
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-bold mr-3 mt-0.5">2.</span>
              <span>
                Replace{' '}
                <code className="bg-black/50 px-2 py-1 rounded text-sm">your-unique-url</code> in
                the examples above
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-bold mr-3 mt-0.5">3.</span>
              <span>Run the curl command</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-bold mr-3 mt-0.5">4.</span>
              <span>Watch real-time events arrive at your webhook URL</span>
            </li>
          </ol>
        </div>

        {/* Webhook Response Format */}
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">📨 Webhook Response Format</h2>
          <p className="text-gray-400 mb-4">Durablr forwards streaming chunks in real-time:</p>

          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Stream Chunk (OpenAI example):</h3>
              <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400 text-xs whitespace-pre">
                  {`{
  "streamId": "7f8c9d2e-4b5a-1c3d-9e8f-2a1b3c4d5e6f",
  "type": "chunk",
  "data": "data: {\\"id\\":\\"chatcmpl-ABC123\\",\\"object\\":\\"chat.completion.chunk\\",\\"created\\":1756648138,\\"model\\":\\"gpt-4-0613\\",\\"choices\\":[{\\"index\\":0,\\"delta\\":{\\"content\\":\\" couldn\\"},\\"logprobs\\":null,\\"finish_reason\\":null}]}\\n\\n",
  "timestamp": "2025-08-31T13:49:05.649Z"
}`}
                </code>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Stream Completion:</h3>
              <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400 text-xs whitespace-pre">
                  {`{
  "streamId": "7f8c9d2e-4b5a-1c3d-9e8f-2a1b3c4d5e6f",
  "type": "completed",
  "timestamp": "2025-08-31T13:49:15.123Z"
}`}
                </code>
              </div>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mt-4">
            <h4 className="text-yellow-400 font-medium mb-2">Notes:</h4>
            <ul className="text-yellow-300 text-sm space-y-1">
              <li>• Each webhook call may contain multiple SSE chunks batched together</li>
              <li>• Data is forwarded exactly as received from the source API</li>
              <li>
                • Parse the <code className="bg-black/50 px-1 rounded">data:</code> lines to extract
                the actual JSON responses
              </li>
            </ul>
          </div>
        </div>

        {/* Management API */}
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">⚙️ Management API</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Get Active Streams:</h3>
              <div className="bg-black/50 rounded-lg p-4">
                <code className="text-green-400 text-sm">
                  curl https://www.durablr.run/stream/active
                </code>
              </div>
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3 mt-2">
                <code className="text-blue-300 text-sm">
                  {'{'}&quot;activeStreams&quot;:
                  [&quot;7f8c9d2e-4b5a-1c3d-9e8f-2a1b3c4d5e6f&quot;], &quot;count&quot;: 1{'}'}
                </code>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Stop a Stream:</h3>
              <div className="bg-black/50 rounded-lg p-4">
                <code className="text-green-400 text-sm">
                  curl -X DELETE
                  https://www.durablr.run/stream/subscribe/7f8c9d2e-4b5a-1c3d-9e8f-2a1b3c4d5e6f
                </code>
              </div>
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3 mt-2">
                <code className="text-blue-300 text-sm">
                  {'{'}&quot;message&quot;: &quot;Stream stopped&quot;, &quot;streamId&quot;:
                  &quot;7f8c9d2e-4b5a-1c3d-9e8f-2a1b3c4d5e6f&quot;{'}'}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">🌟 Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🤖</span>
                <div>
                  <h3 className="text-white font-medium">OpenAI Streaming</h3>
                  <p className="text-gray-400 text-sm">Handle long AI responses without timeouts</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">📊</span>
                <div>
                  <h3 className="text-white font-medium">Analytics Streams</h3>
                  <p className="text-gray-400 text-sm">Real-time analytics and metrics feeds</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🔄</span>
                <div>
                  <h3 className="text-white font-medium">Data Processing</h3>
                  <p className="text-gray-400 text-sm">Long-running data transformation jobs</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📈</span>
                <div>
                  <h3 className="text-white font-medium">Stock Feeds</h3>
                  <p className="text-gray-400 text-sm">Real-time financial data streams</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">📡</span>
                <div>
                  <h3 className="text-white font-medium">IoT Events</h3>
                  <p className="text-gray-400 text-sm">Device telemetry and sensor data</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">💬</span>
                <div>
                  <h3 className="text-white font-medium">Chat APIs</h3>
                  <p className="text-gray-400 text-sm">Streaming chat and messaging systems</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
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
