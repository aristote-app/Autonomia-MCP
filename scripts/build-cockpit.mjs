import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import './write-build-stamp.mjs';

// Passenger inherits Next's default TURBOPACK=auto from the running server.
// An explicit empty value also prevents dotenv from restoring it in the child.
// The cockpit build deliberately uses webpack on the o2switch WASM fallback.
const require = createRequire(import.meta.url);
const result = spawnSync(process.execPath, [require.resolve('next/dist/bin/next'), 'build', '--webpack'], {
  stdio: 'inherit', env: { ...process.env, TURBOPACK: '' }
});
if (result.error) {
  console.error('Unable to start the cockpit build:', result.error.code || 'spawn_failed');
  process.exitCode = 1;
} else if (result.signal) {
  console.error('Cockpit build interrupted:', result.signal);
  process.exitCode = result.signal === 'SIGINT' ? 130 : 1;
} else process.exitCode = result.status ?? 1;
