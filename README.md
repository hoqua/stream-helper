# Durablr SaaS

**Durablr** is a generic SaaS that handles any Server-Sent Events (SSE) stream without serverless timeout issues. Perfect for Vercel, Netlify, and other serverless platforms with execution time limits.

## 🚀 Quick Start

Durablr solves the problem where your serverless function times out waiting for long-running streams (OpenAI, analytics feeds, real-time APIs, etc). Instead of waiting, you subscribe to the stream URL via Durablr and receive real-time updates via webhooks.

## 📋 How It Works

1. **Your app starts long-running request** → Gets streaming URL
2. **Subscribe to stream via Durablr** → Durablr connects to SSE stream
3. **Durablr forwards events** → Real-time updates to your webhook
4. **Your app receives completion** → No timeouts, no waiting!

## 🔧 API Usage Examples

### Example 1: OpenAI Chat Streaming

```bash
# Start API server
npm run dev:api

# Subscribe to OpenAI streaming chat
curl -X POST http://localhost:3001/stream/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "method": "POST",
    "streamUrl": "https://api.openai.com/v1/chat/completions",
    "webhookUrl": "https://webhook.site/YOUR-UNIQUE-URL",
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
  }'
# Response: {"streamId": "stream_1234567890"}
```

### Example 2: GET Stream (Simple SSE)

```bash
# Subscribe to any GET-based SSE endpoint
curl -X POST http://localhost:3001/stream/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "streamUrl": "https://your-sse-endpoint.com/events",
    "webhookUrl": "https://webhook.site/YOUR-UNIQUE-URL",
    "headers": {
      "Authorization": "Bearer YOUR_TOKEN"
    }
  }'
```

### Testing with webhook.site

1. Go to https://webhook.site and copy your unique URL
2. Replace `YOUR-UNIQUE-URL` in the examples above
3. Run the curl command
4. Watch real-time events arrive at your webhook.site URL

### What Your Webhook Receives

Durablr forwards streaming chunks in real-time:

**Stream Chunk (OpenAI example):**
```json
{
  "streamId": "stream_1756648137230",
  "type": "chunk",
  "data": "data: {\"id\":\"chatcmpl-ABC123\",\"object\":\"chat.completion.chunk\",\"created\":1756648138,\"model\":\"gpt-4-0613\",\"choices\":[{\"index\":0,\"delta\":{\"content\":\" couldn\"},\"logprobs\":null,\"finish_reason\":null}]}\n\n",
  "timestamp": "2025-08-31T13:49:05.649Z"
}
```

**Stream Completion:**
```json
{
  "streamId": "stream_1756648137230", 
  "type": "completed",
  "timestamp": "2025-08-31T13:49:15.123Z"
}
```

**Notes:**
- Each webhook call may contain multiple SSE chunks batched together
- Data is forwarded exactly as received from the source API
- Parse the `data:` lines to extract the actual JSON responses

## 🔍 Management API

```bash
# Get active streams
curl http://localhost:3001/stream/active
# Response: {"activeStreams": ["stream_123", "stream_456"], "count": 2}

# Stop a stream (optional - streams auto-complete)
curl -X DELETE http://localhost:3001/stream/subscribe/stream_1234
# Response: {"message": "Stream stopped", "streamId": "stream_1234"}
```

## 📖 API Reference

### POST /stream/subscribe

Subscribe to a streaming endpoint and forward events to a webhook.

**Request Body:**
```json
{
  "streamUrl": "https://api.example.com/stream",     // Required: The SSE endpoint URL
  "webhookUrl": "https://your-app.com/webhook",      // Required: Your webhook URL  
  "method": "POST",                                  // Optional: HTTP method (default: GET)
  "headers": {                                       // Optional: Custom headers
    "Authorization": "Bearer token",
    "Content-Type": "application/json"
  },
  "body": {                                          // Optional: Request body (for POST/PUT)
    "param1": "value1"
  }
}
```

**Response:**
```json
{"streamId": "stream_1234567890"}
```

## 🧪 Testing Streams

### Quick Stream Test

Test stream creation and database logging:

```bash
# Start the API server
npm run dev:api

# Create a test stream (returns immediately with JSON response)
curl -X POST http://localhost:3001/stream/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "streamUrl": "https://httpbin.org/get",
    "webhookUrl": "https://webhook.site/YOUR-UNIQUE-URL"
  }'

# Response: {"streamId": "53f9baab-92ac-4f43-afe6-6b8969e9ca00"}

# Check active streams (should be empty - httpbin.org/get completes instantly)
curl http://localhost:3001/stream/active
# Response: {"activeStreams": [], "count": 0}
```

### Database Stream Logging

Streams are automatically logged to the database with status tracking:

- **streams** table: Contains stream metadata (URL, status, timestamps)
- **stream_logs** table: Ready for optional stream content logging (not implemented yet)
- Foreign key relationship: `stream_logs.stream_id` → `streams.id` (cascade delete)

### Verify Database Structure

```bash
# Check database tables and structure
node -e "
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: './apps/web/.env.local' });
const sql = neon(process.env.DATABASE_URL);
sql\`SELECT table_name FROM information_schema.tables WHERE table_schema='public'\`.then(tables => 
  console.log('Tables:', tables.map(t => t.table_name))
);
"
```

## 🌟 Use Cases

- **🤖 OpenAI Deep Research** - Handle 30+ minute research without timeouts
- **📊 Analytics Streams** - Real-time analytics and metrics feeds  
- **🔄 Data Processing** - Long-running data transformation jobs
- **📈 Stock Feeds** - Real-time financial data streams
- **📡 IoT Events** - Device telemetry and sensor data
- **🎮 Gaming Events** - Real-time game state updates
- **💬 Chat APIs** - Streaming chat and messaging systems

## ⚡ Benefits

- ✅ **Generic SSE Handler** - Works with any Server-Sent Events stream
- ✅ **No serverless timeouts** - Your function exits immediately  
- ✅ **Custom headers support** - Pass authentication and API keys
- ✅ **Real-time forwarding** - Events forwarded as they arrive
- ✅ **Multiple concurrent streams** - Handle hundreds of streams
- ✅ **Automatic cleanup** - Streams cleaned up on completion
- ✅ **Robust error handling** - Continues processing on webhook failures
- ✅ **Production ready** - Built with Node.js streams for performance

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/m5ZZdz4gmQ)

## Generate a library

```sh
npx nx g @nx/js:lib packages/pkg1 --publishable --importPath=@my-org/pkg1
```

## Run tasks

To build the library use:

```sh
npx nx build pkg1
```

To run any task with Nx use:

```sh
npx nx <target> <project-name>
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Versioning and releasing

To version and release the library use

```
npx nx release
```

Pass `--dry-run` to see what would happen without actually releasing the library.

[Learn more about Nx release &raquo;](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Keep TypeScript project references up to date

Nx automatically updates TypeScript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) in `tsconfig.json` files to ensure they remain accurate based on your project dependencies (`import` or `require` statements). This sync is automatically done when running tasks such as `build` or `typecheck`, which require updated references to function correctly.

To manually trigger the process to sync the project graph dependencies information to the TypeScript project references, run the following command:

```sh
npx nx sync
```

You can enforce that the TypeScript project references are always in the correct state when running in CI by adding a step to your CI job configuration that runs the following command:

```sh
npx nx sync:check
```

[Learn more about nx sync](https://nx.dev/reference/nx-commands#sync)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/js?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
