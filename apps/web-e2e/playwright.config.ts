import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src',
  /* Global setup for e2e data seeding */
  globalSetup: './src/global-setup.ts',
  /* Maximum time one test can run for. */
  timeout: 60 * 1000,
  /* Test timeout for expect() calls */
  expect: {
    /* Maximum time expect() should wait for the condition to be met. */
    timeout: 10000,
  },
  /* Run tests in files in parallel */
  fullyParallel: false, // Keep false for E2E to avoid conflicts
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1, // Always use 1 worker for E2E
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI 
    ? [['html'], ['junit', { outputFile: 'test-results/results.xml' }]]
    : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/testing-test-config#use */
  use: {
    /* Base URL for API calls */
    baseURL: process.env.VERCEL_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    /* Record video on failure */
    video: 'retain-on-failure',
    /* Set action timeout */
    actionTimeout: 10000,
    /* Set navigation timeout */
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'api-tests',
      use: { 
        ...devices['Desktop Chrome'],
        // Since we're doing API-only tests, we don't need a browser UI
        headless: true,
      },
      testMatch: '**/*.spec.ts',
    },
  ],

  /* Only start local server if not in CI and no Vercel URL provided */
  webServer: process.env.CI || process.env.VERCEL_URL
    ? undefined
    : {
        command: 'nx serve web',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120 * 1000,
        stdout: 'pipe',
        stderr: 'pipe',
      },
});