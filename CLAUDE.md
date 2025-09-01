# Claude Development Notes

## Development Commands

```bash
# Start API server (auto-reloads on library changes)
npm run dev:api

# Build API for production
npm run build:api:prod
```

## Working curl Examples

With API running on http://localhost:3001:

### OpenAI Streaming Example
```bash
curl -X POST http://localhost:3001/stream/subscribe \
  -H "Content-Type: application/json" \
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
      "messages": [{"role": "user", "content": "Tell me a story"}],
      "stream": true,
      "max_tokens": 300
    }
  }'
# Response: {"streamId": "7f8c9d2e-4b5a-1c3d-9e8f-2a1b3c4d5e6f"}
```

### Get Active Streams
```bash
curl http://localhost:3001/stream/active
# Response: {"activeStreams": ["7f8c9d2e-4b5a-1c3d-9e8f-2a1b3c4d5e6f"], "count": 1}
```

### Stop Stream
```bash
curl -X DELETE http://localhost:3001/stream/subscribe/7f8c9d2e-4b5a-1c3d-9e8f-2a1b3c4d5e6f
# Response: {"message": "Stream stopped", "streamId": "7f8c9d2e-4b5a-1c3d-9e8f-2a1b3c4d5e6f"}
```

## Troubleshooting

If build fails: `rm -rf libs/*/dist && npm run dev:api`