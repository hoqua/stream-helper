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

# Create a test stream using httpbin streaming endpoint
curl -X POST http://localhost:3001/stream/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "streamUrl": "https://httpbin.org/stream/10",
    "webhookUrl": "https://webhook.site/YOUR-UNIQUE-URL"
  }'

# Response: {"streamId": "53f9baab-92ac-4f43-afe6-6b8969e9ca00"}

# Check active streams
curl http://localhost:3001/stream/active
# Response: {"activeStreams": ["53f9baab-92ac-4f43-afe6-6b8969e9ca00"], "count": 1}
```

### Database Stream Logging

Streams are automatically logged to the database with status tracking:

- **streams** table: Contains stream metadata (URL, status, timestamps, error messages)
- **stream_logs** table: Optional stream content logging with foreign key relationship
- Foreign key relationship: `stream_logs.stream_id` → `streams.id` (cascade delete)
- Stream statuses: `active`, `completed`, `error`, `stopped`

## 🌟 Use Cases

- **🤖 OpenAI Deep Research** - Handle 30+ minute research without timeouts
- **📊 Analytics Streams** - Real-time analytics and metrics feeds  
- **🔄 Data Processing** - Long-running data transformation jobs
- **📈 Stock Feeds** - Real-time financial data streams
- **📡 IoT Events** - Device telemetry and sensor data
- **🎮 Gaming Events** - Real-time game state updates
- **💬 Chat APIs** - Streaming chat and messaging systems


## 🛠️ Development

```bash
# Start API server with auto-reload
npm run dev:api

# Start web app (if applicable)
npm run dev:web

# Start both API and web
npm run dev

# Run linting
npm run lint

# Build for production
npm run build:api:prod
```
