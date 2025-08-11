#!/usr/bin/env node

/**
 * Test runner that provides clear error messages and alternatives
 */

const { spawn } = require('child_process');
const path = require('path');

async function runJest() {
  return new Promise((resolve, reject) => {
    const jest = spawn('pnpm', ['exec', 'jest'], {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    jest.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Jest exited with code ${code}`));
      }
    });

    jest.on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  try {
    console.log('🧪 Running Jest tests...\n');
    await runJest();
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.log('\n❌ Jest tests failed');
    
    if (error.code === 'ENOENT' || error.message.includes('command not found')) {
      console.log('\n💡 Jest is not available. You can run alternative tests:');
      console.log('   • pnpm run test:unit     - Run simple unit tests');
      console.log('   • pnpm run test:live     - Run live API tests');
      console.log('   • pnpm run test:quick    - Run quick smoke test');
      console.log('\n   To install Jest: pnpm install');
    } else {
      console.log('\n💡 Jest failed. You can also try:');
      console.log('   • pnpm run test:unit     - Run simple unit tests');
      console.log('   • pnpm run test:live     - Run live API tests');
      console.log('   • pnpm run test:coverage - Run Jest with coverage');
    }
    
    process.exit(1);
  }
}

main();