# Deployment Configuration

## E2E Testing Setup

To enable automatic E2E testing after deployments, you need to configure Vercel to trigger GitHub repository dispatch events.

### Vercel Configuration

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Git Integration**
3. **Configure Post-Deployment Webhook**:
   - **Webhook URL**: `https://api.github.com/repos/{owner}/{repo}/dispatches`
   - **Secret**: Create a GitHub Personal Access Token with `repo` permissions
   - **Events**: Select `deployment.succeeded`
   - **Payload**: 
     ```json
     {
       "event_type": "vercel.deployment.success",
       "client_payload": {
         "url": "{{DEPLOYMENT_URL}}",
         "git": {
           "sha": "{{GITHUB_SHA}}",
           "ref": "{{GITHUB_REF_NAME}}"
         }
       }
     }
     ```

### GitHub Secrets

Add the following secret to your GitHub repository:

- **`VERCEL_WEBHOOK_SECRET`**: Your GitHub Personal Access Token

### Testing the Setup

1. **Create a PR** → Main CI pipeline runs
2. **Vercel deploys preview** → Webhook triggers E2E workflow  
3. **E2E tests run** → Results posted to PR as comment
4. **Check PR comments** → See pass/fail status with deployment URL

### Manual Testing

You can also manually trigger E2E tests against any deployment:

```bash
# Test against a specific deployment URL
PREVIEW_WEB_URL=https://your-preview-url.vercel.app npx nx e2e web-e2e
```

## Workflow Files

- **`.github/workflows/ci.yml`**: Main CI pipeline (build, test, lint, security)  
- **`.github/workflows/e2e-post-deploy.yml`**: E2E tests triggered after Vercel deployment

This setup ensures E2E tests run against real deployed infrastructure while keeping the main CI pipeline fast and focused on code quality.