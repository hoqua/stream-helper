# Stream Consumer E2E Tests

End-to-end tests for the stream consumer application using Playwright. These tests verify the complete Web → API → Database flow via the NextJS gateway.

## Test Architecture

- **No UI Interaction**: Tests use direct fetch calls to API endpoints
- **Gateway Testing**: All requests go through NextJS web app (`/api/stream/*`)
- **Real Flow Testing**: Mirrors the logic in `scripts/register-stream.ts`

## Test Coverage

### Core Flow Test
Tests the complete stream subscription lifecycle:
1. **POST** `/api/stream/subscribe` → Create stream
2. **GET** `/api/stream/active` → Verify stream exists  
3. **DELETE** `/api/stream/subscribe/{id}` → Stop stream
4. **GET** `/api/stream/active` → Verify cleanup

### Edge Cases
- Invalid URLs (stream and webhook)
- Missing required fields
- Complex requests with headers and body
- Concurrent stream subscriptions

## Running Tests

### Local Development
```bash
# Start web server first
npm run dev:web

# Run E2E tests (in separate terminal)
npx nx e2e web-e2e
```

### Against Preview Deployments
```bash
# Test against a deployed preview
PREVIEW_WEB_URL=https://your-preview-url.com npx nx e2e web-e2e
```

## GitHub Actions Integration

E2E tests run automatically after successful Vercel deployments using the recommended `repository_dispatch` pattern:

### 🚀 **Post-Deployment Testing**
1. **Trigger**: Vercel sends `repository_dispatch` event on successful deployment
2. **Workflow**: `.github/workflows/e2e-post-deploy.yml` runs automatically  
3. **Target**: Tests run against the actual deployed preview URL
4. **Feedback**: Results posted as PR comments with pass/fail status

### 🔄 **Flow**
1. PR created → CI runs (build, test, lint, security)
2. Vercel deploys preview → Sends deployment success event
3. E2E workflow triggers → Tests against live deployment
4. Results posted to PR → Pass/fail feedback with deployment URL

### 🎯 **Benefits**
- **No URL Guessing**: Uses exact deployment URL from Vercel
- **Real Environment**: Tests against actual deployed infrastructure  
- **Async**: Doesn't block main CI pipeline
- **PR Feedback**: Clear pass/fail status in PR comments

### ⚙️ **Setup Required**
In your Vercel project settings:
1. Go to Settings → Git Integration
2. Enable "Post-deployment webhook"  
3. Set webhook URL to trigger GitHub `repository_dispatch`

### Required Secrets
- None! E2E tests work through deployed API endpoints

## Test Configuration

- **Timeout**: 60 seconds per test
- **Retries**: 2 retries on CI, 0 locally
- **Workers**: 1 (to avoid conflicts)
- **Browsers**: Chromium headless (API-only tests)

## Test Data

Uses safe, predictable test endpoints:
- **Stream URLs**: `https://httpbin.org/stream/{count}`
- **Webhooks**: `https://httpbin.org/post`, `https://webhook.site/*`
- **Project ID**: `prj_test_e2e_streaming`

## Debugging

- Test logs are available in GitHub Actions artifacts
- HTML reports generated with screenshots/videos on failure
- Use `--verbose` flag for detailed output

## Architecture Benefits

1. **Fast**: No browser rendering overhead
2. **Reliable**: Direct API calls avoid UI flakiness  
3. **Comprehensive**: Tests actual production flow
4. **Maintainable**: Follows register-stream.ts patterns