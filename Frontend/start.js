#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Non-interactive start wrapper for CRA dev server.
 * - Reads desired port from REACT_APP_PORT or PORT (fallback 3000).
 * - If the port is occupied, finds the next available port in a small range.
 * - Sets process.env.PORT and launches react-scripts start without interactive prompts.
 *
 * Environment variables used:
 * - REACT_APP_PORT or PORT: preferred port.
 *
 * Note: This script avoids CRA's interactive "Would you like to run on another port?"
 * which can block CI/preview environments and appear "stuck".
 */

const net = require('net');
const { spawn } = require('child_process');
const path = require('path');

const PREFERRED_PORT = parseInt(process.env.REACT_APP_PORT || process.env.PORT || '3000', 10);
const MAX_ATTEMPTS = 5; // Try up to 5 ports (e.g., 3000-3004)

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => resolve(false));
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
  });
}

// PUBLIC_INTERFACE
async function findAvailablePort(startPort, attempts) {
  /**
   * Find an available port, starting at startPort and trying subsequent ports.
   */
  for (let i = 0; i < attempts; i += 1) {
    const port = startPort + i;
    // eslint-disable-next-line no-await-in-loop
    const free = await checkPort(port);
    if (free) return port;
  }
  throw new Error(`No available port found starting at ${startPort} within ${attempts} attempts.`);
}

(async () => {
  try {
    const port = await findAvailablePort(PREFERRED_PORT, MAX_ATTEMPTS);
    process.env.PORT = String(port);

    const rsPath = require.resolve('react-scripts/scripts/start');
    const child = spawn(process.execPath, [rsPath], {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: process.env,
    });

    child.on('exit', (code) => {
      process.exit(code ?? 0);
    });
  } catch (err) {
    console.error(`[start.js] Failed to start dev server: ${err.message}`);
    process.exit(1);
  }
})();
