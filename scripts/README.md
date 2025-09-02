# Stream Registration Tool

A simple interactive tool to register streams through the NextJS gateway.

## Usage

1. **Start the NextJS server:**
   ```bash
   npm run dev:web
   ```

2. **Run the stream registration tool:**
   ```bash
   npm run stream
   ```

## Features

- **Interactive prompts** for all configuration options
- **Input validation** through NextJS gateway
- **Multiple actions:**
  - Register new stream
  - List active streams
  - Stop existing streams
- **JSON validation** for request bodies
- **Error handling** with clear messages

## Example Flow

```
🚀 Stream Registration Tool

What would you like to do?
1. Register new stream
2. List active streams
3. Stop a stream
Choose (1-3): 1

📡 Stream URL: https://api.openai.com/v1/chat/completions
🪝 Webhook URL: https://webhook.site/abc123
📋 HTTP Method (GET/POST/PUT/PATCH/DELETE) [GET]: POST
🔑 Add custom headers? (y/n) [n]: y
Enter headers (press Enter with empty key to finish):
  Header key: Authorization
  Header value: Bearer sk-1234567890
  Header key: Content-Type
  Header value: application/json
  Header key: 
📦 Add request body? (y/n) [n]: y
📝 Request body (JSON): {"model":"gpt-4","messages":[{"role":"user","content":"Hello"}],"stream":true}
📁 Project ID [default]: my-project

📋 Configuration:
{
  "streamUrl": "https://api.openai.com/v1/chat/completions",
  "webhookUrl": "https://webhook.site/abc123",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer sk-1234567890",
    "Content-Type": "application/json"
  },
  "body": {
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello"}],
    "stream": true
  },
  "projectId": "my-project"
}

✅ Register this stream? (y/n): y

🔄 Registering stream...
✅ Stream registered successfully!
📊 Stream ID: 7f8c9d2e-4b5a-1c3d-9e8f-2a1b3c4d5e6f
```

## Requirements

- NextJS server running on http://localhost:3000
- Node.js >= 22.0.0
- tsx package (included in devDependencies)

## Error Handling

The tool will:
- Check if NextJS server is running
- Validate all inputs through the API
- Display clear error messages with validation details
- Handle CTRL+C gracefully