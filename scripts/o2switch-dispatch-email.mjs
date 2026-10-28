import { dispatchOne } from '../lib/campaigns/dispatch.js';
try { console.log(JSON.stringify({ at: new Date().toISOString(), ...await dispatchOne() })); }
catch { console.error('Email dispatch stopped; inspect campaign status. No automatic retry.'); process.exitCode = 1; }
