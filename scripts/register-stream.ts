#!/usr/bin/env tsx

import { select, input, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import type { 
  StreamSubscribeRequest, 
  StreamSubscribeResponse, 
  ActiveStreamsResponse, 
  StreamStopResponse 
} from '@durablr/shared-utils-schemas';

// Default to NextJS gateway (port 3000)
const API_URL = process.env.API_URL || 'http://localhost:3000';
const PROJECT_ID = 'prj_EnR6PgZtcDR9IWYc8Pf8T49spW6t';

// Predefined test streams
const TEST_STREAMS = [
  { value: 'https://httpbin.org/stream/5', name: '📦 HTTPBin (5 events) - Quick test' },
  { value: 'https://httpbin.org/stream/10', name: '📦 HTTPBin (10 events) - Standard test' },
  { value: 'https://httpbin.org/stream/20', name: '📦 HTTPBin (20 events) - Extended test' },
  { value: 'custom', name: '✏️  Custom URL' }
];

const TEST_WEBHOOKS = [
  { value: 'https://webhook.site/test', name: '🪝 Webhook.site (recommended)' },
  { value: 'https://httpbin.org/post', name: '📮 HTTPBin POST endpoint' },
  { value: 'https://requestcatcher.com/test', name: '🎯 RequestCatcher' },
  { value: 'custom', name: '✏️  Custom webhook URL' }
];

async function checkServer(): Promise<boolean> {
  try {
    await fetch(`${API_URL}/api/stream/active`);
    return true;
  } catch {
    return false;
  }
}

async function registerStream(): Promise<void> {
  console.log(chalk.cyan('\n📡 Register New Stream\n'));

  // Select stream URL
  let streamUrl = await select({
    message: 'Choose a stream URL:',
    choices: TEST_STREAMS
  });

  if (streamUrl === 'custom') {
    streamUrl = await input({
      message: 'Enter stream URL:',
      validate: (value) => {
        try {
          new URL(value);
          return true;
        } catch {
          return 'Please enter a valid URL';
        }
      }
    });
  }

  // Select webhook URL
  let webhookUrl = await select({
    message: 'Choose a webhook URL:',
    choices: TEST_WEBHOOKS
  });

  if (webhookUrl === 'custom') {
    webhookUrl = await input({
      message: 'Enter webhook URL:',
      validate: (value) => {
        try {
          new URL(value);
          return true;
        } catch {
          return 'Please enter a valid URL';
        }
      }
    });
  }

  // Show configuration
  console.log(chalk.gray('\n📋 Configuration:'));
  console.log(chalk.gray('  Stream URL:  '), streamUrl);
  console.log(chalk.gray('  Webhook URL: '), webhookUrl);
  console.log(chalk.gray('  Project ID:  '), PROJECT_ID);

  const shouldRegister = await confirm({
    message: 'Register this stream?',
    default: true
  });

  if (!shouldRegister) {
    console.log(chalk.yellow('❌ Registration cancelled'));
    return;
  }

  try {
    console.log(chalk.gray('\n🔄 Registering stream...'));
    
    const response = await fetch(`${API_URL}/api/stream/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        streamUrl,
        webhookUrl,
        projectId: PROJECT_ID
      } as StreamSubscribeRequest)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error, null, 2));
    }

    const result: StreamSubscribeResponse = await response.json();
    console.log(chalk.green('✅ Stream registered successfully!'));
    console.log(chalk.gray('Stream ID: '), chalk.cyan(result.streamId));
  } catch (error) {
    console.log(chalk.red('❌ Failed to register stream:'));
    console.error(error);
  }
}

async function listStreams(): Promise<void> {
  try {
    console.log(chalk.gray('\n🔄 Fetching active streams...'));
    
    const response = await fetch(`${API_URL}/api/stream/active`);
    const result: ActiveStreamsResponse = await response.json();
    
    if (result.activeStreams.length === 0) {
      console.log(chalk.yellow('\n📭 No active streams'));
      return;
    }

    console.log(chalk.cyan(`\n📊 Active Streams (${result.count}):\n`));
    result.activeStreams.forEach((streamId, index) => {
      console.log(chalk.gray(`  ${index + 1}. `) + chalk.white(streamId));
    });
  } catch (error) {
    console.log(chalk.red('❌ Failed to fetch streams:'));
    console.error(error);
  }
}

async function stopStream(): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/stream/active`);
    const result: ActiveStreamsResponse = await response.json();
    
    if (result.activeStreams.length === 0) {
      console.log(chalk.yellow('\n📭 No active streams to stop'));
      return;
    }

    const streamId = await select({
      message: 'Select stream to stop:',
      choices: result.activeStreams.map((id, index) => ({
        value: id,
        name: `${index + 1}. ${id}`
      }))
    });

    const shouldStop = await confirm({
      message: `Stop stream ${streamId}?`,
      default: true
    });

    if (!shouldStop) {
      console.log(chalk.yellow('❌ Operation cancelled'));
      return;
    }

    const stopResponse = await fetch(`${API_URL}/api/stream/subscribe/${streamId}`, {
      method: 'DELETE'
    });

    if (!stopResponse.ok) {
      throw new Error(`HTTP ${stopResponse.status}`);
    }

    const stopResult: StreamStopResponse = await stopResponse.json();
    console.log(chalk.green('✅ ' + stopResult.message));
  } catch (error) {
    console.log(chalk.red('❌ Failed to stop stream:'));
    console.error(error);
  }
}

async function main(): Promise<void> {
  console.clear();
  console.log(chalk.bold.cyan('🚀 Stream Management Tool\n'));

  // Check server
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log(chalk.red('❌ NextJS server not running on ') + chalk.yellow(API_URL));
    console.log(chalk.gray('💡 Start it with: ') + chalk.cyan('npm run dev:web'));
    console.log(chalk.gray('   Or use API directly: ') + chalk.cyan('API_URL=http://localhost:3001 npm run stream'));
    process.exit(1);
  }

  console.log(chalk.green('✅ Server connected\n'));

  while (true) {
    const action = await select({
      message: 'What would you like to do?',
      choices: [
        { value: 'register', name: '➕ Register new stream' },
        { value: 'list', name: '📋 List active streams' },
        { value: 'stop', name: '🛑 Stop a stream' },
        { value: 'exit', name: '👋 Exit' }
      ]
    });

    switch (action) {
      case 'register':
        await registerStream();
        break;
      case 'list':
        await listStreams();
        break;
      case 'stop':
        await stopStream();
        break;
      case 'exit':
        console.log(chalk.cyan('\n👋 Goodbye!\n'));
        process.exit(0);
    }

    // Add some spacing before next action
    console.log('');
  }
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('❌ Unexpected error:'), error);
  process.exit(1);
});

// Handle CTRL+C
process.on('SIGINT', () => {
  console.log(chalk.cyan('\n\n👋 Goodbye!\n'));
  process.exit(0);
});

if (require.main === module) {
  main().catch(console.error);
}